import { ProductPrice } from './ProductPrice';
export function Price({ value, className='' }: { value: number; className?: string }) { return <ProductPrice price={value} className={className}/>; }
