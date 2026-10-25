import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck, Bell, Code2, GitCompareArrows, Github, Globe, Heart, Languages, Mail,
  RefreshCw, ShieldCheck, Smartphone, Sparkles, Target,
} from "lucide-react";
import { apps, site, catalogStats } from "@/lib/catalog";
import { openSourceCount } from "@/lib/github";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
  title: "عن المنصة — من نحن ورسالتنا",
  description:
    "تعرّف على منصة CTO-DRS: كتالوق عربي مفتوح المصدر يجمع تطبيقات DRS في مكان واحد بإحصاءات حية من GitHub وخصوصية كاملة — من نحن، رسالتنا، قيمنا، وماذا نقدم.",
  alternates: { languages: { ar: "/about", en: "/en/about" } },
};

export default function AboutPage() {
  const { cto, brand } = site;
  const oss = openSourceCount(apps);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "عن منصة DRS",
    url: `${siteUrl}/about`,
    inLanguage: "ar",
    mainEntity: {
      "@type": "Organization",
      name: "CTO-DRS",
      url: `https://github.com/CTO-DRS`,
      email: cto.email,
      description: "منصة عربية مفتوحة المصدر تجمع تطبيقات DRS في كتالوق رسمي بإحصاءات حية من GitHub.",
    },
  };

  const offers = [
    {
      icon: Smartphone,
      title: "كتالوق رسمي موثوق",
      text: "كل تطبيق في المنصة له صفحة تعريفية كاملة: الوصف والمميزات والمتطلبات وسجل التحديثات وروابط تحميل مباشرة — بلا روابط وسيطة أو اختصارات مشبوهة.",
    },
    {
      icon: RefreshCw,
      title: "إصدارات حية من GitHub",
      text: "صفحة «ما الجديد» تسحب أحدث الإصدارات من مستودعات المطورين الرسمية كل ساعة، مع ملاحظات كل إصدار وتاريخه وفاحص تحديثات يقارن نسختك بأحدث وسم منشور.",
    },
    {
      icon: GitCompareArrows,
      title: "مقارنة جنبًا إلى جنب",
      text: "صفحة مقارنة تضع تطبيقين أو ثلاثة في جدول واحد: الحالة والفئة وأحدث إصدار حي وتنزيلاته ونجوم مستودعه — مع روابط مقارنة يمكنك مشاركتها مباشرة.",
    },
    {
      icon: Bell,
      title: "إشعارات الإصدارات",
      text: "فعّل إشعارات المتصفح فتبّهك المنصة عند صدور إصدار جديد لأي تطبيق أضفته إلى مفضلتك، مع سجل واضح لكل تنبيه وصلتك — كل ذلك على جهازك فقط.",
    },
    {
      icon: Heart,
      title: "مفضلة محلية بخصوصية كاملة",
      text: "تنظيم تطبيقاتك المفضلة ومشاهداتك الأخيرة يتم محليًا على جهازك عبر التخزين المحلي للمتصفح — بلا تسجيل حساب، وبلا أي إرسال لبياناتك لأي خادم.",
    },
    {
      icon: Globe,
      title: "تجربة مثبتة كتطبيق",
      text: "المنصة تطبيق ويب تقدمي (PWA): ثبّتها على شاشتك الرئيسية، تصفحها دون اتصال جزئيًا، وشارك روابط التطبيقات بملفات OG مخصصة ورموز QR سريعة.",
    },
  ];

  const values = [
    {
      icon: Code2,
      title: "المصدر المفتوح مبدأ لا شعار",
      text: "كل تطبيق نعرضه مربوط بمستودعه العام — يمكنك قراءة الكود والاطلاع على القضايا ومتابعة التطوير سطرًا بسطر.",
    },
    {
      icon: ShieldCheck,
      title: "الخصوصية قبل كل شيء",
      text: "لا حسابات إجبارية ولا تتبع إعلاني: مفضلتك وثيمك وإشعاراتك تُخزن محليًا، وما يصل إلينا من إحصاءات مقيّد وغير معرّف.",
    },
    {
      icon: BadgeCheck,
      title: "أرقام حقيقية بلا تضخيم",
      text: "النجوم والتنزيلات والإصدارات تُسحب مباشرة من GitHub API وتتحدث كل ساعة — لا نعرض رقمًا لم نتحقق منه.",
    },
    {
      icon: Target,
      title: "العربية أولًا",
      text: "واجهة عربية أصيلة من اليمين إلى اليسار بجودة لا تقل عن المنتجات العالمية، مع نسخة إنجليزية للوصول الأوسع.",
    },
  ];

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumbs-row">
        <div className="breadcrumbs"><Link href="/">الرئيسية</Link> / <span aria-current="page">عن المنصة</span></div>
        <BackButton fallback="/" label="رجوع" />
      </div>

      <div className="page-intro">
        <div className="eyebrow"><Sparkles size={13} aria-hidden /> {brand.name} — {brand.tagline}</div>
        <h1>عن المنصة</h1>
        <p className="about-lead">
          منصة DRS هي البيت الرسمي لتطبيقات CTO-DRS على الويب: كتالوق عربي مفتوح المصدر يجمع تطبيقات أندرويد
          وأدوات ويب في مكان واحد، وتعرضها بشفافية كاملة — من وصف التطبيق وسجل تحديثاته إلى مستودع كوده المصدري
          وإحصاءاته الحية. نشأ المشروع من قناعة بسيطة: المستخدم العربي يستحق أن يصفّح تطبيقاته كما يتصفح
          المتاجر العالمية، بجودة عربية أصيلة.
        </p>
        <p className="about-lead">
          اليوم يضم الكتالوق {catalogStats.total} تطبيقًا حقيقيًا في {catalogStats.categories} فئات، كلها مربوطة
          بمستودعات GitHub عامة ({oss} منها بمستودعات مفعّلة حاليًا)، مع تغذية إصدارات تتحدث كل ساعة وفاحص
          تحديثات وإشعارات تصلك على جهازك. ولا نزال في البداية — خارطة الطريق تشمل توسيع الكتالوق ومزامنة
          المفضلة عبر الأجهزة والمزيد.
        </p>
        <p className="about-langrow">
          <Link className="lang-cross" href="/en/about" lang="en" dir="ltr">
            <Languages size={13} aria-hidden /> English version
          </Link>
        </p>
      </div>

      <div className="stats-bar" aria-label="أرقام المنصة">
        <div className="stat-cell">
          <span className="stat-chip"><Smartphone size={17} aria-hidden /></span>
          <div className="stat-text"><b>{catalogStats.total}</b><span>تطبيقًا في الكتالوق</span></div>
        </div>
        <div className="stat-cell">
          <span className="stat-chip"><Code2 size={17} aria-hidden /></span>
          <div className="stat-text"><b>{catalogStats.categories}</b><span>فئات تغطي احتياجات مختلفة</span></div>
        </div>
        <div className="stat-cell">
          <span className="stat-chip"><Github size={17} aria-hidden /></span>
          <div className="stat-text"><b>{oss}</b><span>تطبيقًا بمستودعات حية مفعّلة</span></div>
        </div>
        <div className="stat-cell">
          <span className="stat-chip"><RefreshCw size={17} aria-hidden /></span>
          <div className="stat-text"><b>100%</b><span>مفتوح المصدر على GitHub</span></div>
        </div>
      </div>

      <section className="about-section" aria-labelledby="about-offers-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ماذا تقدم المنصة؟</div>
            <h2 id="about-offers-title">كل ما تحتاجه حول تطبيقاتك في مكان واحد</h2>
          </div>
        </div>
        <div className="offer-list">
          {offers.map(o => (
            <article className="offer-card" key={o.title}>
              <span className="offer-ico"><o.icon size={20} aria-hidden /></span>
              <b>{o.title}</b>
              <p>{o.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-values-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">قيمنا</div>
            <h2 id="about-values-title">المبادئ التي تُبنى عليها كل صفحة</h2>
          </div>
        </div>
        <div className="value-grid">
          {values.map(v => (
            <article className="value-card" key={v.title}>
              <v.icon size={20} aria-hidden />
              <b>{v.title}</b>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel about-person-panel" aria-labelledby="about-person-title">
        <div className="about-person">
          <span className="account-avatar" aria-hidden><Github size={26} aria-hidden /></span>
          <div className="about-person-body">
            <div className="eyebrow">الشخص وراء المنصة</div>
            <h2 id="about-person-title">{cto.name} — {cto.role}</h2>
            <p>{cto.bio} يعمل على كل تطبيق من الفكرة إلى النشر: التصميم، والبرمجة، والاختبار، والتوثيق —
            ثم يفتح كل شيء للعموم على GitHub ليبقى التطوير مرئيًا وقابلًا للمراجعة من أي شخص.</p>
            <div className="about-cta">
              <a className="btn-grad sm" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
                <Github size={15} aria-hidden /> تابع التطوير على GitHub
              </a>
              <Link className="btn-dark sm" href="/projects">المشاريع المفتوحة</Link>
              <a className="text-link" href={`mailto:${cto.email}`}><Mail size={14} aria-hidden /> {cto.email}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="panel about-start" aria-labelledby="about-start-title">
        <h2 id="about-start-title"><Sparkles size={17} aria-hidden /> ابدأ من هنا</h2>
        <p>جاهز لتجربة المنصة؟ هذه أقصر الطرق للوصول لما تريد:</p>
        <div className="about-links-grid">
          <Link className="about-link-card" href="/apps">
            <Smartphone size={18} aria-hidden /><b>تصفح الكتالوق</b><span>ابحث وفلتر بين {catalogStats.total} تطبيقًا</span>
          </Link>
          <Link className="about-link-card" href="/compare">
            <GitCompareArrows size={18} aria-hidden /><b>قارن التطبيقات</b><span>ضع حتى 3 تطبيقات جنبًا إلى جنب</span>
          </Link>
          <Link className="about-link-card" href="/updates">
            <RefreshCw size={18} aria-hidden /><b>ما الجديد؟</b><span>أحدث الإصدارات الحية من GitHub</span>
          </Link>
          <Link className="about-link-card" href="/account">
            <Bell size={18} aria-hidden /><b>مفضلتك وإشعاراتك</b><span>راقب الإصدارات الجديدة على جهازك</span>
          </Link>
        </div>
        <p className="about-more">
          وتحتاج مساعدة؟ صفحة <Link href="/support">الدعم الفني</Link> تجيب الأسئلة الشائعة وتوصل بلغتك مباشرة،
          ووثائق <Link href="/docs">الاستخدام والتطوير</Link> تشرح كل شيء للمهتمين بالتفاصيل.
        </p>
      </section>
    </main>
  );
}
