import Link from "next/link";

const PLANS = [
  {
    name: "1개월",
    price: 5000,
    originalPrice: null,
    period: "월",
    badge: null,
    features: ["모든 에셋 무제한 다운로드", "신규 에셋 즉시 이용", "상업적 이용 가능", "SKP/Blend/FBX 포맷"],
  },
  {
    name: "3개월",
    price: 12000,
    originalPrice: 15000,
    period: "3개월",
    badge: "인기",
    features: ["모든 에셋 무제한 다운로드", "신규 에셋 즉시 이용", "상업적 이용 가능", "SKP/Blend/FBX 포맷", "20% 할인"],
  },
  {
    name: "12개월",
    price: 39000,
    originalPrice: 60000,
    period: "12개월",
    badge: "최저가",
    features: ["모든 에셋 무제한 다운로드", "신규 에셋 즉시 이용", "상업적 이용 가능", "SKP/Blend/FBX 포맷", "35% 할인", "우선 고객 지원"],
  },
];

const FAQS = [
  {
    q: "구독 중 다운로드한 파일은 구독 종료 후에도 사용 가능한가요?",
    a: "구독 기간 중 다운로드한 파일은 구독 종료 후에도 계속 사용 가능합니다. 단, 구독 종료 후 새로운 에셋은 다운로드할 수 없습니다.",
  },
  {
    q: "상업적 이용이 가능한가요?",
    a: "네, 웹툰, 출판 만화, 게임, 광고 등 상업적 목적으로 자유롭게 사용할 수 있습니다. 단, 에셋 파일 자체를 재판매하는 것은 금지됩니다.",
  },
  {
    q: "어떤 포맷을 지원하나요?",
    a: "스케치업(SKP), 블렌더(Blend), FBX, OBJ 포맷을 지원합니다. 클립스튜디오(CS3O) 포맷도 순차적으로 추가할 예정입니다.",
  },
  {
    q: "구독 취소는 어떻게 하나요?",
    a: "마이페이지 > 구독 관리에서 언제든지 취소할 수 있습니다. 취소 후에도 남은 구독 기간은 이용 가능합니다.",
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* 헤더 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">구독 플랜</h1>
        <p className="text-gray-400 text-lg">
          월 구독 한 번으로 모든 에셋을 무제한 다운로드하세요.
        </p>
      </div>

      {/* 플랜 카드 */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative border rounded-2xl p-6 flex flex-col ${
              plan.badge === "인기"
                ? "border-indigo-500 bg-indigo-950/30"
                : "border-gray-700 bg-gray-900/30"
            }`}
          >
            {plan.badge && (
              <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full font-medium ${
                plan.badge === "인기" ? "bg-indigo-600 text-white" : "bg-green-600 text-white"
              }`}>
                {plan.badge}
              </span>
            )}

            <div className="mb-6">
              <div className="text-gray-400 text-sm mb-2">{plan.name}</div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">{plan.price.toLocaleString()}원</span>
                <span className="text-gray-500 text-sm mb-1">/ {plan.period}</span>
              </div>
              {plan.originalPrice && (
                <div className="text-gray-500 text-sm line-through mt-1">
                  {plan.originalPrice.toLocaleString()}원
                </div>
              )}
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className={`w-full text-center py-3 rounded-xl font-medium transition-colors ${
                plan.badge === "인기"
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                  : "border border-gray-600 hover:border-gray-400 text-gray-300"
              }`}
            >
              구독 시작하기
            </Link>
          </div>
        ))}
      </div>

      {/* 개별 구매 안내 */}
      <div className="border border-gray-800 rounded-2xl p-6 mb-20 flex items-center justify-between">
        <div>
          <h3 className="font-semibold mb-1">구독 없이 개별 구매도 가능해요</h3>
          <p className="text-gray-400 text-sm">필요한 에셋만 단품으로 구매할 수 있습니다.</p>
        </div>
        <Link href="/assets" className="border border-gray-600 hover:border-gray-400 text-gray-300 px-5 py-2 rounded-lg text-sm transition-colors shrink-0">
          에셋 둘러보기
        </Link>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">자주 묻는 질문</h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border border-gray-800 rounded-xl p-5">
              <div className="font-medium mb-2">{faq.q}</div>
              <div className="text-gray-400 text-sm leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
