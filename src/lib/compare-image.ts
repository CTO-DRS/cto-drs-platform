/* توليد صورة مقارنة (PNG) من بيانات الجدول الحالي عبر Canvas — بلا خوادم.
   الرسم دائمًا على خلفية داكنة بهوية المنصة بغض النظر عن ثيم الصفحة،
   ويستخدم خط الصفحة المحمّل نفسه (يدعم العربية) مع ضبط الاتجاه لكل نص. */

export type CompareImageEntry = {
  name: string;
  iconPath: string | null; // مسار نفس الأصل فقط (/...) كي لا يتلطخ الـ canvas
  letter: string;
  status: string;
  category: string;
  latest: string; // وسم الإصدار أو "—"
  latestDate: string | null;
  downloads: string;
  stars: string;
};

export type CompareImageOptions = {
  lang: "ar" | "en";
  url: string; // رابط المقارنة الحالي للطباعة أسفل الصورة
};

const W = 1200;
const H = 675;

/* ألوان الهوية الداكنة (مطابقة للثيم الداكن للمنصة) */
const BG_TOP = "#0b1020";
const BG_BOTTOM = "#151d33";
const CARD_BG = "rgba(255,255,255,0.045)";
const CARD_STROKE = "rgba(255,255,255,0.10)";
const ACCENT = "#7c8cff";
const TEXT = "#eef1f8";
const MUTED = "#9aa4c0";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  /* بديل يدوي للمتصفحات القديمة */
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadIconAsync(src: string | null): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    if (!src || !src.startsWith("/")) return resolve(null); // الروابط الخارجية تتلطخ الكانفس — نتجاهلها
    let done = false;
    const finish = (img: HTMLImageElement | null) => {
      if (!done) { done = true; resolve(img); }
    };
    const img = new Image();
    img.onload = () => finish(img.naturalWidth > 0 ? img : null);
    img.onerror = () => finish(null);
    img.src = src;
    setTimeout(() => finish(null), 4000); // مهلة أمان
  });
}

