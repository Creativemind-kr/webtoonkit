"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORIES = [
  {
    name: "배경",
    sub: ["현대/도시", "판타지", "학교/사무실", "카페/식당", "자연/야외", "기타"],
  },
  {
    name: "소품",
    sub: ["무기/갑옷", "가구/인테리어", "음식/주방", "탈것", "의상/악세서리", "기타"],
  },
  {
    name: "캐릭터",
    sub: ["포즈", "의상", "얼굴/표정"],
  },
  {
    name: "이펙트",
    sub: ["마법", "자연", "액션"],
  },
];

export default function Navbar() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <nav className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50">
      {/* 상단 바 */}
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 연필 몸통 */}
            <rect x="58" y="10" width="14" height="55" rx="3" transform="rotate(15 58 10)" fill="white" />
            {/* 연필 끝 (지우개) */}
            <rect x="60" y="8" width="14" height="10" rx="2" transform="rotate(15 60 8)" fill="#a5b4fc" />
            {/* 연필 심 */}
            <polygon points="52,72 66,68 59,82" fill="#6b7280" />
            <polygon points="59,82 53,84 52,72" fill="#374151" />
            {/* 곡선 획 */}
            <path d="M10 85 Q25 60 40 75 Q55 90 70 65" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
          <span className="text-lg font-bold text-white tracking-tight">웹툰키트</span>
        </Link>

        {/* 검색창 */}
        <div className="flex-1 max-w-sm mx-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="에셋 검색..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
            구독
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

      {/* 카테고리 바 */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 h-10 relative">
          <Link
            href="/assets"
            className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors rounded"
          >
            전체
          </Link>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="relative"
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={`/assets?category=${cat.name}`}
                className={`px-3 py-1 text-sm transition-colors rounded flex items-center gap-1 ${
                  hoveredCategory === cat.name ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {cat.name}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* 서브메뉴 */}
              {hoveredCategory === cat.name && (
                <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-xl py-2 min-w-36 z-50">
                  {cat.sub.map((sub) => (
                    <Link
                      key={sub}
                      href={`/assets?category=${cat.name}&sub=${sub}`}
                      className="block px-4 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/assets?filter=free"
            className="px-3 py-1 text-sm text-green-400 hover:text-green-300 transition-colors rounded ml-2"
          >
            무료
          </Link>
        </div>
      </div>
    </nav>
  );
}
