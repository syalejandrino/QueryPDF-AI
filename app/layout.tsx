import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen h-screen overflow-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
