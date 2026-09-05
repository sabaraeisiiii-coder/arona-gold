import type { ReactNode } from 'react';import { AccountSidebar } from './AccountSidebar';
export function AccountLayout({children}:{children:ReactNode}){return <div className="account-layout"><AccountSidebar/><div>{children}</div></div>}
