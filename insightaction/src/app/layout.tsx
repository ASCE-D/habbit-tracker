"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ToasterContext from "./api/contex/ToasetContex";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Common/PreLoader";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname(); // Use usePathname instead of useRouter

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Check if the current route should bypass the layout
  const bypassRoutes = ["/journal/habits"]; // Add any other routes that should bypass the layout
  const shouldBypassLayout = bypassRoutes.includes(pathname);

  return (
    <html suppressHydrationWarning={true} className="!scroll-smooth" lang="en">
      <head />

      <body>
        {loading ? (
          <PreLoader />
        ) : shouldBypassLayout ? (
          // Render children directly without the layout
          children
        ) : (
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="dark"
            >
              <ToasterContext />
              <Header />
              {children}
              <Footer />
              <ScrollToTop />
            </ThemeProvider>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
