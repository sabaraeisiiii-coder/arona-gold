import { describe, expect, it } from 'vitest';
import { catalogSnapshot, filterProducts, searchProducts } from '../app/services/product.service';

describe('shared product search', () => {
  it('matches name, SKU, category and slug', () => {
    for (const query of ['انگشتر طلای آفتاب', 'zr-1001', 'انگشتر', 'ring-aftab']) {
      expect(filterProducts(query).some(product => product.id === 1)).toBe(true);
    }
  });
  it('normalizes Persian/Arabic letters, digits, spacing and diacritics', () => {
    expect(filterProducts('  انگشتر طلاي آفتاب  ')[0]?.id).toBe(1);
    expect(filterProducts('ZR-۱۰۰۱')[0]?.id).toBe(1);
    expect(filterProducts('zr-١٠٠١')[0]?.id).toBe(1);
    const product = { ...catalogSnapshot[0], name: 'طلای کودک نقره‌ای' };
    expect(filterProducts('كودك نقره اي', [product])).toEqual([product]);
    expect(filterProducts('طَلای', [product])).toEqual([product]);
  });
  it('keeps the existing route search consistent and excludes hidden products', async () => {
    expect(filterProducts('')).toEqual([]);
    expect(filterProducts('   ')).toEqual([]);
    expect(filterProducts('نام ناموجود')).toEqual([]);
    expect(filterProducts('آفتاب', [{ ...catalogSnapshot[0], status: 'draft' }])).toEqual([]);
    expect((await searchProducts('ZR-۱۰۰۱')).map(product => product.id)).toEqual(filterProducts('ZR-۱۰۰۱').map(product => product.id));
  });
});
