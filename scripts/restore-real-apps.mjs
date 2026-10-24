// استعادة التطبيقات الستة الحقيقية من النسخة الأصلية (HEAD~1) وحذف الأربعة الوهمية
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const REMOVE = new Set(["drs-wallet", "to-altaf", "english-urdu", "drs-vip"]);

const original = execSync("git show HEAD~1:src/content/apps.json", {
  encoding: "utf8",
  cwd: "/home/z/my-project",
});
const all = JSON.parse(original);
const restored = all.filter(app => !REMOVE.has(app.slug));

if (restored.length !== 6) {
  throw new Error(`Expected 6 restored apps, got ${restored.length}`);
}
console.log("Restored slugs:", restored.map(a => a.slug).join(", "));
console.log("All have repos:", restored.every(a => a.repository?.startsWith("https://github.com/")));

writeFileSync("/home/z/my-project/src/content/apps.json", JSON.stringify(restored, null, 2) + "\n");
console.log("apps.json written ✓");
