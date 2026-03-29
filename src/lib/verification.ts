import { VerificationResult } from "@/types/user";

/**
 * 본인인증 핸들러
 * 실제 서비스에서는 PASS, KCB, 나이스평가정보 등 API로 교체
 *
 * 연동 방법:
 * 1. 인증 팝업(window.open) 호출
 * 2. postMessage로 인증 결과 수신
 * 3. 서버에서 토큰 검증 후 이름/전화번호 반환
 */
export async function requestVerification(): Promise<VerificationResult> {
  return new Promise((resolve) => {
    // TODO: 실제 본인인증 팝업 연동 시 아래 코드로 교체
    // const popup = window.open("/api/verify/start", "verify", "width=430,height=600");
    // window.addEventListener("message", (e) => {
    //   if (e.data.type === "VERIFICATION_COMPLETE") {
    //     resolve(e.data.result);
    //   }
    // }, { once: true });

    // 개발용 Mock — 2초 후 인증 완료 시뮬레이션
    setTimeout(() => {
      resolve({
        success: true,
        name: "홍길동",
        phone: "010-1234-5678",
        token: "mock_verified_token_" + Date.now(),
      });
    }, 2000);
  });
}

/**
 * 서버에서 인증 토큰 검증 (Next.js API Route에서 사용)
 * POST /api/verify/confirm
 */
export async function verifyToken(token: string): Promise<boolean> {
  // TODO: 실제 인증사 서버 검증 API 호출로 교체
  return token.startsWith("mock_verified_token_");
}
