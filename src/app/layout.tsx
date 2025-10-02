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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body
        className={`${overpass.variable} antialiased`}
        style={{
          fontFamily: "Overpass, sans-serif",
          background:
            "linear-gradient(135deg, #0a0118 0%, #0f1020 30%, #1a1b3d 60%, #1e2a5e 100%)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
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
