import { extractText, getDocumentProxy } from "unpdf";

export type ExtractedPdf = {
  pages: number;
  text: string;
};

export async function extractPdf(buffer: ArrayBuffer): Promise<ExtractedPdf> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const result = await extractText(pdf, { mergePages: true });
  return {
    pages: result.totalPages,
    text: result.text.replace(/\r/g, "").trim(),
  };
}
