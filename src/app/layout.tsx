import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NIIOMA - The New Operating System for Global Business",
  description:
    "The trusted network for technology vendors and enterprises. Global infrastructure, cognitive services, and ecosystem orchestration.",
  keywords: [
    "NIIOMA",
    "Operating System",
    "Global Business",
    "Enterprise AI",
    "Cognitive Services",
    "Ecosystem Orchestration",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#00142C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preload" href="/earth.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/hero_bg.png" as="image" />
      </head>
      <body className="antialiased bg-[#00142C] text-white min-h-screen selection:bg-[#702FA0] selection:text-white">
        {children}
      </body>
    </html>
  );
}
