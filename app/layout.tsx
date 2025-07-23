import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soukyo Rent a car",
  description: "This is Soukyo car rent web. Let's exploring Japan with Soukyo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
