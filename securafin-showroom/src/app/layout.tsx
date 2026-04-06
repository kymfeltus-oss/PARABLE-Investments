import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ShowroomChrome from "@/components/ShowroomChrome";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#050508",
};

export const metadata: Metadata = {
  title: "Securafin-AI — Digital Showroom",
  description:
    "Ready-to-use AI app suite and custom Innovation Lab. Enterprise security, small-business speed.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Securafin-AI",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <ShowroomChrome>{children}</ShowroomChrome>
      </body>
    </html>
  );
}
