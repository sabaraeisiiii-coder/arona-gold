import type { Metadata } from "next";
import "./globals.css";
import "./extra.css";
import "./styles/functional.css";
import { AppStoreProvider } from "./store/AppStore";
import { ApplicationChrome } from "./components/layout/ApplicationChrome";

export const metadata: Metadata = {
  applicationName: "آرونا گلد",
  title: {
    default: "آرونا گلد | فروشگاه طلای اصیل",
    template: "%s | آرونا گلد",
  },
  description:
    "فروشگاه آنلاین آرونا گلد؛ عرضه طلای ۱۸ عیار با ضمانت اصالت و فاکتور رسمی",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "آرونا گلد",
    title: "آرونا گلد | فروشگاه طلای اصیل",
    description:
      "فروشگاه آنلاین آرونا گلد؛ عرضه طلای ۱۸ عیار با ضمانت اصالت و فاکتور رسمی",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AppStoreProvider>
          <ApplicationChrome>{children}</ApplicationChrome>
        </AppStoreProvider>
      </body>
    </html>
  );
}
