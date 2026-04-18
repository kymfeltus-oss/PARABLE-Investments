import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { INVESTOR_SITE_URL } from "@/lib/investor-site";

const inter = Inter({ subsets: ["latin"] });

const canonical = new URL("/", INVESTOR_SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(INVESTOR_SITE_URL),
  title: "Parable Investments",
  description: "Confidential investment overview for Parable.",
  alternates: { canonical: canonical.href },
  openGraph: {
    type: "website",
    url: canonical.href,
    siteName: "Parable Investments",
    title: "Parable Investments",
    description: "Confidential investment overview for Parable.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} text-white antialiased`}
        data-git-sha={process.env.NEXT_PUBLIC_GIT_SHA ?? ""}
      >
        {children}
      </body>
    </html>
  );
}
