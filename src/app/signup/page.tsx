"use client";

import { useState } from "react";
import Link from "next/link";
import { requestVerification } from "@/lib/verification";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Step = "terms" | "verify" | "info" | "done";

const TERMS = [
  { id: "all", label: "전체 동의", required: false, bold: true },
  { id: "service", label: "[필수] 서비스 이용약관", required: true },
  { id: "privacy", label: "[필수] 개인정보 수집 및 이용 동의", required: true },
  { id: "age", label: "[필수] 만 14세 이상입니다", required: true },
  { id: "marketing", label: "[선택] 마케팅 정보 수신 동의", required: false },
];

export default function SignupPage() {
  const [step, setStep] = useState<Step>("terms");
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 약관 체크
  const handleAgree = (id: string, checked: boolean) => {
    if (id === "all") {
      const all = TERMS.reduce((acc, t) => ({ ...acc, [t.id]: checked }), {});
      setAgreed(all);
    } else {
      const next = { ...agreed, [id]: checked };
      next.all = TERMS.filter((t) => t.id !== "all").every((t) => next[t.id]);
      setAgreed(next);
    }
  };

  const requiredAgreed = TERMS.filter((t) => t.required).every((t) => agreed[t.id]);

  // 본인인증
  const handleVerify = async () => {
    setVerifying(true);
    setError("");
    try {
      const result = await requestVerification();
      if (result.success) {
        setVerifiedName(result.name);
        setVerifiedPhone(result.phone);
        setVerifyToken(result.token);
        setVerified(true);
      }
    } catch {
      setError("본인인증 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setVerifying(false);
    }
  };

  // 정보 입력 단계로 이동 — 인증 완료 전 차단
  const goToInfo = () => {
    if (!verified) {
      setError("본인인증을 완료해주세요.");
      return;
    }
    setError("");
    setStep("info");
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified || !verifyToken) {
      setError("본인인증이 완료되지 않았습니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        email,
        name: verifiedName,
        phone: verifiedPhone,
        role: "user",
        marketingAgreed: !!agreed.marketing,
        createdAt: new Date(),
      });
      setStep("done");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일입니다.");
      } else {
        setError("가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 단계 표시
  const STEPS = ["약관동의", "본인인증", "정보입력", "완료"];
  const stepIndex = { terms: 0, verify: 1, info: 2, done: 3 }[step];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold">웹툰키트</Link>

          {/* 스텝 인디케이터 */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < stepIndex ? "bg-indigo-600 text-white" :
                  i === stepIndex ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-950" :
                  "bg-gray-800 text-gray-500"
                }`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${i === stepIndex ? "text-white" : "text-gray-600"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`w-6 h-px ${i < stepIndex ? "bg-indigo-600" : "bg-gray-800"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">

          {/* Step 1: 약관동의 */}
          {step === "terms" && (
            <div>
              <h2 className="text-lg font-bold mb-6">약관에 동의해주세요</h2>
              <div className="space-y-3">
                {TERMS.map((term) => (
                  <label key={term.id} className={`flex items-center gap-3 cursor-pointer ${term.bold ? "border-b border-gray-800 pb-3 mb-1" : ""}`}>
                    <input
                      type="checkbox"
                      checked={!!agreed[term.id]}
                      onChange={(e) => handleAgree(term.id, e.target.checked)}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className={`text-sm ${term.bold ? "font-semibold text-white" : "text-gray-300"}`}>
                      {term.label}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setStep("verify")}
                disabled={!requiredAgreed}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                다음
              </button>
            </div>
          )}

          {/* Step 2: 본인인증 */}
          {step === "verify" && (
            <div>
              <h2 className="text-lg font-bold mb-2">본인인증</h2>
              <p className="text-gray-400 text-sm mb-8">안전한 서비스 이용을 위해 본인인증이 필요합니다.</p>

              {!verified ? (
                <div className="border border-gray-700 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">📱</div>
                  <p className="text-sm text-gray-400 mb-4">휴대폰 본인인증으로 진행합니다.</p>
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    {verifying ? "인증 중..." : "본인인증 시작"}
                  </button>
                </div>
              ) : (
                <div className="border border-green-700 bg-green-950/30 rounded-xl p-6">
                  <div className="flex items-center gap-2 text-green-400 font-medium mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    본인인증 완료
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>이름: <span className="text-white font-medium">{verifiedName}</span></p>
                    <p>전화번호: <span className="text-white font-medium">{verifiedPhone}</span></p>
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

              <div className="flex gap-2 mt-6">
                <button onClick={() => setStep("terms")} className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-lg text-sm transition-colors hover:border-gray-500">
                  이전
                </button>
                <button
                  onClick={goToInfo}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 정보입력 */}
          {step === "info" && (
            <div>
              <h2 className="text-lg font-bold mb-6">정보 입력</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 인증된 정보 — 고정(disabled) */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">이름 <span className="text-green-400 text-xs">(인증 완료)</span></label>
                  <input
                    type="text"
                    value={verifiedName}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">전화번호 <span className="text-green-400 text-xs">(인증 완료)</span></label>
                  <input
                    type="text"
                    value={verifiedPhone}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* 직접 입력 */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">이메일</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@webtoonkit.com"
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">비밀번호</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8자 이상"
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">비밀번호 확인</label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setStep("verify")} className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-lg text-sm hover:border-gray-500 transition-colors">
                    이전
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    {loading ? "가입 중..." : "가입하기"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: 완료 */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold mb-2">가입 완료!</h2>
              <p className="text-gray-400 text-sm mb-8">
                {verifiedName}님, 웹툰키트에 오신 걸 환영해요.
              </p>
              <Link
                href="/assets"
                className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium transition-colors text-center"
              >
                에셋 둘러보기
              </Link>
              <Link href="/login" className="block text-sm text-gray-500 mt-3 hover:text-gray-300">
                로그인하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
