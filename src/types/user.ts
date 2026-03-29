export type UserRole = "user" | "pending_seller" | "seller" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
}

export interface PartnerApplication {
  id: string;
  uid: string;
  email: string;
  name: string;
  contact: string;
  portfolioUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

// 본인인증 API 응답 타입
export interface VerificationResult {
  success: boolean;
  name: string;
  phone: string;
  token: string; // 인증 완료 토큰 (서버에서 검증용)
}
