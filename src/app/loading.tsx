/* هيكل تحميل عام — بلاطات متدرجة الظهور تحاكي بطاقات الكتالوج */

export default function Loading() {
  return (
    <main className="container page">
      <div className="sk sk-eyebrow" />
      <div className="sk sk-title" />
      <div className="sk sk-line" />
      <div className="sk-grid" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="sk sk-card" key={i} />
        ))}
      </div>
    </main>
  );
}
