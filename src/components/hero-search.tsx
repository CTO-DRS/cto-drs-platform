"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/apps?q=${encodeURIComponent(q)}` : "/apps");
  }

  return (
    <form className="hero-search" role="search" onSubmit={submit}>
      <Search size={18} className="search-icon" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="ابحث في مشاريع CTO-DRS…"
        aria-label="البحث في المشاريع"
      />
      <button type="submit" className="button primary search-go">بحث</button>
    </form>
  );
}
