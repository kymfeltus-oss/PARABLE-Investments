"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

const APP_TITLE =
  process.env.NEXT_PUBLIC_APP_VARIANT === "parable-study-ai"
    ? "PARABLE Study AI"
    : "PARABLE";

// Note: Metadata must be handled differently in Client Components or 
// defined in a separate 'metadata.ts' file if needed for SEO.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // LIST OF PROTECTED PATHS: No menu allowed here
  const entryPages = [
    "/",               // Flash / Landing Page
    "/welcome",        // Welcome Page
    "/login",          // Login Page
    "/create-account"  // Create Account Page
  ];

  const shouldHideNav = entryPages.includes(pathname);

  useEffect(() => {
    document.title = APP_TITLE;
  }, []);

  const isStudyAI = process.env.NEXT_PUBLIC_APP_VARIANT === "parable-study-ai";

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-black text-white antialiased ${isStudyAI ? "variant-study-ai" : "selection:bg-[#00f2ff] selection:text-black"}`}
      >
        <AuthProvider>
          {children}
          {!shouldHideNav && <BottomNav />}
        </AuthProvider>
      </body>
    </html>
  );
}