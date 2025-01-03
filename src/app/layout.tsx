import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SidebarProvider } from "@/context/SidebarContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sakhi  AI",
  description: "Your AI Friend to help you with your Questions. ",
  icons: {
    icon: "/ai-logo-no-bg.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased scrollbar-hide`}
          >
            <SidebarProvider>
              {children}
            </SidebarProvider>
            <Toaster />
            <SpeedInsights />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
