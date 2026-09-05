export type MarketStatus='open'|'closed'|'delayed';
export type GoldPriceSnapshot={price:number;change:number;updatedAt:string;status:MarketStatus};
