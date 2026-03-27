"use client";

import { useState, useMemo } from "react";
import AssetCard from "@/components/AssetCard";

const CATEGORIES = ["전체", "배경", "소품", "캐릭터", "이펙트"];

const ASSETS = [
  { id: 1, title: "현대 카페 인테리어", category: "배경", price: 0, formats: ["SKP", "Blend"], thumbnail: "🏠", isNew: false },
  { id: 2, title: "판타지 던전", category: "배경", price: 3900, formats: ["SKP", "FBX"], thumbnail: "🏰", isNew: true },
  { id: 3, title: "현대 사무실", category: "배경", price: 0, formats: ["Blend", "FBX"], thumbnail: "🏢", isNew: false },
  { id: 4, title: "중세 무기 세트", category: "소품", price: 4900, formats: ["FBX", "OBJ"], thumbnail: "⚔️", isNew: true },
  { id: 5, title: "도시 거리 배경", category: "배경", price: 2900, formats: ["SKP", "Blend"], thumbnail: "🌆", isNew: false },
  { id: 6, title: "주방 소품 모음", category: "소품", price: 0, formats: ["Blend", "FBX"], thumbnail: "🍳", isNew: false },
  { id: 7, title: "학교 교실", category: "배경", price: 1900, formats: ["SKP", "Blend"], thumbnail: "🏫", isNew: true },
  { id: 8, title: "병원 복도", category: "배경", price: 2400, formats: ["SKP", "FBX"], thumbnail: "🏥", isNew: false },
  { id: 9, title: "자동차 내부", category: "소품", price: 0, formats: ["Blend", "FBX"], thumbnail: "🚗", isNew: true },
  { id: 10, title: "마법 이펙트 세트", category: "이펙트", price: 3500, formats: ["FBX"], thumbnail: "✨", isNew: true },
  { id: 11, title: "고딕 성당", category: "배경", price: 5900, formats: ["SKP", "Blend", "FBX"], thumbnail: "⛪", isNew: false },
  { id: 12, title: "캐릭터 포즈 팩", category: "캐릭터", price: 0, formats: ["FBX", "OBJ"], thumbnail: "🧍", isNew: true },
];

export default function AssetsPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("최신순");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = ASSETS;

    if (selectedCategory !== "전체") {
      result = result.filter((a) => a.category === selectedCategory);
    }
    if (freeOnly) {
      result = result.filter((a) => a.price === 0);
    }
    if (searchQuery.trim()) {
      result = result.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.includes(searchQuery)
      );
    }
    if (sortBy === "가격 낮은순") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "가격 높은순") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, freeOnly]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">에셋 둘러보기</h1>
          <p className="text-gray-500 text-sm mt-0.5">총 {filtered.length}개의 에셋</p>
        </div>
      </div>

      {/* 검색 */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="에셋 검색 (예: 카페, 판타지, 무기...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "border border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setFreeOnly(!freeOnly)}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            freeOnly
              ? "bg-green-600 text-white"
              : "border border-gray-700 text-green-400 hover:border-green-600"
          }`}
        >
          무료만
        </button>
        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option>최신순</option>
            <option>가격 낮은순</option>
            <option>가격 높은순</option>
          </select>
        </div>
      </div>

      {/* 에셋 그리드 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>검색 결과가 없어요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
