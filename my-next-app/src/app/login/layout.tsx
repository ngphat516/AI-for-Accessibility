import './Layout.css'
import { ReactNode } from "react"

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="login-wrapper">
        {children}
      </body>
    </html>
  );
}
