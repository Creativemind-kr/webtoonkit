import Link from "next/link";

type Asset = {
  id: number;
  title: string;
  category: string;
  price: number;
  formats: string[];
  thumbnail: string;
  isNew?: boolean;
};

export default function AssetCard({ asset }: { asset: Asset }) {
  return (
    <Link
      href={`/assets/${asset.id}`}
      className="group border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-black/20 bg-gray-900/30"
    >
      {/* 썸네일 */}
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center text-5xl">
        {asset.thumbnail}

        {/* 뱃지들 */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {asset.price === 0 && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-md font-medium">
              무료
            </span>
          )}
          {asset.isNew && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-md font-medium">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* 정보 */}
      <div className="p-3">
        <span className="text-xs text-indigo-400 mb-1 block">{asset.category}</span>
        <h3 className="font-medium text-sm mb-2.5 group-hover:text-indigo-300 transition-colors line-clamp-1">
          {asset.title}
        </h3>

        {/* 포맷 뱃지 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {asset.formats.map((fmt) => (
              <span
                key={fmt}
                className="border border-gray-700 text-gray-500 text-xs px-1.5 py-0.5 rounded"
              >
                {fmt}
              </span>
            ))}
          </div>
          <span className={`text-sm font-semibold shrink-0 ml-2 ${asset.price === 0 ? "text-green-400" : "text-white"}`}>
            {asset.price === 0 ? "무료" : `${asset.price.toLocaleString()}원`}
          </span>
        </div>
      </div>
    </Link>
  );
}
