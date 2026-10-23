import Link from "next/link";
export default function NotFound() { return <main className="container page narrow"><section className="panel"><h1>الصفحة غير موجودة</h1><p>قد يكون الرابط غير صحيح أو أن المشروع غير منشور في الكتالوج.</p><Link className="button primary" href="/apps">العودة إلى التطبيقات</Link></section></main>; }
