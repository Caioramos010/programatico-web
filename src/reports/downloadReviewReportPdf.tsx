import { pdf } from "@react-pdf/renderer";
import { ReviewReportPdf, type ReviewReportData } from "./ReviewReportPdf";

export async function downloadReviewReportPdf(data: ReviewReportData) {
  const blob = await pdf(<ReviewReportPdf data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-review-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

