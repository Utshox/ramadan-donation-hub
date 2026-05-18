import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Give and Go Relief | Eid al-Adha 2026 Qurbani",
  description: "Share your Qurbani with families in Bangladesh and Africa. A single share provides fresh meat — and dignity — to families who rarely taste it. Answer the call this Eid al-Adha.",
  openGraph: {
    title: "Give and Go Relief | Eid al-Adha 2026 Qurbani",
    description: "Share your Qurbani with families in Bangladesh and Africa. A single share provides fresh meat — and dignity — to families who rarely taste it. Answer the call this Eid al-Adha.",
    url: "https://ramadan-donation-hub.vercel.app/",
    siteName: "Give and Go Relief",
    images: [
      {
        url: "/og-eid.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "An African family gratefully receiving a parcel of fresh Qurbani meat from a Give and Go Relief volunteer at their village home.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Give and Go Relief | Eid al-Adha 2026 Qurbani",
    description: "Share your Qurbani with families in Bangladesh and Africa. A single share provides fresh meat — and dignity — to families who rarely taste it. Answer the call this Eid al-Adha.",
    images: ["/og-eid.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-display antialiased islamic-pattern min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
