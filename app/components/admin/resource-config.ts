import { adminRows, type AdminResource } from '../../mock/admin';
import { products } from '../../data/mock/products';
import { categories } from '../../data/mock/categories';
import { initialOrders } from '../../data/mock/account';

export type AdminRecord = { id: string; [key: string]: string };
export type AdminField = { key: string; label: string; type?: 'text' | 'number' | 'textarea'; group?: string };
type ResourceConfig = { fields: AdminField[]; create?: boolean; detail?: boolean; readOnly?: boolean };
const fields = (spec: string): AdminField[] => spec.split('|').map(part => {
  const [key, label, type, group] = part.split(':');
  return { key, label, type: (type || 'text') as AdminField['type'], group };
});
export const resourceConfig: Record<AdminResource, ResourceConfig> = {
  products: { create: true, detail: true, fields: fields('name:نام محصول:text:اطلاعات کلی|sku:SKU:text:اطلاعات کلی|slug:نامک:text:اطلاعات کلی|category:دسته‌بندی:text:اطلاعات کلی|weight:وزن:text:اطلاعات طلا|karat:عیار:number:اطلاعات طلا|wage:اجرت:number:اطلاعات طلا|price:قیمت:number:قیمت و موجودی|stock:موجودی:number:قیمت و موجودی|status:وضعیت:text:اطلاعات کلی|image:مسیر تصویر:text:رسانه|description:توضیحات:textarea:محتوا|metaTitle:عنوان SEO:text:SEO|metaDescription:توضیحات SEO:textarea:SEO') },
  categories: { create: true, detail: true, fields: fields('name:نام|slug:نامک|parent:دسته والد|count:تعداد محصول:number|sort:ترتیب:number|status:وضعیت|description:توضیحات:textarea') },
  inventory: { fields: fields('name:محصول|sku:SKU|stock:موجودی کل:number|reserved:رزرو:number|available:موجودی قابل فروش:number|status:وضعیت|updatedAt:آخرین تغییر') },
  history: { readOnly: true, fields: fields('action:رویداد|reference:مرجع|change:تغییر|date:تاریخ') },
  orders: { detail: true, readOnly: true, fields: fields('number:شماره سفارش:text:اطلاعات سفارش|customer:مشتری:text:مشتری|mobile:موبایل:text:مشتری|date:تاریخ:text:اطلاعات سفارش|amount:مبلغ:text:مالی|status:وضعیت:text:وضعیت و تاریخچه|address:آدرس:text:ارسال|shipping:روش ارسال:text:ارسال|reference:مرجع پرداخت:text:مالی') },
  payments: { detail: true, readOnly: true, fields: fields('number:شناسه پرداخت|order:سفارش|customer:مشتری|amount:مبلغ|gateway:درگاه|status:وضعیت|transaction:شناسه تراکنش|reference:شماره مرجع|createdAt:زمان ایجاد|verifiedAt:زمان تأیید') },
  users: { detail: true, readOnly: true, fields: fields('name:نام|mobile:موبایل|status:وضعیت|registeredAt:تاریخ ثبت|lastLogin:آخرین ورود|orderCount:تعداد سفارش|totalSpent:مجموع خرید') },
  discounts: { create: true, detail: true, fields: fields('title:عنوان|code:کد|type:نوع|value:مقدار|minimum:حداقل سفارش:number|maximum:سقف تخفیف:number|limit:محدودیت استفاده:number|used:تعداد استفاده:number|start:شروع|end:پایان|status:وضعیت') },
  banners: { create: true, detail: true, fields: fields('title:عنوان|start:شروع|end:پایان|sort:ترتیب|status:وضعیت|image:مسیر تصویر|link:مقصد') },
  announcements: { fields: fields('title:عنوان|message:پیام:textarea|audience:مخاطب|start:شروع|end:پایان|dismissible:قابل بستن|status:وضعیت') },
  content: { detail: true, fields: fields('title:عنوان|slug:نامک|content:محتوا:textarea|metaTitle:عنوان SEO|metaDescription:توضیحات SEO:textarea|status:وضعیت|updatedAt:آخرین تغییر') },
  roles: { fields: fields('name:نام نقش|description:توضیحات:textarea|userCount:تعداد کاربران|permissionCount:تعداد مجوزها|permissions:مجوزهای آزمایشی:textarea|status:وضعیت') },
  audit: { readOnly: true, fields: fields('date:تاریخ|admin:مدیر|module:ماژول|action:عملیات|target:هدف|before:مقدار قبلی|after:مقدار جدید|reason:دلیل|reference:مرجع') },
  ux: { readOnly: true, fields: fields('title:حالت|section:بخش|type:نوع|status:وضعیت') },
};

