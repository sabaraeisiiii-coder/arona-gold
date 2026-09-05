export type Payment={id:string;orderId:string;amount:number;status:'pending'|'paid'|'failed'|'refunded';reference?:string};
