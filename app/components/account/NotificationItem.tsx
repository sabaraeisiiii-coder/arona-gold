export function NotificationItem({title,body,date}:{title:string;body:string;date:string}){return <article className="ds-card"><small>{date}</small><h3>{title}</h3><p>{body}</p></article>}
