import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container page narrow">
      <section className="panel notfound-panel">
        <div className="notfound-code" aria-hidden>404</div>
        <h1>الصفحة غير موجودة</h1>
        <p>قد يكون الرابط غير صحيح أو أن المشروع غير منشور في الكتالوج. يمكنك العودة إلى البوابة أو تصفح التطبيقات المتاحة.</p>
        <div className="hero-actions">
          <Link className="button primary" href="/apps">تصفح التطبيقات</Link>
          <Link className="button secondary" href="/">الصفحة الرئيسية</Link>
        </div>
      </section>
    </main>
  );
}
