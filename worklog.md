# Worklog — CTO-DRS Platform (cto-drs-store.vercel.app)

> ملاحظة: ملف العمل السابق فُقد بسبب إعادة تهيئة البيئة. هذه سلسلة ملخصة + السجل الجديد.
> قاعدة ثابتة: **لا يُمس اسم/هوية حساب GitHub (CTO-DRS) إطلاقًا دون طلب صريح من المالك.**

## ملخص المهام السابقة (من الجلسات الأقدم)

- **Task 14–17**: تغيير هوية الموقع ثم التراجع؛ النشر على https://cto-drs-store.vercel.app
- **Task 18** (`c47b3d5`): لوحة أوامر Ctrl+K، مودال QR، إحصاءات حية، زر مشاركة، شريط تقدم القراءة
- **Task 19** (`193a9ed`): صفحة /updates (فيد إصدارات حي + فاحص تحديثات)، FAQ في /support، زر تطبيق عشوائي
- **Task 20** (`72c0301`): أيقونات حقيقية مستخرجة من APKs + أيقونة علامة جديدة + PWA icons (192/512/maskable) + shortcut للمانيفست

---
Task ID: 21
Agent: main (Z.ai)
Task: «اضف المزيد» — تحسينات ومميزات إضافية بعد مهمة الأيقونات

Work Log:
- أضفت **وضع المظهر التلقائي (auto)** لمبدّل المظهر: داكن ← فاتح ← تلقائي (حسب النظام) مع استماع حي لـ prefers-color-scheme وتحديث سكربت الـ boot في layout.tsx لمنع الوميض
- أضفت **آخر عمليات البحث** في كتالوق التطبيقات: حفظ محلي (localStorage) عند Enter، وسوم سريعة قابلة لإعادة التطبيق + زر مسح، مع أنماط داكنة وفاتحة
- أضفت **صورة OG ديناميكية لكل تطبيق** (apps/[slug]/opengraph-image.tsx بـ next/og — نص لاتيني لأن الخط الافتراضي لا يدعم العربية): حرف التطبيق + الاسم + شارات Open Source/Android
- أضفت **apple-touch-icon + shortcut** إلى metadata الرئيسي (icon-192.png)
- أصلحت **فيضان أفقي (8px) في 390px**: صف .app-card-bottom السفلي في بطاقات المتجر كان يفيض يسارًا في RTL (5 عناصر بلا التفاف) → flex-wrap في @media ≤560px — تحسين مستقل عن تغييراتي (كان موجودًا من Task 20)
- تحقق: tsc نظيف، build إنتاجي نجح، صور OG ترجع 200 PNG (~90KB)، الوسوم تُطبّق البحث فعليًا (?q=nexus)، الوضع التلقائي يتبدل حيًا مع تبديل media المحاكى، لقطات داكن/فاتح/موبايل

Stage Summary:
- HEAD الجديد: feat: auto theme mode + recent searches + per-app OG images + apple-touch-icon + RTL overflow fix
- فيضان 390px = 0 بعد الإصلاح
- الملفات: theme-switcher.tsx, layout.tsx, catalog-explorer.tsx, globals.css, apps/[slug]/opengraph-image.tsx (جديد)
