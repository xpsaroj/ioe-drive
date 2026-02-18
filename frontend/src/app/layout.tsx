import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';

import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { ClerkApiProvider } from "@/context/ClerkApiProvider";
import { StoreProvider } from "@/context/StoreProvider";
import { StoreInitializer } from "@/context/StoreInitializer";

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
              <StoreInitializer>
                <GlobalLoader>
                  <div className="flex md:flex-row flex-col min-h-screen">
                    <div className="hidden md:block sticky top-0 w-64 h-screen border-r border-gray-300">
                      <Navbar />
                    </div>

                    <div className="md:flex-1 flex flex-col min-h-screen">
                      <UserProvider >
                        <div className="flex-1">
                          {children}
                        </div>
                      </UserProvider>
                      <Footer />
                    </div>
                  </div>
                </GlobalLoader>
              </StoreInitializer>
            </StoreProvider>
          </ClerkApiProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
