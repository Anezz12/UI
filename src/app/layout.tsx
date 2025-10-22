import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WagmiProviderComp from "@/lib/wagmi/wagmi-proved";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/lib/wagmi/config";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Home/Footer";

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Super Cluster",
  description: "Bridge your PT to supported chains with Super Cluster",
  icons: {
    icon: [
      { url: "/logo-sc.png" },
      { url: "/logo-sc.png", sizes: "16x16", type: "image/png" },
      { url: "/logo-sc.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/logo-sc.png" }],
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const initialState = cookieToInitialState(config, headersList.get("cookie"));

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo-sc.png" />
        <link rel="apple-touch-icon" href="/logo-sc.png" />
      </head>
      <body
        className={`${overpass.variable} antialiased bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 bg-fixed min-h-screen`}>
        <WagmiProviderComp initialState={initialState}>
          <Toaster position="bottom-left" />
          <Navbar />
          <main className="max-w-7xl w-full mx-auto mt-32 px-4">
            {children}
          </main>
          <Footer />
        </WagmiProviderComp>
        <Analytics />
      </body>
    </html>
  );
}
