export interface SmsProvider { sendOtp(mobile: string, code: string): Promise<void>; }

export class DevelopmentSmsProvider implements SmsProvider {
  async sendOtp(mobile: string, code: string): Promise<void> {
    void mobile; void code;
    // Delivery is intentionally side-effect free. AUTH_DEBUG_OTP explicitly enables local retrieval.
  }
}

export class UnconfiguredSmsProvider implements SmsProvider {
  async sendOtp(): Promise<void> { throw new Error('SMS provider is not configured'); }
}
