import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';

import "./globals.css";
import { ClerkApiProvider } from "@/context/ClerkApiProvider";
import { QueryProvider } from '@/providers/query-provider';
import { AppDataInitializer } from "@/context/AppDataInitializer";

import { GlobalLoader, LayoutWrapper } from "@/components/layout";

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
            <QueryProvider>
              <AppDataInitializer>
                <GlobalLoader>
                  <LayoutWrapper>
                    {children}
                  </LayoutWrapper>
                </GlobalLoader>
              </AppDataInitializer>
            </QueryProvider>
          </ClerkApiProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
