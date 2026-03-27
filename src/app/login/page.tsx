import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">웹툰키트</Link>
          <p className="text-gray-400 mt-2 text-sm">계정에 로그인하세요</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">이메일</label>
            <input
              type="email"
              placeholder="hello@webtoonkit.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
