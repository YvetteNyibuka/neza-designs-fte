import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getServerBrandingSettings } from "@/lib/branding";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandingProvider } from "@/components/layout/BrandingProvider";
import { Toaster } from "sonner";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getServerBrandingSettings();

  return {
    title: "NEEZA | African Architecture & Engineering",
    description: "Crafting the Future of African Architecture. East Africa's premier architecture and engineering consultancy.",
    icons: {
      icon: branding.favicon,
      shortcut: branding.favicon,
      apple: branding.favicon,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-neutral-50 text-neutral-900">
        <BrandingProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="top-right" />
        </BrandingProvider>
      </body>
    </html>
  );
}
