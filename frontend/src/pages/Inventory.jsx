import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listProducts } from "../api/productsApi";
import { createTransaction, listTransactions } from "../api/inventoryApi";

export default function Inventory() {
  const qc = useQueryClient();
  const [productId, setProductId] = useState("");
  const [type, setType] = useState("stock_in");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const products = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const txns = useQuery({
    queryKey: ["txns", productId || null],
    queryFn: () => listTransactions(productId ? Number(productId) : undefined),
  });

  const create = useMutation({
    mutationFn: (payload) => createTransaction(payload),
    onSuccess: () => {
      setQuantity(1);
      setNote("");
      qc.invalidateQueries({ queryKey: ["txns"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Inventory</h1>
        <div className="text-sm text-slate-600">Stock in/out/adjustment + history</div>
      </div>

      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-3 font-medium">New transaction</h2>
        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate({ product_id: Number(productId), type, quantity: Number(quantity), note: note || null });
          }}
        >
          <select className="rounded border px-3 py-2 text-sm" value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">Select product</option>
            {(products.data || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.sku} — {p.name}
              </option>
            ))}
          </select>
          <select className="rounded border px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="stock_in">Stock in</option>
            <option value="stock_out">Stock out</option>
            <option value="adjustment">Adjustment</option>
          </select>
          <input className="rounded border px-3 py-2 text-sm" type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white md:col-span-4" disabled={create.isPending}>
            {create.isPending ? "Saving..." : "Create transaction"}
          </button>
        </form>
        {create.error && <div className="mt-2 text-sm text-red-700">{create.error?.response?.data?.detail || "Failed"}</div>}
      </div>

      <div className="rounded bg-white shadow">
        <div className="border-b px-4 py-3 font-medium">Recent transactions</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {txns.isLoading ? (
                <tr>
                  <td className="px-4 py-3" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : (txns.data || []).length ? (
                txns.data.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-2">{t.id}</td>
                    <td className="px-4 py-2">{t.product_id}</td>
                    <td className="px-4 py-2">{t.type}</td>
                    <td className="px-4 py-2">{t.quantity}</td>
                    <td className="px-4 py-2">{t.note || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-slate-600" colSpan={5}>
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

