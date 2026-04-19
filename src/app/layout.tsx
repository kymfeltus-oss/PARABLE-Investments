import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { INVESTOR_SITE_URL } from "@/lib/investor-site";

const inter = Inter({ subsets: ["latin"] });

/** Condensed tech / streaming UI — common gaming & broadcast dashboard look */
const streaming = Rajdhani({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-streaming",
  display: "swap",
});

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#070708",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${inter.className} ${streaming.variable} min-h-dvh w-full max-w-[100vw] overflow-x-hidden text-white antialiased`}
        data-git-sha={process.env.NEXT_PUBLIC_GIT_SHA ?? ""}
      >
        {children}
      </body>
    </html>
  );
}
