"use client";

import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Code2,
  FileText,
  Library,
  ListChecks,
  Loader2,
  RotateCcw,
  Settings2,
  Sparkles,
} from "lucide-react";
import { demoDocument, demoPack } from "@/lib/demo";
import { t } from "@/lib/i18n";
import type {
  DocumentMeta,
  ExtractResponse,
  Lang,
  StudyPack,
  StudyResponse,
} from "@/lib/types";
import { FlashcardsPanel } from "./flashcards-panel";
import { LanguageToggle } from "./language-toggle";
import { QuizPanel } from "./quiz-panel";
import { SummaryPanel } from "./summary-panel";
import { UploadZone } from "./upload-zone";

type Tab = "summary" | "flashcards" | "quiz";
type Busy = "idle" | "extract" | "study";

const repoUrl = "https://github.com/palefinch/lectura";

export function Workspace() {
  const [lang, setLang] = useState<Lang>("ro");
  const [doc, setDoc] = useState<DocumentMeta>(() => demoDocument("ro"));
  const [pack, setPack] = useState<StudyPack>(() => demoPack("ro"));
  const [provider, setProvider] = useState<"meta" | "mock">("mock");
  const [tab, setTab] = useState<Tab>("summary");
  const [busy, setBusy] = useState<Busy>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const requestId = useRef(0);

  const copy = t(lang);
  const providerLabel = provider === "meta" ? (copy.apiReady as string) : (copy.demoProvider as string);
  const docMeta = useMemo(() => {
    const number = new Intl.NumberFormat(lang === "ro" ? "ro-RO" : "ru-RU").format(doc.chars);
    return `${doc.pages} ${copy.pages} · ${number} ${copy.chars}`;
  }, [copy.chars, copy.pages, doc.chars, doc.pages, lang]);

  async function requestPack(
    text: string,
    nextLang: Lang,
    title: string,
  ): Promise<StudyResponse | null> {
    const id = ++requestId.current;
    const response = await fetch("/api/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang: nextLang, title }),
    });
    const data = (await response.json()) as StudyResponse | { error?: string };
    if (id !== requestId.current) return null;
    if (!response.ok) throw new Error(("error" in data && data.error) || t(nextLang).error);
    return data as StudyResponse;
  }

  async function switchLang(nextLang: Lang) {
    if (nextLang === lang || busy !== "idle") return;
    setError(null);
    setLang(nextLang);

    if (isDemo || !doc.text) {
      setDoc(demoDocument(nextLang));
      setPack(demoPack(nextLang));
      setProvider("mock");
      setIsDemo(true);
      setTab("summary");
      return;
    }

    setBusy("study");
    try {
      const result = await requestPack(doc.text, nextLang, doc.name);
      if (result) {
        setPack(result.pack);
        setProvider(result.provider);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t(nextLang).error);
    } finally {
      setBusy("idle");
    }
  }

  async function handleFile(file: File) {
    if (busy !== "idle") return;
    setError(null);
    setBusy("extract");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("lang", lang);

      const response = await fetch("/api/extract", { method: "POST", body: form });
      const data = (await response.json()) as ExtractResponse | { error?: string };
      if (!response.ok) {
        throw new Error(("error" in data && data.error) || t(lang).error);
      }

      const nextDoc = (data as ExtractResponse).document;
      setDoc(nextDoc);
      setIsDemo(false);
      setBusy("study");

      const result = await requestPack(nextDoc.text ?? "", lang, nextDoc.name);
      if (result) {
        setPack(result.pack);
        setProvider(result.provider);
        setTab("summary");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t(lang).error);
    } finally {
      setBusy("idle");
    }
  }

  function resetDemo() {
    requestId.current += 1;
    setLang(lang);
    setDoc(demoDocument(lang));
    setPack(demoPack(lang));
    setProvider("mock");
    setIsDemo(true);
    setError(null);
    setTab("summary");
    setBusy("idle");
  }

  const status =
    busy === "extract"
      ? copy.uploading
      : busy === "study"
        ? copy.generating
        : isDemo
          ? copy.demoBadge
          : providerLabel;

  return (
    <div className="shell">
      <aside className="rail">
        <a className="brand" href="/" aria-label="Lectura">
          <span className="brandMark" aria-hidden="true">
            L
          </span>
          <span className="brandWord">
            lectura<span className="brandDot">.</span>
          </span>
        </a>
        <p className="railNote">{copy.railNote}</p>

        <nav className="railNav" aria-label="Navigare principală">
          <button type="button" className="navItem navItemActive">
            <Library className="navIcon" size={16} />
            {copy.library}
            <span className="navBadge">PDF</span>
          </button>
          <button type="button" className="navItem" disabled>
            <Settings2 className="navIcon" size={16} />
            {copy.settings}
            <span className="navBadge">soon</span>
          </button>
        </nav>

        <div className="railDoc">
          <span className="railDocLabel">{copy.activeDoc}</span>
          <strong className="railDocName">{doc.name}</strong>
          <span className="railDocMeta">{docMeta}</span>
        </div>

        <div className="railFooter">
          <div className="statusLine" aria-live="polite">
            <span className="statusDot" aria-hidden="true" />
            {status}
          </div>
          <a className="ghLink" href={repoUrl} target="_blank" rel="noreferrer">
            <Code2 size={12} /> GitHub
          </a>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="kicker">{copy.kicker}</span>
            <h1 className="headline">{copy.headline}</h1>
            <p className="subhead">{copy.subhead}</p>
          </div>
          <LanguageToggle lang={lang} onChange={switchLang} disabled={busy !== "idle"} />
        </header>

        <div className="workspace">
          <div className="leftCol">
            <UploadZone
              lang={lang}
              busy={busy !== "idle"}
              busyLabel={busy === "study" ? (copy.generating as string) : (copy.uploading as string)}
              onFile={handleFile}
            />

            <div className="card docCard">
              <span className="docIcon" aria-hidden="true">
                <FileText size={19} />
              </span>
              <div className="docBody">
                <p className="docName">{doc.name}</p>
                <p className="docMeta">{docMeta}</p>
              </div>
            </div>

            <p className="hint">{isDemo ? copy.demoHint : copy.uploadedHint}</p>
            {!isDemo ? (
              <button type="button" className="ghostButton" onClick={resetDemo}>
                <RotateCcw size={13} /> {copy.tryDemo}
              </button>
            ) : null}

            <div className="how">
              <span className="sectionLabel">{copy.howTitle}</span>
              <ol className="howList">
                <li>
                  <span className="howNum" aria-hidden="true">01</span>
                  {copy.how1}
                </li>
                <li>
                  <span className="howNum" aria-hidden="true">02</span>
                  {copy.how2}
                </li>
                <li>
                  <span className="howNum" aria-hidden="true">03</span>
                  {copy.how3}
                </li>
              </ol>
            </div>
          </div>

          <div className="rightCol">
            <article className="packCard" aria-busy={busy !== "idle"}>
              <header className="packHeader">
                <div>
                  <h2 className="packTitle">{pack.title}</h2>
                  <div className="packMeta">
                    <span className="providerPill">
                      <span className="providerDot" aria-hidden="true" />
                      {providerLabel}
                    </span>
                    <span>
                      {doc.pages} {copy.pages}
                    </span>
                  </div>
                </div>
                <Sparkles size={20} aria-hidden="true" style={{ color: "var(--terracotta)", flex: "none" }} />
              </header>

              <div className="tabs" role="tablist" aria-label={copy.library as string}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "summary"}
                  className={`tab ${tab === "summary" ? "tabActive" : ""}`}
                  onClick={() => setTab("summary")}
                >
                  <BookOpen size={14} /> {copy.summary}
                  <span className="tabCount">{pack.keyPoints.length}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "flashcards"}
                  className={`tab ${tab === "flashcards" ? "tabActive" : ""}`}
                  onClick={() => setTab("flashcards")}
                >
                  <ListChecks size={14} /> {copy.flashcards}
                  <span className="tabCount">{pack.flashcards.length}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "quiz"}
                  className={`tab ${tab === "quiz" ? "tabActive" : ""}`}
                  onClick={() => setTab("quiz")}
                >
                  <Sparkles size={14} /> {copy.quiz}
                  <span className="tabCount">{pack.quiz.length}</span>
                </button>
              </div>

              <div className="packBody" role="tabpanel">
                {error ? (
                  <div className="errorBox" role="alert">
                    {error}
                  </div>
                ) : null}

                {busy !== "idle" ? (
                  <div className="loading" role="status" aria-live="polite">
                    <span className="srOnly">{busy === "extract" ? copy.uploading : copy.generating}</span>
                    <span className="skeletonLine" />
                    <span className="skeletonLine" />
                    <span className="skeletonLine" />
                    <span className="skeletonLine" />
                    <span className="statusLine" style={{ marginTop: 8 }}>
                      <Loader2 size={13} className="spin" aria-hidden="true" />
                      {busy === "extract" ? copy.uploading : copy.generating}
                    </span>
                  </div>
                ) : tab === "summary" ? (
                  <SummaryPanel pack={pack} lang={lang} />
                ) : tab === "flashcards" ? (
                  <FlashcardsPanel pack={pack} lang={lang} />
                ) : (
                  <QuizPanel pack={pack} lang={lang} />
                )}
              </div>
            </article>

            <footer className="footer">
              <span>{copy.footer}</span>
              <a href={repoUrl} target="_blank" rel="noreferrer">
                github.com/palefinch/lectura
              </a>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
