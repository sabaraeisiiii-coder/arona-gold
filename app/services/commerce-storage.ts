import { z } from 'zod';
const line = z.object({ productId: z.number().int().positive(), quantity: z.number().int().positive() });
const address = z.object({ id: z.union([z.number(), z.string().min(1)]), name: z.string(), mobile: z.string(), province: z.string(), city: z.string(), line: z.string(), postal: z.string(), isDefault: z.boolean() });
const order = z.object({ id: z.string(), date: z.string(), amount: z.number().nonnegative(), status: z.enum(['paid', 'processing', 'shipped', 'delivered', 'cancelled']), items: z.array(line), address: z.string(), reference: z.string() });
const savedState = z.object({ cart: z.array(line).optional(), wishlist: z.array(z.number().int().positive()).optional(), coupon: z.literal('ARONA10').nullable().optional(), addresses: z.array(address).optional(), orders: z.array(order).optional() });
export function parseCommerceState(raw: string) {
  return savedState.parse(JSON.parse(raw) as unknown);
}
