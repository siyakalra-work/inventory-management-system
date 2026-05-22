import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, listProducts } from "../api/productsApi";
import { getStock } from "../api/inventoryApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Table, TD, TH, THead } from "../components/ui/Table";
import { useToastStore } from "../store/toastStore";

function useProductStocks(products) {
  const ids = products.map((p) => p.id);
  const { data } = useQuery({
    queryKey: ["stocks", ids],
    queryFn: async () => {
      const entries = await Promise.all(
        ids.slice(0, 50).map(async (id) => {
          try {
            const res = await getStock(id);
            return [id, res.stock];
          } catch {
            return [id, null];
          }
        }),
      );
      return Object.fromEntries(entries);
    },
    enabled: ids.length > 0,
  });
  return data || {};
}

export default function Products() {
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);

  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    reorder_point: 0,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", q],
    queryFn: () => listProducts(q),
  });

  const rows = useMemo(() => data || [], [data]);
  const stocks = useProductStocks(rows);

  const create = useMutation({
    mutationFn: (payload) => createProduct(payload),
    onSuccess: () => {
      setForm({ sku: "", name: "", category: "", reorder_point: 0 });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ tone: "success", title: "Product created" });
    },
    onError: (e) => {
      toast({
        tone: "error",
        title: "Create failed",
        message: e?.response?.data?.detail || "Try again",
      });
    },
  });

  const lowStockIds = useMemo(() => {
    const set = new Set();
    for (const p of rows) {
      const stock = stocks[p.id];
      if (stock == null) continue;
      if ((p.reorder_point ?? 0) > 0 && stock <= p.reorder_point) set.add(p.id);
    }
    return set;
  }, [rows, stocks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Products</h1>
          <div className="mt-1 text-sm text-slate-600">
            Search, add, and monitor reorder points.
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Input
            className="w-full sm:w-72"
            placeholder="Search by SKU or name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add product</CardTitle>
          <div className="mt-1 text-sm text-slate-600">
            Keep SKUs unique per tenant.
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 gap-3 md:grid-cols-12"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate({
                ...form,
                reorder_point: Number(form.reorder_point || 0),
              });
            }}
          >
            <div className="md:col-span-3">
              <div className="mb-1 text-xs font-semibold text-slate-600">
                SKU
              </div>
              <Input
                placeholder="SKU-001"
                value={form.sku}
                onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))}
                required
              />
            </div>
            <div className="md:col-span-4">
              <div className="mb-1 text-xs font-semibold text-slate-600">
                Name
              </div>
              <Input
                placeholder="Product name"
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="md:col-span-3">
              <div className="mb-1 text-xs font-semibold text-slate-600">
                Category
              </div>
              <Input
                placeholder="e.g. Snacks"
                value={form.category}
                onChange={(e) =>
                  setForm((s) => ({ ...s, category: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <div className="mb-1 text-xs font-semibold text-slate-600">
                Reorder
              </div>
              <Input
                type="number"
                min={0}
                value={form.reorder_point}
                onChange={(e) =>
                  setForm((s) => ({ ...s, reorder_point: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-12">
              <Button
                className="w-full"
                size="lg"
                disabled={create.isPending}
              >
                {create.isPending ? "Creating…" : "Create product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Catalog</CardTitle>
            <div className="mt-1 text-sm text-slate-600">
              {isLoading ? "Loading…" : `${rows.length} products`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="amber">{lowStockIds.size} low</Badge>
            <Badge tone="slate">stocks shown (best-effort)</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="px-5 py-4 text-sm text-rose-700">
              {error?.response?.data?.detail || "Failed to load products"}
            </div>
          ) : (
            <Table>
              <THead>
                <tr>
                  <TH>SKU</TH>
                  <TH>Name</TH>
                  <TH>Category</TH>
                  <TH>Stock</TH>
                  <TH>Reorder</TH>
                  <TH>Status</TH>
                </tr>
              </THead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <TD colSpan={6} className="text-slate-600">
                      Loading…
                    </TD>
                  </tr>
                ) : rows.length ? (
                  rows.map((p) => {
                    const stock = stocks[p.id];
                    const low = lowStockIds.has(p.id);
                    return (
                      <tr key={p.id} className="border-t border-slate-200/70">
                        <TD className="font-medium text-slate-900">{p.sku}</TD>
                        <TD className="text-slate-700">{p.name}</TD>
                        <TD className="text-slate-600">{p.category || "—"}</TD>
                        <TD className="tabular-nums text-slate-900">
                          {stock == null ? "—" : stock}
                        </TD>
                        <TD className="tabular-nums text-slate-700">
                          {p.reorder_point}
                        </TD>
                        <TD>
                          {low ? (
                            <Badge tone="rose">Low</Badge>
                          ) : (
                            <Badge tone="emerald">OK</Badge>
                          )}
                        </TD>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <TD colSpan={6} className="text-slate-600">
                      No products yet.
                    </TD>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

