'use client';
import { usePathname } from 'next/navigation';import type { ReactNode } from 'react';import { Header } from './Header';import { Footer } from './Footer';import { Container } from './Container';
export function ApplicationChrome({children}:{children:ReactNode}){const pathname=usePathname();if(pathname.startsWith('/admin'))return <>{children}</>;return <div className="site-shell"><Header/><main><Container className="container">{children}</Container></main><Footer/></div>}
