import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import PaymentHistorySection from "./PaymentHistorySection";

const mockGetHistory = vi.hoisted(() => vi.fn());

vi.mock("../../services/paymentService", () => ({
  paymentService: {
    getHistory: mockGetHistory,
  },
}));

describe("PaymentHistorySection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe loading e depois histórico pago", async () => {
    mockGetHistory.mockResolvedValue([
      {
        id: 1,
        amount: 29.9,
        status: "PAID",
        method: "PIX",
        createdAt: "2026-01-15T12:00:00.000Z",
      },
    ]);

    render(<PaymentHistorySection />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Pago")).toBeInTheDocument();
    });
    expect(screen.getByText(/R\$\s*29,90/)).toBeInTheDocument();
    expect(screen.getByText(/PIX/)).toBeInTheDocument();
  });

  it("exibe mensagem quando histórico está vazio", async () => {
    mockGetHistory.mockResolvedValue([]);

    render(<PaymentHistorySection variant="root" />);

    await waitFor(() => {
      expect(screen.getByText("Nenhum pagamento registrado ainda.")).toBeInTheDocument();
    });
  });

  it("exibe erro quando fetch falha", async () => {
    mockGetHistory.mockRejectedValue(
      new axios.AxiosError(
        "fail",
        "ERR",
        undefined,
        undefined,
        {
          status: 400,
          data: { mensagem: "Falha no servidor" },
          headers: {},
          statusText: "Bad Request",
          config: {} as never,
        },
      ),
    );

    render(<PaymentHistorySection />);

    await waitFor(() => {
      expect(screen.getByText("Falha no servidor")).toBeInTheDocument();
    });
  });
});
