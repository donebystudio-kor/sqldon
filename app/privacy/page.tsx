import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>
      <div className="bg-surface border border-border rounded-lg p-6 space-y-6 text-text-sub text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-text mb-2">1. 개인정보의 처리 목적</h2>
          <p>
            SQL던은 SQL 학습 서비스를 제공하며, 별도의 회원가입이나 로그인을 요구하지 않습니다.
            학습 진행 상태는 사용자의 브라우저(localStorage)에만 저장되며, 서버로 전송되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">2. 수집하는 개인정보</h2>
          <p>
            본 서비스는 개인정보를 수집하지 않습니다. 다만, Google Analytics를 통해 익명화된
            방문 통계(페이지뷰, 방문 시간 등)가 수집될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">3. 쿠키 및 로컬 스토리지</h2>
          <p>
            학습 진행률, 북마크, 오답 노트 등의 데이터는 브라우저의 localStorage에 저장됩니다.
            이 데이터는 사용자의 기기에만 존재하며, 브라우저 데이터 삭제 시 함께 삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">4. 광고</h2>
          <p>
            본 서비스는 Google AdSense를 통해 광고를 게재할 수 있습니다.
            광고 제공을 위해 쿠키가 사용될 수 있으며, 이는 Google의 개인정보처리방침을 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">5. 문의</h2>
          <p>개인정보 관련 문의사항이 있으시면 서비스 관리자에게 연락해 주세요.</p>
        </section>

        <p className="text-xs text-text-sub pt-4 border-t border-border">
          시행일: 2026년 3월 28일
        </p>
      </div>
    </div>
  );
}
