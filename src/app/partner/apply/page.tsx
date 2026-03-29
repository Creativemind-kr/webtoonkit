"use client";

import { useState } from "react";
import Link from "next/link";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function PartnerApplyPage() {
  const [contact, setContact] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [intro, setIntro] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setError("로그인 후 신청할 수 있습니다.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // 1. 파트너 신청서 저장
      await addDoc(collection(db, "partnerApplications"), {
        uid: user.uid,
        email: user.email,
        contact,
        portfolioUrl,
        intro,
        status: "pending",
        createdAt: new Date(),
      });

      // 2. 유저 상태를 pending_seller로 변경
      await updateDoc(doc(db, "users", user.uid), {
        role: "pending_seller",
      });

      setSubmitted(true);
    } catch {
      setError("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-xl font-bold mb-2">신청 완료!</h2>
          <p className="text-gray-400 text-sm mb-6">
            파트너 신청이 접수되었습니다.<br />
            검토 후 영업일 기준 3~5일 내에 결과를 알려드립니다.
          </p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <div className="mb-8">
        <Link href="/login" className="text-gray-500 hover:text-gray-300 text-sm">← 돌아가기</Link>
        <h1 className="text-2xl font-bold mt-4 mb-1">판매자 파트너 신청</h1>
        <p className="text-gray-400 text-sm">심사 후 승인 시 에셋을 등록하고 판매할 수 있습니다.</p>
      </div>

      {/* 안내 */}
      <div className="border border-gray-800 rounded-xl p-4 mb-8 text-sm text-gray-400 space-y-1">
        <p>• 승인 후 상품 등록 메뉴가 활성화됩니다.</p>
        <p>• 심사 기간은 영업일 기준 3~5일입니다.</p>
        <p>• 포트폴리오는 실제 작업물이 포함된 링크여야 합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">연락처 <span className="text-red-400">*</span></label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="010-0000-0000"
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">포트폴리오 URL <span className="text-red-400">*</span></label>
          <input
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://instagram.com/yourprofile"
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <p className="text-xs text-gray-600 mt-1">인스타그램, 아트스테이션, 개인 사이트 등</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">자기소개 <span className="text-gray-600">(선택)</span></label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="주로 어떤 장르/스타일의 배경을 제작하시나요?"
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? "신청 중..." : "파트너 신청하기"}
        </button>
      </form>
    </div>
  );
}
