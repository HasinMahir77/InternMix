// pdfWorker.ts
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url"; // Vite/Next

export function setupPdfWorker() {
  GlobalWorkerOptions.workerSrc = workerSrc;
}

export async function loadPdf(file: File): Promise<PDFDocumentProxy> {
  const ab = await file.arrayBuffer();
  return await getDocument({ data: ab }).promise;
}
