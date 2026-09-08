import { expect, it } from 'vitest';
import { parseCommerceState } from '../app/services/commerce-storage';
it('rejects malformed browser state before it reaches UI array operations', () => {
  for (const value of ['null', '{"cart":{}}', '{"cart":[{"productId":1,"quantity":-1}]}', '{"orders":[{"status":"unknown"}]}']) {
    expect(() => parseCommerceState(value)).toThrow();
  }
});
it('preserves valid partial snapshots from existing clients', () => {
  expect(parseCommerceState('{"cart":[],"wishlist":[1,2]}')).toEqual({ cart: [], wishlist: [1, 2] });
});
