import type { Metadata } from "next";
import { Outfit, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkThemeProvider } from "@/providers/clerk-theme-provider";
import { ClerkApiProvider } from "@/providers/ClerkApiProvider";
import { QueryProvider } from '@/providers/query-provider';
import { AuthStateWatcher } from "@/providers/AuthStateWatcher";
import { AppDataInitializer } from "@/providers/AppDataInitializer";

import { GlobalLoader, LayoutWrapper } from "@/components/layout";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
// Display/technical face used sparingly for the wordmark and nav "eyebrow" labels
// (see --font-display in globals.css) - not applied globally.
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-plex-mono" });

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
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background text-foreground min-h-screen ${outfit.className} ${plexMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClerkThemeProvider>
            <ClerkApiProvider>
              <QueryProvider>
                <AuthStateWatcher>
                  <AppDataInitializer>
                    <GlobalLoader>
                      <LayoutWrapper>
                        {children}
                      </LayoutWrapper>
                    </GlobalLoader>
                  </AppDataInitializer>
                </AuthStateWatcher>
              </QueryProvider>
            </ClerkApiProvider>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
