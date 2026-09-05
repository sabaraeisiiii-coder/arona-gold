const SENSITIVE_KEYS = /password|otp|token|authorization|cookie|api[-_]?key|secret|credential/i;
const REDACTED = '[REDACTED]';

export function redactSensitive(value: unknown, seen = new WeakSet<object>()): unknown {
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return '[CIRCULAR]';
  seen.add(value);

  if (Array.isArray(value)) return value.map((item) => redactSensitive(item, seen));

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SENSITIVE_KEYS.test(key) ? REDACTED : redactSensitive(item, seen),
    ]),
  );
}
