"use client";

import { t } from "@/lib/i18n";
import type { Lang, StudyPack } from "@/lib/types";

export function SummaryPanel({ pack, lang }: { pack: StudyPack; lang: Lang }) {
  const copy = t(lang);

  return (
    <div className="summary">
      <p className="lead reveal">{pack.summary}</p>

      <section aria-labelledby="key-ideas">
        <h3 className="sectionLabel" id="key-ideas">
          {copy.keyIdeas as string}
        </h3>
        <ol className="keyList">
          {pack.keyPoints.map((point, index) => (
            <li className="keyItem reveal" key={`${point.text}-${index}`} style={{ "--delay": `${80 + index * 45}ms` } as React.CSSProperties}>
              <span className="keyNum" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="keyText">{point.text}</span>
              {point.page ? (
                <span className="pageChip">
                  {copy.source as string} {point.page}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {pack.terms.length > 0 ? (
        <section aria-labelledby="terms">
          <h3 className="sectionLabel" id="terms">
            {copy.terms as string}
          </h3>
          <div className="termsGrid">
            {pack.terms.map((term, index) => (
              <article className="term reveal" key={`${term.term}-${index}`} style={{ "--delay": `${140 + index * 40}ms` } as React.CSSProperties}>
                <h4 className="termName">{term.term}</h4>
                <p className="termDef">{term.definition}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
