export type ShippingMethod = {
  id: number;
  name: string;
  desc: string;
  cost: number;
};
export const shippingMethods: ShippingMethod[] = [
  {
    id: 0,
    name: "پیک ویژه تهران",
    desc: "تحویل همان روز تا ۲ روز کاری",
    cost: 65000,
  },
  {
    id: 1,
    name: "پست پیشتاز بیمه‌شده",
    desc: "تحویل ۲ تا ۴ روز کاری",
    cost: 45000,
  },
  {
    id: 2,
    name: "ارسال رایگان",
    desc: "ویژه سفارش‌های بالای ۵۰ میلیون",
    cost: 0,
  },
];
