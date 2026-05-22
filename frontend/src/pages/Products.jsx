import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, listProducts } from "../api/productsApi";

export default function Products() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ sku: "", name: "", category: "", reorder_point: 0 });

  const { data, isLoading } = useQuery({
    queryKey: ["products", q],
    queryFn: () => listProducts(q),
  });

  const create = useMutation({
    mutationFn: (payload) => createProduct(payload),
    onSuccess: () => {
      setForm({ sku: "", name: "", category: "", reorder_point: 0 });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const rows = useMemo(() => data || [], [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <div className="text-sm text-slate-600">Tenant-scoped product catalog</div>
        </div>
        <input className="w-64 rounded border px-3 py-2 text-sm" placeholder="Search by SKU/name" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-3 font-medium">Add product</h2>
        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate({ ...form, reorder_point: Number(form.reorder_point || 0) });
          }}
        >
          <input className="rounded border px-3 py-2 text-sm" placeholder="SKU" value={form.sku} onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Category" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Reorder point"
            type="number"
            value={form.reorder_point}
            onChange={(e) => setForm((s) => ({ ...s, reorder_point: e.target.value }))}
          />
          <button className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white md:col-span-4" disabled={create.isPending}>
            {create.isPending ? "Saving..." : "Create product"}
          </button>
        </form>
        {create.error && <div className="mt-2 text-sm text-red-700">{create.error?.response?.data?.detail || "Failed"}</div>}
      </div>

      <div className="rounded bg-white shadow">
        <div className="border-b px-4 py-3 font-medium">Catalog</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Reorder</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-4 py-3" colSpan={4}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.sku}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.category || "-"}</td>
                    <td className="px-4 py-2">{p.reorder_point}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-slate-600" colSpan={4}>
                    No products yet
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

