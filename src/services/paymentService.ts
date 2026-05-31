import api from "./api";

export const paymentService = {
  getCheckoutUrl: () =>
    api.get<{ url: string }>("/api/payments/checkout-url").then((r) => r.data),
};
