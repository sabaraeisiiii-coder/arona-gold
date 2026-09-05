import { z } from 'zod'; import { normalizeIranianMobile } from '@/app/auth/mobile';
const required=(max:number)=>z.string().trim().min(1).max(max); const mobile=z.string().transform((v,c)=>{try{return normalizeIranianMobile(v)}catch{c.addIssue({code:'custom',message:'شماره موبایل معتبر نیست'});return z.NEVER}});
export const addressInputSchema=z.object({receiverName:required(120),mobile,province:required(80),city:required(80),address:required(500),plaque:z.string().trim().max(20).optional().nullable(),unit:z.string().trim().max(20).optional().nullable(),postalCode:z.string().transform(v=>v.replace(/\s/g,'')).pipe(z.string().regex(/^\d{10}$/,'کد پستی باید ده رقم باشد'))});
export const addressPatchSchema=addressInputSchema.partial().refine(v=>Object.keys(v).length>0,'حداقل یک فیلد لازم است');
export const addressParamsSchema=z.object({id:z.uuid()});
