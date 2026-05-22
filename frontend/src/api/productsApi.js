import { api } from "./axios";

export async function listProducts(q) {
  const { data } = await api.get("/products", { params: q ? { q } : {} });
  return data;
}

export async function createProduct(payload) {
  const { data } = await api.post("/products", payload);
  return data;
}

