export const mainNavigation = [
  { label: 'خانه', href: '/' },
  { label: 'فروشگاه', href: '/products' },
  { label: 'همه محصولات', href: '/products?sort=newest' },
  { label: 'درباره ما', href: '/about' },
  { label: 'تماس با ما', href: '/contact' },
  { label: 'راهنمای خرید', href: '/guide' },
];

export const quickNavigation = [
  mainNavigation[1],
  mainNavigation[2],
  { label: 'علاقه‌مندی‌ها', href: '/wishlist' },
];

export const customerNavigation = [
  { label: 'راهنمای خرید', href: '/guide' },
  { label: 'سوالات متداول', href: '/faq' },
  { label: 'روش‌های ارسال', href: '/guide#shipping' },
  { label: 'شرایط بازگشت کالا', href: '/faq#returns' },
  { label: 'قوانین و مقررات', href: '/terms' },
];
