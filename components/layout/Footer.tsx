import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-sub">
        <p>&copy; {new Date().getFullYear()} SQL던. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            개인정보처리방침
          </Link>
          <Link href="/result" className="hover:text-primary transition-colors">
            학습 현황
          </Link>
        </div>
      </div>
    </footer>
  );
}
