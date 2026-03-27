import Link from "next/link";

const ASSETS: Record<string, { title: string; category: string; price: number; format: string; thumbnail: string; description: string; files: string[] }> = {
  "1": { title: "현대 카페 인테리어", category: "배경", price: 0, format: "SKP/Blend", thumbnail: "🏠", description: "현대적인 카페 인테리어 3D 배경입니다. 테이블, 의자, 카운터, 조명 등 카페 필수 요소가 모두 포함되어 있습니다.", files: ["cafe_interior.skp", "cafe_interior.blend"] },
  "2": { title: "판타지 던전", category: "배경", price: 3900, format: "SKP/FBX", thumbnail: "🏰", description: "판타지 장르에 어울리는 어두운 던전 배경입니다. 돌벽, 횃불, 철창 등 다양한 오브젝트 포함.", files: ["dungeon.skp", "dungeon.fbx"] },
  "3": { title: "현대 사무실", category: "배경", price: 0, format: "Blend/FBX", thumbnail: "🏢", description: "현대적인 오픈 오피스 배경. 책상, 컴퓨터, 파티션 등 포함.", files: ["office.blend", "office.fbx"] },
};

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = ASSETS[id] ?? ASSETS["1"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/assets" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-block transition-colors">
        ← 에셋 목록으로
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 썸네일 */}
        <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center text-8xl border border-gray-800">
          {asset.thumbnail}
        </div>

        {/* 정보 */}
        <div>
          <span className="text-indigo-400 text-sm mb-2 block">{asset.category}</span>
          <h1 className="text-3xl font-bold mb-4">{asset.title}</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">{asset.description}</p>

          {/* 포맷 */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">지원 포맷</div>
            <div className="flex gap-2">
              {asset.format.split("/").map((fmt) => (
                <span key={fmt} className="border border-gray-700 text-gray-300 text-xs px-3 py-1 rounded-md">
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* 가격 및 다운로드 */}
          <div className="border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">가격</span>
              <span className={`text-2xl font-bold ${asset.price === 0 ? "text-green-400" : "text-white"}`}>
                {asset.price === 0 ? "무료" : `${asset.price.toLocaleString()}원`}
              </span>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-colors">
              {asset.price === 0 ? "무료 다운로드" : "구매하기"}
            </button>
            {asset.price > 0 && (
              <p className="text-center text-xs text-gray-500 mt-3">
                구독 중이면 무료로 다운로드할 수 있어요.{" "}
                <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
                  구독 시작하기
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
