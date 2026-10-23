import type { Metadata } from "next";
import { SupportForm } from "@/components/support-form";

export const metadata: Metadata = {
  title: "الدعم",
  description: "أرسل استفسارًا أو بلاغًا عن مشكلة في أحد مشاريع CTO-DRS عبر نموذج يعد رسالتك ويرسلها ببريدك مباشرة.",
};

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

  return (
    <main className="container page">
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
    </main>
  );
}
