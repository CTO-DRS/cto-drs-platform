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

### متابعة Task 21 — النشر
- أول محاولة نشر ذهبت لمشروع خاطئ (my-project بسبب رابط .vercel قديم) → حُذف المنشور الشاذ وأُعيدت الاستعادة
- `npx vercel link --project cto-drs-store` ثم `vercel --prod` → **النشر الصحيح شغّال**: AUTO-THEME + RECENT-SEARCHES + CHIPS-CSS + OVERFLOW-FIX + per-app OG (200) كلها مؤكدة في chunks الإنتاج
- vercel CLI كتب فوق .gitignore → استُعيد الأصلي وأُضيف .vercel/.env*
- ⚠️ رفض git push (لا يوجد GITHUB_TOKEN في .env هذه الدورة) → الرفع إلى GitHub مؤجل حتى توفر التوكن؛ الإنتاج محدّث عبر Vercel مباشرة

---
Task ID: 22
Agent: main (Z.ai)
Task: صفحة /about + /en/about، مقارنة جنبًا إلى جنب /compare + /en/compare مع زر من صفحة التطبيق، إشعارات متصفح لإصدارات المفضلة + سجل مرئي في /account

Work Log:
- **/about (AR) + /en/about (EN)**: قصة المنصة ورسالتها، شريط إحصاءات من الكتالوق الحقيقي، 6 بطاقات "ماذا تقدم" و4 قيم، بطاقة المطور + CTA روابط سريعة، JSON-LD AboutPage، تبديل لغة متبادل (lang-cross) — /about ثابتة و/en/about بـ EnDocument (dir=ltr)
- **/compare + /en/compare**: مكوّن CompareClient ثنائي اللغة — حتى 3 أعمدة بـ selects، صفوف: الحالة/الفئة/المنصات/إصدار الكتالوق/أحدث إصدار حي+تاريخه+شارة جديد/تنزيلات الإصدارات/نجوم GitHub/آخر تطوير/نبذة/روابط، تظليل "الأحدث هنا" لخلايا الفوز، منع تكرار التطبيق بين الأعمدة، روابط تعميقة ?a=&b=&c= تُزامَن في الرابط عند التغيير، وصول من ?a=slug يعبئ عمودًا ثانيًا مقترحًا من نفس الفئة
- **زر «قارن مع تطبيق آخر»** في detail-actions بصفحة التطبيق → /compare?a=slug
- **الإشعارات**: lib/notifications.ts (سجل drs:notify-log بحد 40 + drs:notify-seen + حدث drs:notify-changed + fireAppNotification بفتح صفحة التطبيق عند النقر + مقارنة semver عميل)؛ ReleaseAlerts في /updates و/account (تفعيل requestPermission، فحص المفضلة عند كل زيارة/عودة للتبويب، خط أساس صامت أول مرة، زر تجربة إشعار، حالات default/granted/denied/unsupported)؛ NotifyLog في /account (#notify-log): قائمة بوقت عربي وعدّاد غير مقروء وتحديد الكل كمقروء ومسح — تحقق حي بحقن localStorage
- الربط: MORE_LINKS (قارن التطبيقات + عن المنصة)، فوتر استكشف/المنصة، sitemap (4 مسارات)، ReleaseAlerts أعلى فاحص التحديثات في /updates
- CSS: أنماط about/cmp/notify داكنة + [data-theme="light"] كاملة + استجابة 760/480px
- **إصلاح فيضان 390px في /compare (90-337px)**: caption.sr-only المطلق داخل .cmp-scroll يهرب من الحاوية غير المتموضعة ويسهم في scrollWidth المستند → position:relative للحاوية = 0 في كل الصفحات
- تحقق: tsc نظيف، build نجح (/about و/en/about ثابتة، /compare ديناميكية)، متصفح تفاعلي: جدول 3 أعمدة + مزامنة URL + شارة الأحدث + أزرار السجل الثلاثة + LTR/EN كامل + ثيم فاتح + فيضان 0
- نشر: أول محاولة ذهبت لمشروع my-project مجددًا (إعادة ضبط .vercel) → حذف المنشورين الشاذين + إعادة ربط cto-drs-store + نشر صحيح + تدقيق إنتاج (كل المسارات 200 + كل المؤشرات النصية + sitemap) + استعادة .gitignore
- ⚠️ git push مؤجل: لا GITHUB_TOKEN في البيئة — 6 commits محلية بانتظار التوكن

Stage Summary:
- HEAD: 4d74a80 feat: /about platform page (AR+EN), side-by-side app compare, browser release notifications + notify log, compare CTA on app pages
- الإنتاج محدث: https://cto-drs-store.vercel.app (about/en-about/compare/en-compare/account)
- الملفات الجديدة: app/about, app/en/about, app/compare, app/en/compare, components/compare-client, components/release-alerts, components/notify-log, lib/notifications
- معدلة: apps/[slug] (زر مقارنة), site-header (MORE_LINKS), site-footer, updates (ReleaseAlerts), account (إعادة كتابة async), sitemap, globals.css (+133 سطر)
