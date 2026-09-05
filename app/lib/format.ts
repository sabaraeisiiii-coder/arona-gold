const moneyFormatter=new Intl.NumberFormat('fa-IR');const dateFormatter=new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium'});const dateTimeFormatter=new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium',timeStyle:'short'});
export function formatMoney(value:number,currency='تومان'){return `${moneyFormatter.format(value)} ${currency}`}
export function formatNumber(value:number){return moneyFormatter.format(value)}
export function formatDate(value:Date|string|number){return dateFormatter.format(new Date(value))}
export function formatDateTime(value:Date|string|number){return dateTimeFormatter.format(new Date(value))}
