import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { SupportForm } from "@/components/support-form";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
  title: "الدعم",
  description: "أرسل استفسارًا أو بلاغًا عن مشكلة في أحد مشاريع CTO-DRS عبر نموذج يعد رسالتك ويرسلها ببريدك مباشرة.",
};

/** أسئلة شائعة حقيقية عن المنصة وتثبيت التطبيقات — تُعرض أيضًا لمحركات البحث بـ FAQPage */
const FAQ_ITEMS = [
  {
    q: "كيف أثبّت تطبيق APK من هذا المتجر؟",
    a: "اضغط زر «تحميل» في صفحة التطبيق أو في نافذة التحميل، ثم افتح الملف من شريط الإشعارات. عند أول تثبيت سيطلب أندرويد السماح بالتثبيت من مصادر غير معروفة — فعّله لهذا الملف فقط، أكمل التثبيت ثم يُفضل إعادة إيقاف الخيار.",
  },
  {
    q: "هل التطبيقات آمنة ومفتوحة المصدر؟",
    a: "نعم، كل تطبيقات الكتالوق مربوطة بمستودع GitHub عام يمكنك مراجعة كوده بالكامل، وروابط التحميل تؤدي مباشرة إلى أصول الإصدارات الرسمية على GitHub نفسه — لا يوجد روابط وسيطة أو مختصرة.",
  },
  {
    q: "كيف أعرف أن لدي تحديثًا جديدًا؟",
    a: "استخدم فاحص التحديثات في صفحة «ما الجديد»: اختر التطبيق واكتب رقم نسختك (تجده في حول التطبيق) وسيقارنها فورًا بأحدث إصدار منشور على GitHub ويعطيك رابط التحميل إن وُجد تحديث.",
  },
  {
    q: "لماذا يظهر بعض التطبيقات بحالة «قيد التطوير»؟",
    a: "الحالة تعكس واقع المستودع: التطبيق «قيد التطوير» لم يصل لإصدار رسمي مستقر بعد. عند نشر أول إصدار رسمي بملف APK تتجدد صفحته تلقائيًا وتظهر روابط التحميل.",
  },
  {
    q: "ماذا أفعل إذا واجهت مشكلة في أحد التطبيقات؟",
    a: "استخدم نموذج الدعم في هذه الصفحة واذكر اسم التطبيق ورقم الإصدار وخطوات ظهور المشكلة، أو افتح Issue مباشرة في مستودع التطبيق على GitHub ليصل البلاغ للمطوّر مع تفاصيله التقنية.",
  },
];

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const app = firstParam(params.app).slice(0, 60);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <BackButton fallback="/" label="رجوع" />
      <div className="page-intro">
        <div className="eyebrow">نحن هنا للمساعدة</div>
        <h1>الدعم والتواصل</h1>
        <p>أرسل استفسارًا أو بلاغًا عن مشكلة في أحد المشاريع. اختر نوع الطلب واكتب التفاصيل، وسيتولى النموذج إعداد الرسالة.</p>
      </div>
      {app && <div className="notice"><b>بلاغ مرتبط بتطبيق:</b> {app}</div>}
      <div className="support-layout">
        <section className="panel">
          <h2>نموذج الدعم</h2>
          <SupportForm supportEmail="cto.drs@gmail.com" initialApp={app} />
        </section>
        <div className="support-side">
          <section className="panel">
            <h2>قنوات أخرى</h2>
            <p>لبلاغات الأخطاء والاقتراحات المرتبطة بالمستودعات العامة.</p>
            <a className="button secondary full" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">فتح صفحة CTO-DRS ↗</a>
          </section>
          <section className="panel">
            <h2>قبل الإرسال</h2>
            <ul>
              <li>راجع صفحة التطبيق وحالته؛ قد تكون المشكلة موثقة في سجل التحديثات.</li>
              <li>اذكر اسم التطبيق ورقم الإصدار وخطوات إعادة إنتاج المشكلة.</li>
              <li>لا تُرسل كلمات مرور أو مفاتيح أو بيانات شخصية حساسة.</li>
            </ul>
          </section>
        </div>
      </div>

      <section className="faq-section" aria-labelledby="faq-title">
        <h2 id="faq-title"><LifeBuoy size={18} aria-hidden /> الأسئلة الشائعة</h2>
        <p className="faq-intro">
          إجابات سريعة عن أكثر ما يسأل عنه مستخدمو متجر DRS — من التثبيت إلى التحديثات والمصدر المفتوح.
        </p>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <details className="faq-item" key={i} open={i === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <div className="faq-foot">
          <span>لم تجد إجابتك؟</span>
          <Link className="text-link" href="/updates">جرّب فاحص التحديثات في صفحة «ما الجديد» ←</Link>
        </div>
      </section>
    </main>
  );
}
