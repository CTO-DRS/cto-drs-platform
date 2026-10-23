"use client";

import { useState } from "react";
import { Mail, Send, ExternalLink } from "lucide-react";

const CATEGORIES = [
  { value: "استفسار عام", label: "استفسار عام" },
  { value: "بلاغ عن مشكلة", label: "بلاغ عن مشكلة" },
  { value: "اقتراح تحسين", label: "اقتراح تحسين" },
  { value: "بلاغ أمني", label: "بلاغ أمني" },
];

export function SupportForm({ supportEmail, initialApp = "" }: { supportEmail: string; initialApp?: string }) {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [appSlug, setAppSlug] = useState(initialApp);
  const [message, setMessage] = useState("");

  const subject = `[CTO-DRS] ${category}${appSlug ? ` — ${appSlug}` : ""}`;
  const body = `${message}\n\n—\nأُرسل من صفحة الدعم في بوابة CTO-DRS`;

  function send(e: React.FormEvent) {
    e.preventDefault();
    const href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <form className="support-form" onSubmit={send}>
      <div className="field-row">
        <label className="field">
          <span>نوع الطلب</span>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>المشروع (اختياري)</span>
          <input
            type="text"
            value={appSlug}
            onChange={e => setAppSlug(e.target.value)}
            placeholder="مثال: DRS Wallet"
          />
        </label>
      </div>
      <label className="field">
        <span>تفاصيل الرسالة</span>
        <textarea
          rows={5}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="اشرح طلبك بوضوح، وأرفق خطوات إعادة إنتاج المشكلة إن وجدت…"
          required
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="button primary" disabled={!message.trim()}>
          <Send size={16} aria-hidden /> تكوين الرسالة وإرسالها
        </button>
        <a className="button secondary" href={`mailto:${supportEmail}`}><Mail size={16} aria-hidden /> بريد مباشر</a>
      </div>
      <p className="form-note">
        لا يُرسل هذا النموذج أي بيانات إلى خادم؛ يفتح بريدك الإلكتروني برسالة مُعدّة مسبقًا إلى {supportEmail}.
        لا تُضمّن كلمات مرور أو بيانات شخصية حساسة.
      </p>
      <a className="text-link" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
        <ExternalLink size={14} aria-hidden /> بلاغات الأخطاء عبر GitHub
      </a>
    </form>
  );
}
