import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NetworkCanvas } from "@/components/canvas/NetworkCanvas";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daniel Cross | Lead Mobile Engineer",
  description:
    "Ex-MetaMask lead mobile engineer building on Solana. React Native, Web3, and shipped products, from a 30M+ user wallet to live Solana apps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <NetworkCanvas />
        {children}
      </body>
    </html>
  );
}
