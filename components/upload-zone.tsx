"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function UploadZone({
  lang,
  busy,
  busyLabel,
  onFile,
}: {
  lang: Lang;
  busy: boolean;
  busyLabel?: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const copy = t(lang);

  function pick(file: File | undefined) {
    if (!file || busy) return;
    onFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <label
      className={`upload ${dragging ? "uploadActive" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!busy) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        pick(event.dataTransfer.files?.[0]);
      }}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        className="fileInput"
        type="file"
        accept="application/pdf,.pdf"
        disabled={busy}
        onChange={(event) => pick(event.target.files?.[0])}
      />
      <span className="uploadIcon" aria-hidden="true">
        {busy ? <Loader2 className="spin" size={22} /> : <UploadCloud size={22} />}
      </span>
      <span className="uploadTitle">
        {busy ? (busyLabel ?? (copy.uploading as string)) : (copy.uploadTitle as string)}
      </span>
      <span className="uploadHint">{copy.uploadHint as string}</span>
      <span className="uploadLimit">{copy.uploadLimit as string}</span>
    </label>
  );
}
