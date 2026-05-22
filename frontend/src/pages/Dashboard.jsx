import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "../api/productsApi";
import { listTransactions } from "../api/inventoryApi";
import Badge from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

function Stat({ label, value, hint, tone = "slate" }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-rose-500 opacity-70" />
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {value}
            </div>
            {hint ? (
              <div className="mt-1 text-xs text-slate-500">{hint}</div>
            ) : null}
          </div>
          <Badge tone={tone}>{label}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });
  const txnsQuery = useQuery({
    queryKey: ["txns", null],
    queryFn: () => listTransactions(),
  });

  const products = productsQuery.data || [];
  const txns = txnsQuery.data || [];

  const lowStock = useMemo(() => {
    return products.filter((p) => (p.reorder_point ?? 0) > 0).length;
  }, [products]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <div className="mt-1 text-sm text-slate-600">
            Quick overview of your inventory workspace.
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat
          label="Products"
          value={productsQuery.isLoading ? "…" : products.length}
          hint="Catalog size"
          tone="indigo"
        />
        <Stat
          label="Transactions"
          value={txnsQuery.isLoading ? "…" : txns.length}
          hint="Last 200 entries"
          tone="emerald"
        />
        <Stat
          label="Reorder Points"
          value={productsQuery.isLoading ? "…" : lowStock}
          hint="Products with reorder point set"
          tone="amber"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <div className="mt-1 text-sm text-slate-600">
            Latest stock movements.
          </div>
        </CardHeader>
        <CardContent>
          {txnsQuery.isLoading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : txns.length ? (
            <div className="space-y-2">
              {txns.slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {t.type} · product #{t.product_id}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      txn #{t.id}
                    </div>
                  </div>
                  <Badge
                    tone={
                      t.type === "stock_out"
                        ? "rose"
                        : t.type === "stock_in"
                          ? "emerald"
                          : "slate"
                    }
                    className="shrink-0"
                  >
                    {t.quantity}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-600">
              No transactions yet. Add a product, then record a stock movement.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

