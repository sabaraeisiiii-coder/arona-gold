import { and, desc, eq, gt, isNull, lt, sql } from 'drizzle-orm';
import { createDatabase } from '@/app/db/client';
import { otpRequests, sessions, users } from '@/app/db/schema';
import type { AuthUser, RequestIdentity } from './types';

export class AuthRepository {
  private db() { return createDatabase(); }
  async createOtp(input: { mobile: string; codeHash: string; expiresAt: Date; ip: string | null }) {
    const [row] = await this.db().insert(otpRequests).values(input).returning({ id: otpRequests.id }); return row;
  }
  async deleteOtp(id: string) { await this.db().delete(otpRequests).where(eq(otpRequests.id, id)); }
  async latestOtp(mobile: string) {
    const [row] = await this.db().select().from(otpRequests).where(and(eq(otpRequests.mobile, mobile), isNull(otpRequests.verifiedAt))).orderBy(desc(otpRequests.createdAt)).limit(1); return row;
  }
  async incrementAttempts(id: string) { await this.db().update(otpRequests).set({ attemptCount: sql`${otpRequests.attemptCount} + 1` }).where(eq(otpRequests.id, id)); }
  async consumeOtp(id: string, codeHash: string, maxAttempts: number) {
    const [row] = await this.db().update(otpRequests).set({ verifiedAt: new Date() }).where(and(eq(otpRequests.id, id), eq(otpRequests.codeHash, codeHash), isNull(otpRequests.verifiedAt), gt(otpRequests.expiresAt, new Date()), lt(otpRequests.attemptCount, maxAttempts))).returning({ id: otpRequests.id }); return Boolean(row);
  }
  async getOrCreateActiveUser(mobile: string): Promise<AuthUser> {
    await this.db().insert(users).values({ mobile }).onConflictDoNothing({ target: users.mobile });
    const [user] = await this.db().select({ id: users.id, mobile: users.mobile, firstName: users.firstName, lastName: users.lastName, status: users.status }).from(users).where(eq(users.mobile, mobile)).limit(1);
    if (!user) throw new Error('User upsert failed');
    return user;
  }
  async touchLogin(userId: string) { await this.db().update(users).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(users.id, userId)); }
  async createSession(userId: string, tokenHash: string, expiresAt: Date, identity: RequestIdentity) {
    await this.db().insert(sessions).values({ userId, tokenHash, expiresAt, ip: identity.ip, userAgent: identity.userAgent });
  }
  async findSession(tokenHash: string): Promise<AuthUser | undefined> {
    const [row] = await this.db().select({ id: users.id, mobile: users.mobile, firstName: users.firstName, lastName: users.lastName, status: users.status }).from(sessions).innerJoin(users, eq(sessions.userId, users.id)).where(and(eq(sessions.tokenHash, tokenHash), isNull(sessions.revokedAt), gt(sessions.expiresAt, new Date()))).limit(1);
    if (row) await this.db().update(sessions).set({ lastUsedAt: new Date() }).where(eq(sessions.tokenHash, tokenHash));
    return row;
  }
  async revokeSession(tokenHash: string) { await this.db().update(sessions).set({ revokedAt: new Date() }).where(and(eq(sessions.tokenHash, tokenHash), isNull(sessions.revokedAt))); }
}
