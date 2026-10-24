"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang, StudyPack } from "@/lib/types";

export function FlashcardsPanel({ pack, lang }: { pack: StudyPack; lang: Lang }) {
  const copy = t(lang);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  useEffect(() => {
    setFlipped(new Set());
  }, [pack]);

  function toggle(index: number) {
    setFlipped((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div>
      <div className="quizTop" style={{ marginBottom: 14 }}>
        <span className="sectionLabel" style={{ margin: 0 }}>
          {copy.flashcards as string} · {pack.flashcards.length}
        </span>
        <button
          type="button"
          className="ghostButton"
          onClick={() => setFlipped(new Set())}
          aria-label={copy.resetCards as string}
        >
          <RotateCcw size={13} /> {copy.resetCards as string}
        </button>
      </div>
      <div className="flashGrid">
        {pack.flashcards.map((card, index) => {
          const isFlipped = flipped.has(index);
          return (
            <button
              key={`${card.question}-${index}`}
              type="button"
              className="flashcard reveal"
              aria-pressed={isFlipped}
              aria-label={`${card.question}. ${isFlipped ? card.answer : copy.flipHint}`}
              onClick={() => toggle(index)}
              style={{ "--delay": `${index * 55}ms` } as React.CSSProperties}
            >
              <span className={`flashInner ${isFlipped ? "flashInnerFlipped" : ""}`}>
                <span className="flashFace flashFront">
                  <span className="flashHint">{copy.question as string}</span>
                  <span className="flashQ">{card.question}</span>
                  <span className="flashHint">{copy.flipHint as string}</span>
                </span>
                <span className="flashFace flashBack">
                  <span className="flashHint">
                    {copy.answer as string}
                    {card.page ? ` · ${copy.source as string} ${card.page}` : ""}
                  </span>
                  <span className="flashA">{card.answer}</span>
                  <span className="flashHint">{copy.flashcards as string}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
