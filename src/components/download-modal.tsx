"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { QRCodeSVG } from "qrcode.react";
import { Download, Copy, Check, QrCode, X, ScanLine, ShieldCheck } from "lucide-react";
import { toast } from "@/lib/toast";
import type { DownloadLink } from "@/lib/catalog";

type Props = {
  appName: string;
  links: DownloadLink[];
  version: string | null;
};

/** مودال خيارات التحميل: كل روابط APK + رمز QR للمسح المباشر من الجوال + نسخ سريع */
export function DownloadModal({ appName, links, version }: Props) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const qrUrl = links[0]?.url ?? "";

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast("نُسخ رابط التحميل إلى الحافظة", "success");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast("تعذر نسخ الرابط", "error");
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="button secondary full dl-trigger">
          <QrCode size={15} aria-hidden /> خيارات التحميل ورمز QR
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dl-overlay" aria-hidden />
        <Dialog.Content className="dl-content" aria-describedby={undefined}>
          <div className="dl-head">
            <Dialog.Title className="dl-title">
              <Download size={17} aria-hidden /> تحميل {appName}
            </Dialog.Title>
            <Dialog.Close className="dl-close" aria-label="إغلاق">
              <X size={16} aria-hidden />
            </Dialog.Close>
          </div>
          {version && <p className="dl-version">أحدث إصدار: {version}</p>}

          <div className="dl-body">
            <div className="dl-qr-side">
              <div className="dl-qr-frame" dir="ltr">
                {qrUrl ? <QRCodeSVG value={qrUrl} size={148} bgColor="#0b1626" fgColor="#e8f2ff" level="M" /> : null}
              </div>
              <p className="dl-qr-hint">
                <ScanLine size={13} aria-hidden /> امسح الرمز بكاميرا جوالك لبدء التحميل مباشرة
              </p>
            </div>

            <ul className="dl-links" aria-label="روابط التحميل">
              {links.map((link, i) => (
                <li className="dl-link-row" key={i}>
                  <a className="dl-link" href={link.url} target="_blank" rel="noreferrer">
                    <Download size={14} aria-hidden />
                    <span>{link.label.ar}</span>
                  </a>
                  <button
                    type="button"
                    className="dl-copy"
                    onClick={() => copyLink(link.url)}
                    aria-label={`نسخ رابط ${link.label.ar}`}
                  >
                    {copiedUrl === link.url ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
                  </button>
                </li>
              ))}
              <li className="dl-note">
                <ShieldCheck size={13} aria-hidden /> الملفات تُنشر رسميًا على GitHub Releases — تحقق من التوقيع قبل التثبيت.
              </li>
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
