import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";
import MarketingNav from "@/components/MarketingNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL != null &&
  process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://parable.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PARABLE — The New Standard for Creator Equity",
  description:
    "The central hub for musicians and influencers. Creator sovereignty, transparent economics, and financial empowerment for artists—built for investors and strategic partners.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "PARABLE — The New Standard for Creator Equity",
    description:
      "The central hub for musicians and influencers—creator equity, transparent economics, and partner-grade surfaces.",
    url: "/",
    siteName: "PARABLE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 2048,
        height: 266,
        alt: "PARABLE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PARABLE — The New Standard for Creator Equity",
    description:
      "The central hub for musicians and influencers—creator equity and transparent economics.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="parable-ambient min-h-full text-zinc-100">
        <MarketingNav />
        {children}
      </body>
    </html>
  );
}
