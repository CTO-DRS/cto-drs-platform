import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { SupportForm } from "@/components/support-form";
import { EnDocument } from "@/components/en-document";
import { EnTopbar, EnFooterNote } from "@/components/en-page-shell";

export const metadata: Metadata = {
  title: "Support — CTO-DRS",
  description:
    "Send a question or report an issue in any CTO-DRS project through a form that prepares your message and sends it directly from your own email, plus an English FAQ.",
  alternates: { languages: { ar: "/support", en: "/en/support" } },
};

/** Real FAQ about the platform and app installation — also exposed to search engines via FAQPage */
const FAQ_ITEMS = [
  {
    q: "How do I install an APK from this store?",
    a: "Tap the “Download” button on the app page or in the download dialog, then open the file from your notification shade. On first install Android will ask you to allow installs from unknown sources — allow it for this file only, finish the install, then it's best to turn the option back off.",
  },
  {
    q: "Are the apps safe and open source?",
    a: "Yes. Every app in the catalog links to a public GitHub repository where you can review the full code, and download links lead directly to the official release assets on GitHub itself — no intermediary or shortened links.",
  },
  {
    q: "How do I know if there is a new update?",
    a: "Use the update checker on the “What's new” page: pick the app and type your installed version (you'll find it in “About the app”), and it instantly compares it with the latest release published on GitHub and gives you a download link when an update exists.",
  },
  {
    q: "Why do some apps show as “In development”?",
    a: "The status reflects the repository's reality: an “In development” app hasn't reached a stable official release yet. When the first official release with an APK is published, its page refreshes automatically and the download links appear.",
  },
  {
    q: "What should I do if I hit a problem in one of the apps?",
    a: "Use the support form on this page and mention the app name, version number and the steps that trigger the issue, or open an Issue directly in the app's repository on GitHub so the report reaches the developer with its technical details.",
  },
];

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function EnglishSupportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const app = firstParam(params.app).slice(0, 60);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <EnDocument>
      <main className="container page en-page" lang="en" dir="ltr">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <EnTopbar arHref="/support" />
        <div className="page-intro">
          <div className="eyebrow">We're here to help</div>
          <h1>Support &amp; contact</h1>
          <p>
            Send a question or report an issue in one of the projects. Pick the request type and write the
            details — the form will prepare the message for you.
          </p>
        </div>
        {app && <div className="notice"><b>Report linked to an app:</b> {app}</div>}
        <div className="support-layout">
          <section className="panel">
            <h2>Support form</h2>
            <SupportForm supportEmail="cto.drs@gmail.com" initialApp={app} lang="en" />
          </section>
          <div className="support-side">
            <section className="panel">
              <h2>Other channels</h2>
              <p>For bug reports and suggestions tied to the public repositories.</p>
              <a className="button secondary full" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">Open the CTO-DRS page ↗</a>
            </section>
            <section className="panel">
              <h2>Before you send</h2>
              <ul>
                <li>Check the app page and its status; the issue may already be documented in the changelog.</li>
                <li>Mention the app name, version number and the steps to reproduce the problem.</li>
                <li>Never send passwords, keys or sensitive personal data.</li>
              </ul>
            </section>
          </div>
        </div>

        <section className="faq-section" aria-labelledby="faq-title">
          <h2 id="faq-title"><LifeBuoy size={18} aria-hidden /> Frequently asked questions</h2>
          <p className="faq-intro">
            Quick answers to what DRS store users ask about most — from installation to updates and open source.
          </p>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <details className="faq-item" key={i} open={i === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <div className="faq-foot">
            <span>Didn&apos;t find your answer?</span>
            <Link className="text-link" href="/en/updates">Try the update checker on the “What&apos;s new” page →</Link>
          </div>
        </section>

        <EnFooterNote />
      </main>
    </EnDocument>
  );
}
