import { AppError, RateLimitError } from '@/app/lib/errors';
import type { Logger } from '@/app/logging/logger';
import { getConfig } from '@/app/config/env';
import type { RateLimiter } from '@/app/security/rate-limit';
import { generateOtp, randomToken, secureHash } from './crypto';
import { AuthRepository } from './repository';
import { DevelopmentSmsProvider, UnconfiguredSmsProvider, type SmsProvider } from './sms';
import type { RequestIdentity } from './types';
import { MemoryRateLimiter } from './rate-limiter';

const memoryLimiter = new MemoryRateLimiter();
const cookieName = 'zarinbaz_session';
export const AUTH_COOKIE = cookieName;

export class AuthService {
  constructor(private repo = new AuthRepository(), private limiter?: RateLimiter, private sms?: SmsProvider) {}
  private dependencies() {
    const config = getConfig();
    const limiter = this.limiter ?? (config.APP_ENV === 'development' ? memoryLimiter : undefined);
    if (!limiter) throw new RateLimitError('Authentication rate limiter is unavailable');
    const sms = this.sms ?? (config.APP_ENV === 'development' ? new DevelopmentSmsProvider() : new UnconfiguredSmsProvider());
    return { config, limiter, sms };
  }
  async sendOtp(mobile: string, identity: RequestIdentity, logger: Logger) {
    const { config, limiter, sms } = this.dependencies();
    const rate = { limit: config.OTP_RATE_LIMIT_MAX, windowSeconds: config.OTP_RATE_LIMIT_WINDOW_SECONDS };
    for (const key of [`otp:mobile:${mobile}`, `otp:ip:${identity.ip ?? 'unknown'}`]) if (!(await limiter.check(key, rate)).allowed) throw new RateLimitError();
    const code = generateOtp();
    const codeHash = await secureHash(`${mobile}:${code}`, config.OTP_HASH_SECRET);
    const expiresAt = new Date(Date.now() + config.OTP_EXPIRES_SECONDS * 1000);
    const request = await this.repo.createOtp({ mobile, codeHash, expiresAt, ip: identity.ip });
    try { await sms.sendOtp(mobile, code); }
    catch (error) { await this.repo.deleteOtp(request.id); logger.error('OTP_SEND_FAILED', error, { mobile: `${mobile.slice(0, 4)}***${mobile.slice(-2)}` }); throw new AppError('ارسال کد تأیید ناموفق بود', { status: 503, code: 'AUTH_OTP_SEND_FAILED' }); }
    logger.info('OTP_REQUESTED', { mobile: `${mobile.slice(0, 4)}***${mobile.slice(-2)}` });
    return { expiresIn: config.OTP_EXPIRES_SECONDS, ...(config.APP_ENV === 'development' && config.AUTH_DEBUG_OTP ? { debugOtp: code } : {}) };
  }
  async verifyOtp(mobile: string, code: string, identity: RequestIdentity, logger: Logger) {
    const { config } = this.dependencies(); const otp = await this.repo.latestOtp(mobile);
    if (!otp) throw new AppError('کد تأیید نامعتبر است', { status: 400, code: 'AUTH_INVALID_OTP' });
    if (otp.attemptCount >= config.OTP_MAX_ATTEMPTS) throw new AppError('تعداد تلاش بیش از حد مجاز است', { status: 429, code: 'AUTH_TOO_MANY_ATTEMPTS' });
    if (otp.expiresAt <= new Date()) throw new AppError('کد تأیید منقضی شده است', { status: 400, code: 'AUTH_OTP_EXPIRED' });
    const hash = await secureHash(`${mobile}:${code}`, config.OTP_HASH_SECRET);
    if (hash !== otp.codeHash) { await this.repo.incrementAttempts(otp.id); logger.warn('LOGIN_FAILED'); throw new AppError('کد تأیید نامعتبر است', { status: 400, code: 'AUTH_INVALID_OTP' }); }
    if (!(await this.repo.consumeOtp(otp.id, hash, config.OTP_MAX_ATTEMPTS))) throw new AppError('کد تأیید نامعتبر است', { status: 400, code: 'AUTH_INVALID_OTP' });
    const user = await this.repo.getOrCreateActiveUser(mobile);
    if (user.status === 'blocked') { logger.warn('LOGIN_FAILED', { userId: user.id, reason: 'blocked' }); throw new AppError('حساب کاربری مسدود است', { status: 403, code: 'AUTH_ACCOUNT_BLOCKED' }); }
    const token = randomToken(); const tokenHash = await secureHash(token, config.SESSION_SECRET);
    await this.repo.createSession(user.id, tokenHash, new Date(Date.now() + config.SESSION_EXPIRES_SECONDS * 1000), identity); await this.repo.touchLogin(user.id);
    logger.info('OTP_VERIFIED', { userId: user.id }); logger.info('LOGIN_SUCCESS', { userId: user.id });
    return { user, token, expiresIn: config.SESSION_EXPIRES_SECONDS };
  }
  async authenticate(token?: string) {
    if (!token) throw new AppError('ورود به حساب لازم است', { status: 401, code: 'AUTH_UNAUTHORIZED' });
    const config = getConfig(); const user = await this.repo.findSession(await secureHash(token, config.SESSION_SECRET));
    if (!user) throw new AppError('نشست کاربری منقضی شده است', { status: 401, code: 'AUTH_SESSION_EXPIRED' });
    if (user.status === 'blocked') throw new AppError('حساب کاربری مسدود است', { status: 403, code: 'AUTH_ACCOUNT_BLOCKED' });
    return user;
  }
  async logout(token: string | undefined, logger: Logger) { if (token) { const config = getConfig(); await this.repo.revokeSession(await secureHash(token, config.SESSION_SECRET)); } logger.info('LOGOUT'); }
}
