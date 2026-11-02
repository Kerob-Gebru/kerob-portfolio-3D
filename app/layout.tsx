import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Michroma } from "next/font/google";
import "./globals.css";

// Display: Michroma — wide, engineered caps, always tracked out.
// Text: Manrope. Telemetry: IBM Plex Mono.
const display = Michroma({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Kerob Gebru — Full-Stack Software Engineer",
  description:
    "Kerob Gebru is a full-stack software engineer based in Addis Ababa, Ethiopia. Explore projects in React, Next.js, NestJS and microservices, including KBCoffeeLink, a B2B marketplace for the Ethiopian coffee trade.",
  openGraph: {
    title: "Kerob Gebru — Full-Stack Software Engineer",
    description: "Full-stack engineering, rooted in Ethiopia.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}>{children}</body>
    </html>
  );
}
