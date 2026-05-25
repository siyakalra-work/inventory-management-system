import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "../api/productsApi";
import { getStock } from "../api/inventoryApi";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function Alerts() {
  const [q, setQ] = useState("");

  const productsQuery = useQuery({
    queryKey: ["products", q],
    queryFn: () => listProducts(q),
  });

  const products = productsQuery.data || [];
  const ids = useMemo(() => products.map((p) => p.id), [products]);

  const stocksQuery = useQuery({
    queryKey: ["stocks", ids],
    queryFn: async () => {
      const entries = await Promise.all(
        ids.slice(0, 60).map(async (id) => {
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

  const stocks = stocksQuery.data || {};

  const low = useMemo(() => {
    return products
      .map((p) => {
        const stock = stocks[p.id];
        const rp = p.reorder_point ?? 0;
        const isLow = stock != null && rp > 0 && stock <= rp;
        return { p, stock, rp, isLow };
      })
      .filter((x) => x.isLow)
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
  }, [products, stocks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Alerts</h1>
          <div className="mt-1 text-sm text-slate-600">
            Low stock items based on reorder points.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="rose">{low.length} low</Badge>
          <Badge tone="slate">top 60</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          className="sm:w-80"
          placeholder="Search by SKU/name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => productsQuery.refetch()}
          disabled={productsQuery.isFetching}
        >
          Refresh
        </Button>
      </div>

      {productsQuery.isLoading || stocksQuery.isLoading ? (
        <div className="surface soft-shadow rounded-3xl p-6 text-sm text-slate-600">
          Loading alerts…
        </div>
      ) : low.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {low.map(({ p, stock, rp }) => (
            <div key={p.id} className="surface soft-shadow overflow-hidden rounded-3xl">
              <div className="poster p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white/70">
                      {p.category || "Uncategorized"}
                    </div>
                    <div className="mt-1 truncate text-lg font-semibold">
                      {p.name}
                    </div>
                    <div className="mt-1 text-xs text-white/80">SKU: {p.sku}</div>
                  </div>
                  <Badge tone="rose">Low</Badge>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-xs font-semibold text-slate-600">Stock</div>
                    <div className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                      {stock}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-xs font-semibold text-slate-600">Reorder</div>
                    <div className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                      {rp}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  Recommended: stock in soon.
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface soft-shadow rounded-3xl p-8">
          <div className="text-sm font-semibold text-slate-900">All good</div>
          <div className="mt-1 text-sm text-slate-600">
            No low-stock items found. Add reorder points to products to enable alerts.
          </div>
        </div>
      )}
    </div>
  );
}

