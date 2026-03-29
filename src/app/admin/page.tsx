"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PartnerApplication } from "@/types/user";

export default function AdminPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  const fetchApplications = async () => {
    setLoading(true);
    const q = query(collection(db, "partnerApplications"), where("status", "==", filter));
    const snap = await getDocs(q);
    setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PartnerApplication)));
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, [filter]);

  const handleApprove = async (app: PartnerApplication) => {
    // 1. 신청 상태 → approved
    await updateDoc(doc(db, "partnerApplications", app.id), { status: "approved" });
    // 2. 유저 role → seller (상품 등록 메뉴 활성화)
    await updateDoc(doc(db, "users", app.uid), { role: "seller" });
    fetchApplications();
  };

  const handleReject = async (app: PartnerApplication) => {
    // 1. 신청 상태 → rejected
    await updateDoc(doc(db, "partnerApplications", app.id), { status: "rejected" });
    // 2. 유저 role → user (원복)
    await updateDoc(doc(db, "users", app.uid), { role: "user" });
    fetchApplications();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">관리자 패널</h1>
      <p className="text-gray-400 text-sm mb-8">파트너 신청을 검토하고 승인/거절하세요.</p>

      {/* 필터 탭 */}
      <div className="flex gap-2 border-b border-gray-800 mb-6">
        {(["pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              filter === f
                ? "border-indigo-500 text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {{ pending: "대기 중", approved: "승인됨", rejected: "거절됨" }[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-10 text-center">불러오는 중...</div>
      ) : applications.length === 0 ? (
        <div className="text-gray-500 text-sm py-10 text-center">신청 내역이 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{app.name}</span>
                    <span className="text-xs text-gray-500">{app.email}</span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>연락처: {app.contact}</p>
                    <p>포트폴리오:
                      <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 ml-1 truncate">
                        {app.portfolioUrl}
                      </a>
                    </p>
                  </div>
                </div>

                {filter === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleReject(app)}
                      className="border border-gray-700 hover:border-red-600 text-gray-400 hover:text-red-400 text-sm px-4 py-1.5 rounded-lg transition-colors"
                    >
                      거절
                    </button>
                    <button
                      onClick={() => handleApprove(app)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
                    >
                      승인
                    </button>
                  </div>
                )}

                {filter === "approved" && (
                  <span className="text-green-400 text-xs font-medium border border-green-700 px-2 py-1 rounded-md">승인됨</span>
                )}
                {filter === "rejected" && (
                  <span className="text-red-400 text-xs font-medium border border-red-800 px-2 py-1 rounded-md">거절됨</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
