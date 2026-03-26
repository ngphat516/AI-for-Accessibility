import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      
      <body className="min-h-screen flex flex-col" ><Providers>{children}</Providers></body>
    </html>
  );
}