const numericText = (value: string) => Number(value.replace(/[۰-۹]/g, char => String(char.charCodeAt(0) - 1776)).replace(/[^\d.]/g, ''));
/** Do not join contradictory fixture records just because their IDs happen to match. */
export function matchingOrder(record?: AdminRecord) {
  return record && initialOrders.find(order => order.id === record.number && order.amount === numericText(record.amount || ''));
}

const mapping: Partial<Record<AdminResource, string[]>> = {
  inventory: ['name', 'sku', 'stock', 'status'], history: ['action', 'reference', 'change', 'date'],
  discounts: ['title', 'code', 'value', 'status'], users: ['name', 'mobile', 'orderCount', 'status'],
  payments: ['number', 'order', 'amount', 'status'], orders: ['number', 'customer', 'amount', 'status'],
  banners: ['title', 'link', 'sort', 'status'], announcements: ['title', 'audience', 'start', 'status'],
  content: ['title', 'slug', 'updatedAt', 'status'], roles: ['name', 'permissionCount', 'userCount', 'status'],
  audit: ['action', 'admin', 'target', 'date'], ux: ['title', 'section', 'type', 'status'],
};
/** UI adapters only: original fixtures remain unchanged. Missing values stay empty. */
export function initialAdminRecords(): Record<AdminResource, AdminRecord[]> {
  const records = {} as Record<AdminResource, AdminRecord[]>;
  for (const resource of Object.keys(resourceConfig) as AdminResource[]) {
    records[resource] = adminRows[resource].map((row, index) => {
      const record: AdminRecord = { id: String(index + 1) };
      (mapping[resource] || []).forEach((key, position) => { record[key] = row[position] || ''; });
      return record;
    });
  }
  records.products = products.map(product => ({
    id: String(product.id), name: product.name, sku: product.sku, slug: product.slug,
    category: product.category, weight: product.weight, karat: String(product.karat), wage: String(product.wage),
    price: String(product.price), stock: String(product.stock), status: product.status,
    image: (product.images.find(image => image.isPrimary) || product.images[0])?.src || '', description: product.description,
  }));
  records.categories = categories.map(category => ({ id: category.id, name: category.name, slug: category.slug,
    count: String(products.filter(product => product.categorySlug === category.slug).length), status: category.status, description: category.description || '',
  }));
  records.inventory = records.inventory.map(record => ({ ...record, stock: String(numericText(record.stock)) }));
  records.orders = records.orders.map(record => {
    const order = matchingOrder(record);
    return { ...record, id: record.number, mobile: records.users.find(user => user.name === record.customer)?.mobile || '',
      date: order?.date || '', address: order?.address || '', reference: order?.reference || '' };
  });
  records.payments = records.payments.map(record => ({ ...record, id: record.number,
    customer: records.orders.find(order => order.number === record.order)?.customer || '',
  }));
  return records;
}

export const displayValue = (value?: string) => value || 'ثبت نشده';
export function normalizeAdminSearch(value: string) {
  return value.toLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[۰-۹]/g, char => String(char.charCodeAt(0) - 1776)).trim();
}
