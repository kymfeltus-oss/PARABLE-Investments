import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bebas_Neue, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { INVESTOR_SITE_URL } from "@/lib/investor-site";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
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
  themeColor: "#030712",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark h-full ${bebasNeue.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <head>
        <link rel="preload" href="/logo/PARABLE%20LOGO.SVG" as="image" />
      </head>
      <body
        className={`${inter.className} theme-streaming min-h-dvh w-full max-w-[100vw] overflow-x-hidden text-[#F8FAFC] antialiased`}
        data-git-sha={process.env.NEXT_PUBLIC_GIT_SHA ?? ""}
      >
        {children}
      </body>
    </html>
  );
}
