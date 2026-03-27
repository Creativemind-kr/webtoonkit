"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white tracking-tight">
          웹툰키트
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/assets" className="text-gray-400 hover:text-white transition-colors">
            에셋 둘러보기
          </Link>
          <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
            로그인
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md transition-colors"
          >
            시작하기
          </Link>
        </div>
      </div>
    </nav>
  );
}
