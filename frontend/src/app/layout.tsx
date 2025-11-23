import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";

import { Navbar, Footer } from "@/components/layout";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "IOE Drive",
  description: "A unified digital space for IOE students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-background text-foreground min-h-screen ${outfit.className}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
