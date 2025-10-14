import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WagmiProviderComp from "@/lib/wagmi/wagmi-proved";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/lib/wagmi/config";

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Super Cluster ",
  description: "Bridge your PT to supported chains with Super Cluster",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const initialState = cookieToInitialState(config, headersList.get("cookie"));

  return (
    <html lang="en">
      <body
        className={`${overpass.variable} antialiased bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen`}>
        <WagmiProviderComp initialState={initialState}>
          <Navbar />
          <main className="max-w-7xl w-full mx-auto mt-32 px-4">
            {children}
          </main>
        </WagmiProviderComp>
      </body>
    </html>
  );
}
