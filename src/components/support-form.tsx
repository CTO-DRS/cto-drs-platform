"use client";

import { useState } from "react";
import { Mail, Send, ExternalLink } from "lucide-react";

const T = {
  ar: {
    cats: [
      { value: "استفسار عام", label: "استفسار عام" },
      { value: "بلاغ عن مشكلة", label: "بلاغ عن مشكلة" },
      { value: "اقتراح تحسين", label: "اقتراح تحسين" },
      { value: "بلاغ أمني", label: "بلاغ أمني" },
    ],
    type: "نوع الطلب",
    project: "المشروع (اختياري)",
    projectPh: "مثال: DRS Wallet",
    message: "تفاصيل الرسالة",
    messagePh: "اشرح طلبك بوضوح، وأرفق خطوات إعادة إنتاج المشكلة إن وجدت…",
    send: "تكوين الرسالة وإرسالها",
    direct: "بريد مباشر",
    notePre: "لا يُرسل هذا النموذج أي بيانات إلى خادم؛ يفتح بريدك الإلكتروني برسالة مُعدّة مسبقًا إلى ",
    notePost: ". لا تُضمّن كلمات مرور أو بيانات شخصية حساسة.",
    ghIssues: "بلاغات الأخطاء عبر GitHub",
    footer: "أُرسل من صفحة الدعم في بوابة CTO-DRS",
  },
  en: {
    cats: [
      { value: "General inquiry", label: "General inquiry" },
      { value: "Bug report", label: "Bug report" },
      { value: "Improvement suggestion", label: "Improvement suggestion" },
      { value: "Security report", label: "Security report" },
    ],
    type: "Request type",
    project: "Project (optional)",
    projectPh: "e.g. DRS Wallet",
    message: "Message details",
    messagePh: "Explain your request clearly, and attach reproduction steps if any…",
    send: "Compose and send the message",
    direct: "Direct email",
    notePre: "This form sends nothing to a server; it opens your email client with a pre-written message to ",
    notePost: ". Don't include passwords or sensitive personal data.",
    ghIssues: "Bug reports via GitHub",
    footer: "Sent from the support page of the CTO-DRS portal",
  },
} as const;

export function SupportForm({ supportEmail, initialApp = "", lang = "ar" }: { supportEmail: string; initialApp?: string; lang?: "ar" | "en" }) {
  const t = T[lang];
  const [category, setCategory] = useState<string>(t.cats[0].value);
  const [appSlug, setAppSlug] = useState(initialApp);
  const [message, setMessage] = useState("");

  const subject = `[CTO-DRS] ${category}${appSlug ? ` — ${appSlug}` : ""}`;
  const body = `${message}\n\n—\n${t.footer}`;

  function send(e: React.FormEvent) {
    e.preventDefault();
    const href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <form className="support-form" onSubmit={send}>
      <div className="field-row">
        <label className="field">
          <span>{t.type}</span>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {t.cats.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>{t.project}</span>
          <input
            type="text"
            value={appSlug}
            onChange={e => setAppSlug(e.target.value)}
            placeholder={t.projectPh}
          />
        </label>
      </div>
      <label className="field">
        <span>{t.message}</span>
        <textarea
          rows={5}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={t.messagePh}
          required
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="button primary" disabled={!message.trim()}>
          <Send size={16} aria-hidden /> {t.send}
        </button>
        <a className="button secondary" href={`mailto:${supportEmail}`}><Mail size={16} aria-hidden /> {t.direct}</a>
      </div>
      <p className="form-note">
        {t.notePre}{supportEmail}{t.notePost}
      </p>
      <a className="text-link" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
        <ExternalLink size={14} aria-hidden /> {t.ghIssues}
      </a>
    </form>
  );
}
