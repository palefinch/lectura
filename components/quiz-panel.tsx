"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang, StudyPack } from "@/lib/types";

const letters = ["A", "B", "C", "D"];

export function QuizPanel({ pack, lang }: { pack: StudyPack; lang: Lang }) {
  const copy = t(lang);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }, [pack]);

  const question = pack.quiz[index];
  if (!question) return null;

  const answered = selected !== null;
  const isCorrect = selected === question.correct;
  const progress = ((index + (answered ? 1 : 0)) / pack.quiz.length) * 100;

  function choose(option: number) {
    if (answered) return;
    setSelected(option);
    if (option === question.correct) setScore((value) => value + 1);
  }

  function next() {
    if (index + 1 >= pack.quiz.length) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const percent = Math.round((score / pack.quiz.length) * 100);
    return (
      <div className="quizResult reveal">
        <p className="quizScore">
          {score}/{pack.quiz.length} <small>{copy.score as string}</small>
        </p>
        <p className="termDef" style={{ fontSize: "0.85rem" }}>
          {percent >= 75
            ? lang === "ro"
              ? "Foarte bine. Poți trece la următoarea lecție."
              : "Очень хорошо. Можно переходить к следующей лекции."
            : lang === "ro"
              ? "Mai repetă fișele și încearcă din nou."
              : "Повтори карточки и попробуй ещё раз."}
        </p>
        <div>
          <button type="button" className="primaryButton" onClick={restart}>
            <RotateCcw size={14} /> {copy.restart as string}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quizTop">
        <span className="quizProgress">
          {copy.quiz as string} {index + 1} / {pack.quiz.length}
        </span>
        {question.page ? (
          <span className="pageChip">
            {copy.source as string} {question.page}
          </span>
        ) : null}
      </div>
      <div className="quizBar" aria-hidden="true">
        <span className="quizBarFill" style={{ width: `${progress}%` }} />
      </div>

      <h3 className="quizQuestion">{question.question}</h3>

      <div className="options" role="group" aria-label={copy.quiz as string}>
        {question.options.map((option, optionIndex) => {
          const correct = answered && optionIndex === question.correct;
          const wrong = answered && optionIndex === selected && !isCorrect;
          return (
            <button
              key={`${option}-${optionIndex}`}
              type="button"
              className={`option ${correct ? "optionCorrect" : ""} ${wrong ? "optionWrong" : ""}`}
              disabled={answered}
              aria-pressed={selected === optionIndex}
              onClick={() => choose(optionIndex)}
            >
              <span className="optionLetter" aria-hidden="true">
                {correct ? <Check size={13} /> : wrong ? <X size={13} /> : letters[optionIndex]}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className={`feedback ${isCorrect ? "feedbackCorrect" : "feedbackWrong"}`} role="status">
          <strong>{isCorrect ? copy.correct : copy.incorrect}.</strong>{" "}
          {question.explanation}
        </div>
      ) : null}

      <div className="quizActions">
        <span className="termDef" style={{ fontSize: "0.72rem" }}>
          {copy.chooseHint as string}
        </span>
        {answered ? (
          <button type="button" className="primaryButton" onClick={next}>
            {index + 1 >= pack.quiz.length ? (copy.finish as string) : (copy.next as string)}
            <ArrowRight size={14} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
