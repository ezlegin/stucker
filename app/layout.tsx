import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <div>
          {children}
          <Analytics />
          <Toaster />
        </div>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: "Stucker",
    template: "%s · Stucker",
  },
  description: "Track your study sessions.",
  icons: {
    icon: "/logos/favicon.svg",
  },
};
