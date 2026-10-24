/* توليد أيقونات PWA بصيغة PNG من icon.svg باستخدام sharp */
/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");
const path = require("path");

const svgPath = path.join(__dirname, "..", "src", "app", "icon.svg");
const outDir = path.join(__dirname, "..", "public");

async function main() {
  const sources = [
    { file: "icon-192.png", size: 192 },
    { file: "icon-512.png", size: 512 },
  ];
  for (const { file, size } of sources) {
    await sharp(svgPath, { density: 400 })
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, file));
    console.log(`تم توليد ${file} (${size}x${size})`);
  }
  /* أيقونة maskable: الهوية داخل منطقة آمنة (80%) فوق خلفية متدرجة كاملة */
  const safeInner = 410; // 512 × 0.8
  const maskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8858ff"/><stop offset="1" stop-color="#36d8ff"/>
    </linearGradient></defs>
    <rect width="512" height="512" fill="url(#g)"/>
    <g transform="translate(${(512 - safeInner) / 2}, ${(512 - safeInner) / 2}) scale(${safeInner / 128})">
      <text x="64" y="88" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="900" fill="#ffffff" text-anchor="middle">D</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(maskable)).png().toFile(path.join(outDir, "maskable-512.png"));
  console.log("تم توليد maskable-512.png");
}

main().catch(err => { console.error(err); process.exit(1); });
