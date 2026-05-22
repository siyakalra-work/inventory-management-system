import { api } from "./axios";

export async function createTransaction(payload) {
  const { data } = await api.post("/inventory/transactions", payload);
  return data;
}

export async function listTransactions(productId) {
  const { data } = await api.get("/inventory/transactions", {
    params: productId ? { product_id: productId } : {},
  });
  return data;
}

