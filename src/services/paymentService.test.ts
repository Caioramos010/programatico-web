import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("./api", () => ({ default: mockApi }));

import { paymentService } from "./paymentService";

describe("paymentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("getCheckoutUrl busca URL de checkout", async () => {
    mockApi.get.mockResolvedValue({ data: { url: "https://pay.test" } });
    const result = await paymentService.getCheckoutUrl();
    expect(mockApi.get).toHaveBeenCalledWith("/api/payments/checkout-url");
    expect(result.url).toBe("https://pay.test");
  });

  it("sync envia billId quando informado", async () => {
    mockApi.post.mockResolvedValue({ data: { id: 1 } });
    await paymentService.sync("bill-123");
    expect(mockApi.post).toHaveBeenCalledWith("/api/payments/sync", { billId: "bill-123" });
  });

  it("sync envia body vazio sem billId", async () => {
    mockApi.post.mockResolvedValue({ data: { id: 1 } });
    await paymentService.sync();
    expect(mockApi.post).toHaveBeenCalledWith("/api/payments/sync", {});
  });

  it("cancelSubscription chama endpoint", async () => {
    mockApi.post.mockResolvedValue({ data: {} });
    await paymentService.cancelSubscription();
    expect(mockApi.post).toHaveBeenCalledWith("/api/payments/cancelar");
  });

  it("getHistory busca histórico", async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    await paymentService.getHistory();
    expect(mockApi.get).toHaveBeenCalledWith("/api/payments/historico");
  });

  it("pending bill id persiste em sessionStorage", () => {
    paymentService.savePendingBillId("  bill-abc  ");
    expect(paymentService.getPendingBillId()).toBe("bill-abc");
    paymentService.clearPendingBillId();
    expect(paymentService.getPendingBillId()).toBeNull();
  });

  it("savePendingBillId ignora string vazia", () => {
    paymentService.savePendingBillId("   ");
    expect(paymentService.getPendingBillId()).toBeNull();
  });
});
