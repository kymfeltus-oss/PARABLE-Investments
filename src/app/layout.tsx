import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const pitchScript = Playfair_Display({
  variable: "--font-pitch-script",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Pitch Lock", template: "%s · Pitch Lock" },
  description:
    "Secure investor pitch platform — protected pitch rooms, Pitch Access Agreements, and investor dashboards.",
  applicationName: "Pitch Lock",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pitch Lock",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${pitchScript.variable} h-full antialiased`}
    >
      <body className="pl-app-shell min-h-dvh bg-[var(--pl-void)] font-sans pl-text">
        {children}
      </body>
    </html>
  );
}
