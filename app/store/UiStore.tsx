'use client';
import { createContext,useContext,useMemo,useState,type ReactNode } from 'react';
export type ToastTone='success'|'warning'|'error'|'info';
export type ToastMessage={id:number;text:string;tone:ToastTone};
type UiStore={toasts:ToastMessage[];notify:(text:string,tone?:ToastTone)=>void};
const UiContext=createContext<UiStore|null>(null);
export function UiStoreProvider({children}:{children:ReactNode}){const[toasts,setToasts]=useState<ToastMessage[]>([]);const value=useMemo<UiStore>(()=>({toasts,notify:(text,tone='success')=>{const id=Date.now();setToasts(items=>[...items,{id,text,tone}]);setTimeout(()=>setToasts(items=>items.filter(item=>item.id!==id)),2800)}}),[toasts]);return <UiContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite">{toasts.map(toast=><div className={`toast toast-${toast.tone}`} key={toast.id}>{toast.text}</div>)}</div></UiContext.Provider>}
export function useUiStore(){const value=useContext(UiContext);if(!value)throw new Error('useUiStore must be used inside UiStoreProvider');return value}
