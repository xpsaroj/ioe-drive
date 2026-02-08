import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';

import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { ClerkApiProvider } from "@/context/ClerkApiProvider";
import { StoreProvider } from "@/context/StoreProvider";

import { Navbar, Footer, GlobalLoader } from "@/components/layout";

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
        <ClerkProvider>
          <ClerkApiProvider>
            <StoreProvider>
              <GlobalLoader>
                <Navbar />
                <UserProvider >
                  {children}
                </UserProvider>
                <Footer />
              </GlobalLoader>
            </StoreProvider>
          </ClerkApiProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
