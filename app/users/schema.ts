import { z } from 'zod';
const name=z.string().trim().max(80).transform(v=>v||null).nullable().optional();
export const updateProfileSchema=z.object({firstName:name,lastName:name}).refine(v=>v.firstName!==undefined||v.lastName!==undefined,'حداقل یک فیلد لازم است');
