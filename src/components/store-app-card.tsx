import Link from "next/link";
import { Download, Link2, BookOpen, Wallet, MessagesSquare, Clapperboard, Keyboard, Calculator, Gamepad2, Languages, Layers, Globe } from "lucide-react";
import type { AppEntry } from "@/lib/catalog";
import { appSummary, categoryLabel, firstDownload, platformLabel } from "@/lib/catalog";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "book-open": BookOpen,
  wallet: Wallet,
  "messages-square": MessagesSquare,
  clapperboard: Clapperboard,
  keyboard: Keyboard,
  calculator: Calculator,
  "gamepad-2": Gamepad2,
  languages: Languages,
  layers: Layers,
  globe: Globe,
};

export function AppStoreCard({ app }: { app: AppEntry }) {
  const link = firstDownload(app);
  const IconComp = ICONS[app.icon];
  const isLetter = app.icon.startsWith("letter-");

  return (
    <article className="store-card">
      <div className="store-card-head">
        <span className={`store-icon tint-${app.tint || "nexus"}`}>
          {isLetter ? <b>{app.icon.replace("letter-", "")}</b> : IconComp ? <IconComp size={24} /> : <Layers size={24} />}
        </span>
        <div className="store-card-title">
          <h3>{app.name.ar}</h3>
          <span>{categoryLabel(app.category)}</span>
        </div>
      </div>
      <p className="store-card-desc">{appSummary(app)}</p>
      <div className="store-tags">
        {app.platforms.map(p => (
          <span className="tag outline" key={p}>{platformLabel(p)}</span>
        ))}
        <span className="tag fill">{app.pricing === "paid" ? "مدفوع" : "مجاني"}</span>
      </div>
      {link ? (
        <a className="store-download" href={link.url} target="_blank" rel="noreferrer">
          <Download size={15} aria-hidden /> تحميل الآن
        </a>
      ) : (
        <Link className="store-download soon" href={`/apps/${app.slug}`} title="التطبيق قيد التطوير — افتح الصفحة لمتابعة الإصدار">
          <Download size={15} aria-hidden /> تحميل الآن
        </Link>
      )}
      <Link className="store-details" href={`/apps/${app.slug}`}>
        عرض التفاصيل <span aria-hidden>←</span>
      </Link>
    </article>
  );
}

export function DownloadIconHint() {
  return <Link2 size={14} aria-hidden />;
}
