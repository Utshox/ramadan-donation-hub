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
  title: "Give and Go Relief | Ramadan 2026",
  description: "An open door for giving. Your contribution provides life-saving meals, clean water, and hope for a brighter future across the globe. Answer the call this Ramadan.",
  openGraph: {
    title: "Give and Go Relief | Ramadan 2026",
    description: "An open door for giving. Your contribution provides life-saving meals, clean water, and hope for a brighter future across the globe. Answer the call this Ramadan.",
    url: "https://ramadan-donation-hub.vercel.app/",
    siteName: "Give and Go Relief",
    images: [
      {
        url: "https://givegoglobal.org/wp-content/uploads/2024/06/6.jpg", // Smiles of Hope image as preview
        width: 1200,
        height: 630,
        alt: "Children smiling holding food parcels provided by Give and Go Relief donations.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Give and Go Relief | Ramadan 2026",
    description: "An open door for giving. Your contribution provides life-saving meals, clean water, and hope for a brighter future across the globe. Answer the call this Ramadan.",
    images: ["https://givegoglobal.org/wp-content/uploads/2024/06/6.jpg"],
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
