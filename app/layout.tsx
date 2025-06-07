import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ChatwootWidget } from "@/components/ChatwootWidget";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soukyo Rent a cat",
  description: "This is Soukyo car rent web. Let's  exploring Japan with Soukyo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mt-16`}
      >
        <SessionProvider>
          <Header />
          <ChatwootWidget />
          {children}
          <Toaster position="top-right" />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
