import Link from "next/link";

const CATEGORIES = ["전체", "배경", "소품", "캐릭터", "이펙트"];

const SAMPLE_ASSETS = [
  { id: 1, title: "현대 카페 인테리어", category: "배경", price: 0, format: "SKP/Blend", thumbnail: "🏠" },
  { id: 2, title: "판타지 던전", category: "배경", price: 3900, format: "SKP/FBX", thumbnail: "🏰" },
  { id: 3, title: "현대 사무실", category: "배경", price: 0, format: "Blend/FBX", thumbnail: "🏢" },
  { id: 4, title: "중세 무기 세트", category: "소품", price: 4900, format: "FBX/OBJ", thumbnail: "⚔️" },
  { id: 5, title: "도시 거리 배경", category: "배경", price: 2900, format: "SKP/Blend", thumbnail: "🌆" },
  { id: 6, title: "주방 소품 모음", category: "소품", price: 0, format: "Blend/FBX", thumbnail: "🍳" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 px-4 text-center border-b border-gray-800">
        <div className="max-w-3xl mx-auto">
          <span className="text-indigo-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            웹툰 작가를 위한 3D 에셋
          </span>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            배경 직접 안 그려도 됩니다
          </h1>
          <p className="text-gray-400 text-xl mb-10">
            고품질 3D 배경·소품 에셋을 바로 다운로드하세요.
            <br />
            스케치업, 블렌더, 클립스튜디오 포맷 지원.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/assets"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              에셋 둘러보기
            </Link>
            <Link
              href="/signup"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 에셋 목록 미리보기 */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">인기 에셋</h2>
          <Link href="/assets" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
            전체 보기 →
          </Link>
        </div>

        {/* 카테고리 */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                cat === "전체"
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 에셋 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SAMPLE_ASSETS.map((asset) => (
            <Link
              key={asset.id}
              href={`/assets/${asset.id}`}
              className="group border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
            >
              <div className="aspect-video bg-gray-900 flex items-center justify-center text-6xl">
                {asset.thumbnail}
              </div>
              <div className="p-4">
                <span className="text-xs text-indigo-400 mb-1 block">{asset.category}</span>
                <h3 className="font-medium text-sm mb-2 group-hover:text-indigo-300 transition-colors">
                  {asset.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{asset.format}</span>
                  <span className={`text-sm font-medium ${asset.price === 0 ? "text-green-400" : "text-white"}`}>
                    {asset.price === 0 ? "무료" : `${asset.price.toLocaleString()}원`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 구독 CTA */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">무제한 구독으로 더 빠르게</h2>
          <p className="text-gray-400 mb-8">월 구독 한 번으로 모든 에셋을 무제한 다운로드하세요.</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { period: "1개월", price: "5,000원" },
              { period: "3개월", price: "12,000원", badge: "인기" },
              { period: "12개월", price: "39,000원", badge: "최저가" },
            ].map((plan) => (
              <div
                key={plan.period}
                className="border border-gray-700 rounded-xl p-5 text-center relative"
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-xs px-2 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <div className="text-sm text-gray-400 mb-1">{plan.period}</div>
                <div className="text-xl font-bold">{plan.price}</div>
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            구독 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
}
