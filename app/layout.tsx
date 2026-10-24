import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import "./globals.css";

const display = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lectura — asistent de studiu RO/RU",
  description:
    "Bilingual Romanian/Russian study assistant for lecture PDFs: summaries, flashcards and practice tests. Skeleton for the Meta Global AI Developer Hackathon.",
  metadataBase: new URL("https://github.com/palefinch/lectura"),
  openGraph: {
    title: "Lectura — învață din lecțiile tale",
    description:
      "Summaries, flashcards and practice tests from lecture PDFs, in Romanian or Russian.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
