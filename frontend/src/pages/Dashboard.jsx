import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "../api/productsApi";
import { listTransactions } from "../api/inventoryApi";
import Badge from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { IconActivity, IconAlert, IconBox } from "../components/ui/Icons";

function Stat({ label, value, hint, tone = "slate" }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-400 opacity-80" />
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-300">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-white">
              {value}
            </div>
            {hint ? (
              <div className="mt-1 text-xs text-slate-400">{hint}</div>
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
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <div className="mt-1 text-sm text-slate-300">
            Quick overview — District-style, inventory-focused.
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10">
          <IconActivity className="h-4 w-4" />
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today</CardTitle>
            <div className="mt-1 text-sm text-slate-300">
              A quick checklist to stay ahead.
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-3xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <IconBox className="h-4 w-4" />
                  Add SKUs
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Keep catalog tidy and searchable.
                </div>
              </div>
              <div className="rounded-3xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <IconAlert className="h-4 w-4" />
                  Set reorder points
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Avoid running out unexpectedly.
                </div>
              </div>
              <div className="rounded-3xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold text-slate-200">
                  Move stock
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Record receipts, sales, and adjustments.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
            <div className="mt-1 text-sm text-slate-300">
              Snapshot of what to watch.
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <div className="text-sm text-slate-200">Low-stock watch</div>
                <Badge tone={lowStock ? "rose" : "emerald"}>
                  {lowStock ? "Review" : "OK"}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <div className="text-sm text-slate-200">Audit trail</div>
                <Badge tone="slate">On</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <div className="mt-1 text-sm text-slate-300">
            Latest stock movements.
          </div>
        </CardHeader>
        <CardContent>
          {txnsQuery.isLoading ? (
            <div className="text-sm text-slate-300">Loading…</div>
          ) : txns.length ? (
            <div className="space-y-2">
              {txns.slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white">
                      {t.type} · product #{t.product_id}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
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
            <div className="text-sm text-slate-300">
              No transactions yet. Add a product, then record a stock movement.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
