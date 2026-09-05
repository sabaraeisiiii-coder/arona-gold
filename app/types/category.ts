export type CategoryStatus = 'active' | 'inactive';
export type Category = {id:string;name:string;slug:string;image:string|null;status:CategoryStatus;description?:string};
