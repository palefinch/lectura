"use client";

import type { Lang } from "@/lib/types";

export function LanguageToggle({
  lang,
  onChange,
  disabled = false,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
  disabled?: boolean;
}) {
  return (
    <div className="langToggle" role="group" aria-label="Language / Limba">
      {(["ro", "ru"] as const).map((code) => (
        <button
          key={code}
          type="button"
          className={`langButton ${lang === code ? "langButtonActive" : ""}`}
          aria-pressed={lang === code}
          disabled={disabled}
          onClick={() => onChange(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
