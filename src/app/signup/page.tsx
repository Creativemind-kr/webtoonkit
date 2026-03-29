"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Step = "terms" | "info" | "verify" | "done";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const requiredAgreed = TERMS.filter((t) => t.required).every((t) => agreed[t.id]);

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

  // 계정 생성 + 인증 메일 발송
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    if (password.length < 8) { setError("비밀번호는 8자 이상이어야 합니다."); return; }

    setLoading(true);
    setError("");
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(credential.user);
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        email,
        name,
        role: "user",
        marketingAgreed: !!agreed.marketing,
        createdAt: new Date(),
      });
      setStep("verify");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") setError("이미 사용 중인 이메일입니다.");
      else setError("가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 인증 완료 확인 — Guard: emailVerified 아니면 통과 불가
  const handleCheckVerified = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setLoading(true);
    await reload(user);
    if (user.emailVerified) {
      setStep("done");
    } else {
      setError("아직 이메일 인증이 완료되지 않았습니다.\n메일함을 확인해주세요.");
    }
    setLoading(false);
  };

  // 인증 메일 재발송
  const handleResend = async () => {
    const user = auth.currentUser;
    if (!user || resendCooldown > 0) return;
    await sendEmailVerification(user);
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const STEPS = ["약관동의", "정보입력", "이메일 인증", "완료"];
  const stepIndex = { terms: 0, info: 1, verify: 2, done: 3 }[step];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold">웹툰키트</Link>

          {/* 스텝 인디케이터 */}
          <div className="flex items-center justify-center gap-1 mt-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < stepIndex ? "bg-indigo-600 text-white" :
                  i === stepIndex ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-950" :
                  "bg-gray-800 text-gray-500"
                }`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === stepIndex ? "text-white" : "text-gray-600"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`w-4 h-px mx-1 ${i < stepIndex ? "bg-indigo-600" : "bg-gray-800"}`} />}
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
                onClick={() => setStep("info")}
                disabled={!requiredAgreed}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                다음
              </button>
            </div>
          )}

          {/* Step 2: 정보입력 */}
          {step === "info" && (
            <div>
              <h2 className="text-lg font-bold mb-6">정보를 입력해주세요</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">이름</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
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
                {error && <p className="text-red-400 text-sm whitespace-pre-line">{error}</p>}
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setStep("terms")} className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-lg text-sm hover:border-gray-500 transition-colors">
                    이전
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                    {loading ? "처리 중..." : "다음"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: 이메일 인증 대기 */}
          {step === "verify" && (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-lg font-bold mb-2">이메일을 확인해주세요</h2>
              <p className="text-gray-400 text-sm mb-2">
                <span className="text-white font-medium">{email}</span>으로<br />
                인증 메일을 발송했습니다.
              </p>
              <p className="text-gray-500 text-xs mb-8">메일함에서 링크를 클릭한 후 아래 버튼을 눌러주세요.</p>

              {error && <p className="text-red-400 text-sm mb-4 whitespace-pre-line">{error}</p>}

              <button
                onClick={handleCheckVerified}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors mb-3"
              >
                {loading ? "확인 중..." : "인증 완료했어요"}
              </button>

              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="w-full border border-gray-700 text-gray-400 hover:border-gray-500 disabled:text-gray-600 py-2.5 rounded-lg text-sm transition-colors"
              >
                {resendCooldown > 0 ? `재발송 (${resendCooldown}초)` : "인증 메일 재발송"}
              </button>
            </div>
          )}

          {/* Step 4: 완료 */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold mb-2">가입 완료!</h2>
              <p className="text-gray-400 text-sm mb-8">
                {name}님, 웹툰키트에 오신 걸 환영해요.
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

        <p className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">로그인</Link>
        </p>
      </div>
    </div>
  );
}
