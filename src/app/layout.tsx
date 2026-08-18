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
  themeColor: "#D85A2A",
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
      <body className="antialiased bg-[#FBF9F5] dark:bg-[#121110] text-[#23201D] dark:text-[#F5F2EC] selection:bg-[#D85A2A]/30 selection:text-[#D85A2A] font-sans">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
