import Link from "next/link";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand-logo" href="/" aria-label="DRS — الصفحة الرئيسية">
      <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden focusable="false">
        <defs>
          <linearGradient id="drsGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="0.55" stopColor="#6d5cff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <path
          d="M33 8.5c2.2-1.6 5.3 0 5.3 2.7v25.6c0 2.7-3.1 4.3-5.3 2.7L15.6 27.6c-2-1.4-2-4.3 0-5.7L33 8.5z"
          fill="url(#drsGrad)"
        />
        <circle cx="12" cy="24" r="3.4" fill="url(#drsGrad)" opacity="0.85" />
      </svg>
      {!compact && (
        <span className="brand-text">
          <b>DRS</b>
          <small>APPS &amp; MORE</small>
        </span>
      )}
    </Link>
  );
}
