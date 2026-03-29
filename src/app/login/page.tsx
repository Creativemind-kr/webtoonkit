"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [tab, setTab] = useState<"buyer" | "seller">("buyer");

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">

        {/* 구매자 패널 */}
        <div className={`p-10 flex flex-col bg-gray-950 transition-opacity ${tab === "buyer" ? "opacity-100" : "opacity-40 pointer-events-none md:opacity-100 md:pointer-events-auto"}`}>
          <div className="mb-8">
            <Link href="/" className="text-xl font-bold text-white">웹툰키트</Link>
            <div className="flex gap-3 mt-6 border-b border-gray-800 pb-0">
              <button
                onClick={() => setTab("buyer")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === "buyer"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                구매자 로그인
              </button>
              <button
                onClick={() => setTab("seller")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors md:hidden ${
                  tab === "seller"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                판매자 로그인
              </button>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">다시 오셨군요!</h2>
            <p className="text-gray-400 text-sm mb-8">에셋을 다운로드하고 구독을 관리하세요.</p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">이메일</label>
                <input
                  type="email"
                  placeholder="hello@webtoonkit.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm text-gray-400">비밀번호</label>
                  <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300">비밀번호 찾기</button>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                로그인
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              계정이 없으신가요?{" "}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 판매자 패널 */}
        <div className="hidden md:flex flex-col bg-white text-gray-900 p-10">
          <div className="mb-8">
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Partner Hub</span>
            <div className="border-b border-gray-200 pb-0 mt-6">
              <span className="pb-3 text-sm font-semibold border-b-2 border-gray-900 text-gray-900 inline-block">
                판매자 로그인
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1 text-gray-900">파트너 허브</h2>
            <p className="text-gray-500 text-sm mb-8">에셋을 등록하고 판매 수익을 관리하세요.</p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">이메일</label>
                <input
                  type="email"
                  placeholder="partner@webtoonkit.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm text-gray-500">비밀번호</label>
                  <button type="button" className="text-xs text-gray-400 hover:text-gray-700">비밀번호 찾기</button>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                파트너 로그인
              </button>
            </form>

            {/* 파트너 혜택 */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-3">파트너 혜택</p>
              <div className="space-y-2">
                {[
                  "월 1회 정산 지급",
                  "전용 대시보드 제공",
                  "프로모션 참여 가능",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-3.5 h-3.5 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              파트너 신청이 아직 안 되셨나요?{" "}
              <Link href="/partner/apply" className="text-gray-700 font-medium hover:text-gray-900 underline">
                파트너 신청하기
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
