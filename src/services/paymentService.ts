import api from "./api";
import type { User } from "../stores/authStore";

const PENDING_BILL_KEY = "pendingRootBillId";

export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";
export type PaymentMethod = "PIX" | "CARD" | "UNKNOWN";

export interface PaymentHistoryItem {
  id: number;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  billId: string | null;
  createdAt: string;
}

export const paymentService = {
  getCheckoutUrl: () =>
    api.get<{ url: string; billId?: string }>("/api/payments/checkout-url").then((r) => r.data),

  sync: (billId?: string) =>
    api
      .post<User>("/api/payments/sync", billId ? { billId } : {})
      .then((r) => r.data),

  cancelSubscription: () =>
    api.post<User>("/api/payments/cancelar").then((r) => r.data),

  getHistory: () =>
    api.get<PaymentHistoryItem[]>("/api/payments/historico").then((r) => r.data),

  savePendingBillId: (billId: string) => {
    if (billId.trim()) {
      sessionStorage.setItem(PENDING_BILL_KEY, billId.trim());
    }
  },

  getPendingBillId: () => sessionStorage.getItem(PENDING_BILL_KEY),

  clearPendingBillId: () => sessionStorage.removeItem(PENDING_BILL_KEY),
};
