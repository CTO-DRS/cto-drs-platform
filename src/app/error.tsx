"use client";

import Link from "next/link";
import { RefreshCw, Home, TriangleAlert } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container page narrow">
      <section className="panel blog-empty">
        <span className="blog-icon" style={{ background: "linear-gradient(135deg,#b91c1c,#f59e0b)" }}>
          <TriangleAlert size={30} aria-hidden />
        </span>
        <h2>حدث خطأ غير متوقع</h2>
        <p>
          تعذر عرض هذا القسم في اللحظة الحالية. قد يكون خللًا مؤقتًا في الاتصال — جرّب إعادة المحاولة،
          وإن تكرر الأمر فتواصل معنا عبر صفحة الدعم مع وصف الخطوة التي أدت إلى المشكلة.
        </p>
        <div className="blog-links">
          <button type="button" className="btn-grad sm" onClick={reset}>
            <RefreshCw size={15} aria-hidden /> إعادة المحاولة
          </button>
          <Link className="btn-dark sm" href="/">
            <Home size={15} aria-hidden /> الصفحة الرئيسية
          </Link>
        </div>
      </section>
    </main>
  );
}
