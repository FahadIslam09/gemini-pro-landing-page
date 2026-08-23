import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali, Outfit } from "next/font/google";
import { Suspense } from "react";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-bangla",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Google AI Pro — 18 Months Premium Subscription @ ৳299 BDT",
  description:
    "Google AI Pro 18 মাসের প্রিমিয়াম সাবস্ক্রিপশন মাত্র ৳299 টাকায়। Gemini 3.1 Pro, 5 TB Google One Storage, Workspace AI ও YouTube Premium সুবিধা নিন নিরাপদে।",
  keywords: [
    "Google AI Pro",
    "Gemini Advanced",
    "Google One 5TB",
    "YouTube Premium",
    "AI Subscription Bangladesh",
    "Gemini 3.1 Pro",
    "bKash AI payment",
  ],
  authors: [{ name: "Google AI Pro Subscription Platform" }],
  openGraph: {
    title: "Google AI Pro — 18 Months Subscription @ ৳299 BDT",
    description: "Gemini Advanced, 2 TB Storage, Workspace AI & YouTube Premium in Bangladesh.",
    type: "website",
    locale: "bn_BD",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%235B55D8' d='M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z'/></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#5B55D8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${notoSansBengali.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-bangla antialiased selection:bg-brand-purple/20 selection:text-brand-purple">
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
