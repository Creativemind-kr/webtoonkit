const CATEGORIES = ["전체", "배경", "소품", "캐릭터", "이펙트"];

const ASSETS = [
  { id: 1, title: "현대 카페 인테리어", category: "배경", price: 0, format: "SKP/Blend", thumbnail: "🏠" },
  { id: 2, title: "판타지 던전", category: "배경", price: 3900, format: "SKP/FBX", thumbnail: "🏰" },
  { id: 3, title: "현대 사무실", category: "배경", price: 0, format: "Blend/FBX", thumbnail: "🏢" },
  { id: 4, title: "중세 무기 세트", category: "소품", price: 4900, format: "FBX/OBJ", thumbnail: "⚔️" },
  { id: 5, title: "도시 거리 배경", category: "배경", price: 2900, format: "SKP/Blend", thumbnail: "🌆" },
  { id: 6, title: "주방 소품 모음", category: "소품", price: 0, format: "Blend/FBX", thumbnail: "🍳" },
  { id: 7, title: "학교 교실", category: "배경", price: 1900, format: "SKP/Blend", thumbnail: "🏫" },
  { id: 8, title: "병원 복도", category: "배경", price: 2400, format: "SKP/FBX", thumbnail: "🏥" },
  { id: 9, title: "자동차 내부", category: "소품", price: 0, format: "Blend/FBX", thumbnail: "🚗" },
];

import Link from "next/link";

export default function AssetsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">에셋 둘러보기</h1>
      <p className="text-gray-400 mb-8">웹툰 작가를 위한 3D 배경·소품 에셋</p>

      {/* 카테고리 필터 */}
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
        <div className="ml-auto">
          <select className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5">
            <option>최신순</option>
            <option>인기순</option>
            <option>가격 낮은순</option>
            <option>무료만</option>
          </select>
        </div>
      </div>

      {/* 에셋 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ASSETS.map((asset) => (
          <Link
            key={asset.id}
            href={`/assets/${asset.id}`}
            className="group border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
          >
            <div className="aspect-video bg-gray-900 flex items-center justify-center text-5xl">
              {asset.thumbnail}
            </div>
            <div className="p-3">
              <span className="text-xs text-indigo-400 mb-1 block">{asset.category}</span>
              <h3 className="font-medium text-sm mb-2 group-hover:text-indigo-300 transition-colors line-clamp-1">
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
    </div>
  );
}
