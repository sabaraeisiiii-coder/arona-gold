import { trustItems } from '../../data/mock/content';
export function TrustSection(){return <section className="trust-grid">{trustItems.map(([icon,title,text])=><article className="trust-card" key={title}><b>{icon}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}</section>}
