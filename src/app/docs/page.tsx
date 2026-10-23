import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, GitPullRequest, FileCheck, Search, Code2, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "التوثيق",
  description: "مركز توثيق موحد لاستخدام تطبيقات CTO-DRS ومتابعة الإصدارات والتحقق من الملفات.",
};

export default function DocsPage() {
  return (
    <main className="container page narrow">
      <div className="page-intro">
        <div className="eyebrow">المعرفة والمساعدة</div>
        <h1>التوثيق</h1>
        <p>مركز توثيق موحد لاستخدام التطبيقات ومتابعة الإصدارات.</p>
      </div>
      <section className="panel">
        <h2><ShieldCheck size={18} aria-hidden /> للمستخدمين</h2>
        <ul>
          <li>راجع صفحة التطبيق للتأكد من حالة الإصدار ومتطلبات التشغيل.</li>
          <li>نزّل البرامج من الروابط الرسمية فقط، وستجدها في لوحة «التنزيل والروابط».</li>
          <li>تحقق من أذونات التطبيق وسياسة الخصوصية قبل الاستخدام.</li>
          <li>استخدم <Link href="/apps">صفحة التطبيقات</Link> للبحث الفوري والتصفية حسب الفئة والحالة.</li>
        </ul>
        <h2><GitPullRequest size={18} aria-hidden /> للمطورين والمساهمين</h2>
        <ul>
          <li>يُدار كتالوج التطبيقات من الملف <code>content/apps.json</code> داخل مستودع GitHub.</li>
          <li>لا تضف رابط تنزيل إلا بعد التحقق من ملكيته وصحة الملف.</li>
          <li>استخدم سجل التغييرات لتوثيق الإصدار والتعديلات.</li>
          <li>كل تعديل في الكتالوج يمر بمراجعة عبر طلبات السحب قبل النشر.</li>
        </ul>
        <h2><Github size={18} aria-hidden /> المستودعات المفتوحة</h2>
        <ul>
          <li>التطبيقات المفتوحة المصدر تحمل شارة «مفتوح المصدر» في المتجر وبطاقة مستودع في صفحتها.</li>
          <li>إحصاءات المستودع (النجوم، النسخ، لغة البرمجة، آخر تطوير) تُجلب مباشرة من GitHub وتُحدّث كل ساعة.</li>
          <li>لتعديل رابط مستودع تطبيق، حدّث حقل <code>repository</code> في ملف الكتالوج بطلب سحب.</li>
        </ul>
        <h2><Code2 size={18} aria-hidden /> واجهة برمجية عامة (API)</h2>
        <p>يوفر الموقع واجهة قراءة عامة مجانية لبيانات الكتالوج — تعرض نفس بيانات الملف الرسمي دون تعديل:</p>
        <ul>
          <li><code>GET /api/apps</code> — قائمة التطبيقات كاملة مع الحالة والفئة وروابط المستودعات.</li>
          <li><code>GET /api/apps/drs-wallet</code> — بيانات تطبيق محدد بالمعرّف <code>slug</code>.</li>
          <li>الاستجابة JSON مع ترويسات CORS مفتوحة، وصالحة للاستخدام المباشر في تطبيقاتك.</li>
        </ul>
        <p className="muted">ستجد مثالًا مباشرًا على <Link href="/api/apps">/api/apps</Link> — وتُحدّث البيانات تلقائيًا مع كل تعديل في الكتالوج.</p>
        <h2><FileCheck size={18} aria-hidden /> التحقق من الملفات</h2>
        <p>يمكن نشر قيمة SHA-256 لكل ملف إصدار للتحقق من سلامة التنزيل. يجب حسابها من الملف الفعلي وعدم تخمينها.</p>
      </section>
      <div className="notice">
        <b>لم تجد ما تبحث عنه؟</b> جرّب <Link href="/apps">البحث في الكتالوج</Link> أو تواصل عبر <Link href="/support">صفحة الدعم</Link>.
      </div>
    </main>
  );
}
