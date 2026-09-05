import { z } from 'zod';
import { normalizeIranianMobile } from './mobile';

const mobileSchema = z.string().transform((value, context) => {
  try { return normalizeIranianMobile(value); }
  catch { context.addIssue({ code: 'custom', message: 'شماره موبایل معتبر نیست' }); return z.NEVER; }
});

export const sendOtpSchema = z.object({ mobile: mobileSchema });
export const verifyOtpSchema = z.object({
  mobile: mobileSchema,
  code: z.string().regex(/^\d{6}$/, 'کد تأیید باید شش رقم باشد'),
});
