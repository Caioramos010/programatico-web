import { pdf } from "@react-pdf/renderer";
import { ReviewReportPdf, type ReviewReportData } from "./ReviewReportPdf";

export async function downloadReviewReportPdf(data: ReviewReportData) {
  const blob = await pdf(<ReviewReportPdf data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  // Data no nome: vários relatórios não se sobrescrevem na pasta de downloads.
  const hoje = new Date();
  const dataArquivo = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
  link.download = `relatorio-programatico-${dataArquivo}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

