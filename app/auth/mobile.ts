const DIGITS: Record<string, string> = {
  '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9',
  '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9',
};

export function normalizeIranianMobile(input: string): string {
  let value = input.trim().replace(/[۰-۹٠-٩]/g, (digit) => DIGITS[digit]).replace(/[\s()-]/g, '');
  if (value.startsWith('+98')) value = `0${value.slice(3)}`;
  else if (value.startsWith('0098')) value = `0${value.slice(4)}`;
  else if (value.startsWith('98')) value = `0${value.slice(2)}`;
  else if (value.startsWith('9')) value = `0${value}`;
  if (!/^09\d{9}$/.test(value)) throw new Error('AUTH_INVALID_MOBILE');
  return value;
}
