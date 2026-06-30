import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import { reviewService } from "./reviewService";

describe("reviewService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getReview sem params", async () => {
    mockApi.get.mockResolvedValue({ data: { selectedTrackId: null, stats: [] } });
    await reviewService.getReview();
    expect(mockApi.get).toHaveBeenCalledWith("/api/review", { params: undefined });
  });

  it("getReview com trackId e days", async () => {
    mockApi.get.mockResolvedValue({ data: { selectedTrackId: 2, selectedDays: 7 } });
    await reviewService.getReview({ trackId: 2, days: 7 });
    expect(mockApi.get).toHaveBeenCalledWith("/api/review", { params: { trackId: 2, days: 7 } });
  });
});
