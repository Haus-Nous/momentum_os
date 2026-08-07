import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "../components/common/ErrorBoundary";

export const metadata: Metadata = {
  title: "MOMENTUM OS | Personal Productivity Operating System",
  description: "Build Systems, Not Motivation. A production-grade Personal Productivity Operating System.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 dark:bg-[#07090e] text-gray-900 dark:text-gray-100 selection:bg-emerald-500/30 selection:text-emerald-400 font-sans">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