/** بناء صورة المقارنة وإعادتها كـ Blob (PNG) — يرمي خطأً عند أي فشل */
export async function buildCompareImage(entries: CompareImageEntry[], opts: CompareImageOptions): Promise<Blob> {
  if (!entries.length) throw new Error("no-entries");
  if (entries.length > 3) entries = entries.slice(0, 3);

  /* انتظار الخطوط المحملة كي يرسم الكانفس بخط الصفحة الفعلي (يدعم العربية) */
  try {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
  } catch {
    /* المتصفح بلا FontFaceSet — نكمل بالخط الافتراضي */
  }
  const family = getComputedStyle(document.body).fontFamily || "sans-serif";

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no-2d");

  const rtl = opts.lang === "ar";

  /* ===== الخلفية المتدرجة + توهجان لطيفان ===== */
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, BG_TOP);
  grad.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const glow = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  glow(120, 80, 340, "rgba(124,140,255,0.16)");
  glow(1080, 600, 380, "rgba(255,140,120,0.10)");

  const font = (weight: string, size: number) => `${weight} ${size}px ${family}`;

  /* ===== الترويسة ===== */
  ctx.textBaseline = "alphabetic";
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = rtl ? "right" : "left";
  const headX = rtl ? W - 48 : 48;
  const titleStr = rtl ? "مقارنة التطبيقات" : "App comparison";
  const brand = rtl ? "— DRS" : "— DRS";

  ctx.fillStyle = TEXT;
  ctx.font = font("700", 34);
  const titleW = ctx.measureText(titleStr + " ").width;
  ctx.fillText(titleStr, headX, 78);

  ctx.fillStyle = ACCENT;
  ctx.font = font("800", 34);
  ctx.fillText(brand, rtl ? headX - titleW : headX + titleW, 78);

  ctx.fillStyle = MUTED;
  ctx.font = font("500", 17);
  ctx.textAlign = rtl ? "left" : "right";
  const dateStr = new Intl.DateTimeFormat(opts.lang, { year: "numeric", month: "long", day: "numeric" }).format(new Date());
  ctx.fillText(dateStr, rtl ? 48 : W - 48, 76);

  /* ===== أعمدة التطبيقات ===== */
  const n = entries.length;
  const pad = 48;
  const gap = 22;
  const areaTop = 118;
  const areaBottom = 588;
  const colW = (W - pad * 2 - gap * (n - 1)) / n;

  const icons = await Promise.all(entries.map(e => loadIconAsync(e.iconPath)));

  for (let i = 0; i < n; i++) {
    const e = entries[i];
    const x = pad + i * (colW + gap);
    const y = areaTop;
    const h = areaBottom - areaTop;

    roundRect(ctx, x, y, colW, h, 18);
    ctx.fillStyle = CARD_BG;
    ctx.fill();
    ctx.strokeStyle = CARD_STROKE;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const cx = x + colW / 2;

    /* الأيقونة: صورة حقيقية أو حرف متدرج */
    const iconSize = 68;
    const iconY = y + 22;
    if (icons[i]) {
      ctx.save();
      roundRect(ctx, cx - iconSize / 2, iconY, iconSize, iconSize, 16);
      ctx.clip();
      ctx.drawImage(icons[i] as HTMLImageElement, cx - iconSize / 2, iconY, iconSize, iconSize);
      ctx.restore();
    } else {
      ctx.save();
      const ig = ctx.createLinearGradient(cx - iconSize / 2, iconY, cx + iconSize / 2, iconY + iconSize);
      ig.addColorStop(0, "#7c8cff");
      ig.addColorStop(1, "#b96bff");
      roundRect(ctx, cx - iconSize / 2, iconY, iconSize, iconSize, 16);
      ctx.fillStyle = ig;
      ctx.fill();
      ctx.clip();
      ctx.fillStyle = "#fff";
      ctx.font = font("800", 36);
      ctx.textAlign = "center";
      ctx.direction = "ltr";
      ctx.fillText(e.letter.slice(0, 1).toUpperCase(), cx, iconY + 47);
      ctx.restore();
    }

    /* اسم التطبيق */
    ctx.fillStyle = TEXT;
    ctx.font = font("700", 23);
    ctx.direction = rtl ? "rtl" : "ltr";
    ctx.textAlign = "center";
    let nameStr = e.name;
    while (ctx.measureText(nameStr).width > colW - 32 && nameStr.length > 4) nameStr = nameStr.slice(0, -2);
    if (nameStr !== e.name) nameStr += "…";
    ctx.fillText(nameStr, cx, iconY + iconSize + 30);

    /* الصفوف */
    const rows: [string, string][] = [
      [rtl ? "الحالة" : "Status", e.status],
      [rtl ? "الفئة" : "Category", e.category],
      [rtl ? "أحدث إصدار" : "Latest release", e.latest],
      [rtl ? "التنزيلات" : "Downloads", e.downloads],
      [rtl ? "النجوم" : "Stars", e.stars],
    ];
    let ry = iconY + iconSize + 62;
    for (const [label, value] of rows) {
      ctx.fillStyle = MUTED;
      ctx.font = font("500", 14);
      ctx.fillText(label, cx, ry);
      ctx.fillStyle = TEXT;
      ctx.font = font("700", 19);
      let vStr = value;
      while (ctx.measureText(vStr).width > colW - 28 && vStr.length > 4) vStr = vStr.slice(0, -2);
      if (vStr !== value) vStr += "…";
      ctx.fillText(vStr, cx, ry + 23);
      ry += 57;
    }
    /* تاريخ الإصدار أسفل البطاقة — المسافة محسوبة كي لا يتداخل مع الصفوف */
    if (e.latestDate) {
      ctx.fillStyle = MUTED;
      ctx.font = font("500", 13);
      ctx.fillText(e.latestDate, cx, areaBottom - 14);
    }
  }

  /* ===== التذييل ===== */
  ctx.fillStyle = MUTED;
  ctx.font = font("500", 16);
  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.fillText(opts.url.replace(/^https?:\/\//, ""), 48, H - 30);
  ctx.textAlign = "right";
  ctx.fillStyle = ACCENT;
  ctx.font = font("700", 16);
  ctx.fillText("DRS Apps & More", W - 48, H - 30);

  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("toblob-failed");
  return blob;
}

/** مشاركة الصورة عبر Web Share API إن دُعمت ملفاتها، وإلا تنزيل مباشر. يعيد "shared" | "downloaded" | "failed" */
export async function shareOrDownloadImage(blob: Blob, fileName: string, title: string, text: string): Promise<"shared" | "downloaded" | "failed"> {
  try {
    const file = new File([blob], fileName, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title, text });
      return "shared";
    }
  } catch (err) {
    /* AbortError = أغلق المستخدم نافذة المشاركة — ليس فشلًا */
    if (err instanceof DOMException && err.name === "AbortError") return "failed";
  }
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return "downloaded";
  } catch {
    return "failed";
  }
}
