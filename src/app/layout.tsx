import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { INVESTOR_SITE_URL } from "@/lib/investor-site";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const canonical = new URL("/", INVESTOR_SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(INVESTOR_SITE_URL),
  title: "Parable ERP",
  description: "Confidential investment overview for Parable.",
  icons: {
    icon: [{ url: "/logo/PARABLE%20LOGO.SVG", type: "image/png" }],
    shortcut: "/logo/PARABLE%20LOGO.SVG",
    apple: "/logo/PARABLE%20LOGO.SVG",
  },
  alternates: { canonical: canonical.href },
  openGraph: {
    type: "website",
    url: canonical.href,
    siteName: "Parable ERP",
    title: "Parable ERP",
    description: "Confidential investment overview for Parable.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark h-full ${orbitron.variable} ${rajdhani.variable} ${inter.variable}`}
    >
      <head>
        <link rel="preload" href="/logo/PARABLE%20LOGO.SVG" as="image" />
      </head>
      <body
        className={`${inter.className} type-body theme-streaming min-h-dvh w-full max-w-[100vw] overflow-x-hidden text-[var(--white-soft)] antialiased`}
        data-git-sha={process.env.NEXT_PUBLIC_GIT_SHA ?? ""}
      >
        {children}
      </body>
    </html>
  );
}
