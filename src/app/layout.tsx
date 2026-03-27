import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "웹툰키트 - 웹툰 작가를 위한 3D 에셋 마켓",
  description: "웹툰 배경과 소품을 바로 다운로드하세요. 웹툰 작가를 위한 3D 에셋 플랫폼.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${geist.className} min-h-full flex flex-col bg-gray-950 text-white`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
          © 2025 웹툰키트. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
