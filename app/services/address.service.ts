import { apiRequest } from './api-client';
import type { Address } from '../types/address';
export function toCommerceAddress(address: ApiAddress): Address {
  return { id: address.id, name: address.receiverName, mobile: address.mobile, province: address.province, city: address.city, line: address.address, postal: address.postalCode, isDefault: address.isDefault };
}
export type ApiAddress={id:string;receiverName:string;mobile:string;province:string;city:string;address:string;plaque:string|null;unit:string|null;postalCode:string;isDefault:boolean};export type AddressInput=Omit<ApiAddress,'id'|'isDefault'>;
export const addressService={list:()=>apiRequest<ApiAddress[]>('/addresses'),create:(v:AddressInput)=>apiRequest<ApiAddress>('/addresses',{method:'POST',body:JSON.stringify(v)}),update:(id:string,v:Partial<AddressInput>)=>apiRequest<ApiAddress>(`/addresses/${id}`,{method:'PATCH',body:JSON.stringify(v)}),remove:(id:string)=>apiRequest<{deleted:boolean}>(`/addresses/${id}`,{method:'DELETE'}),setDefault:(id:string)=>apiRequest<ApiAddress>(`/addresses/${id}/default`,{method:'POST'})};
