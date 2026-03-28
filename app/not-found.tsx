import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-text-sub mb-8">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
