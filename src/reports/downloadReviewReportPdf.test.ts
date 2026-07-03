import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const toBlob = vi.fn();

vi.mock("@react-pdf/renderer", () => ({
  pdf: vi.fn(() => ({ toBlob })),
}));

vi.mock("./ReviewReportPdf", () => ({
  ReviewReportPdf: () => null,
}));

import { downloadReviewReportPdf } from "./downloadReviewReportPdf";

describe("downloadReviewReportPdf", () => {
  const createObjectURL = vi.fn(() => "blob:mock");
  const revokeObjectURL = vi.fn();
  const click = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    toBlob.mockResolvedValue(new Blob(["pdf"], { type: "application/pdf" }));
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gera blob, dispara download e revoga URL", async () => {
    const appendChild = vi.spyOn(document.body, "appendChild");
    const removeChild = vi.spyOn(document.body, "removeChild");
    const link = document.createElement("a");
    vi.spyOn(document, "createElement").mockReturnValue(link);
    link.click = click;

    await downloadReviewReportPdf({
      userName: "aluno",
      selectedTrack: "Lógica",
      selectedDays: "7",
      extractionDate: "2026-06-29",
      currentXp: 100,
      stats: [],
      performanceData: [],
      subjectAccuracy: [],
      errorsBySubject: [],
      reviewNow: [],
      recentMissions: [],
    });

    expect(toBlob).toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(link.download).toBe("DesempenhoProgramatico.pdf");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");
    expect(appendChild).toHaveBeenCalledWith(link);
    expect(removeChild).toHaveBeenCalledWith(link);
  });
});
