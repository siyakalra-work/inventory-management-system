import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "../api/productsApi";
import { listTransactions } from "../api/inventoryApi";
import Badge from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { IconActivity, IconAlert, IconBox } from "../components/ui/Icons";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import KpiCard from "../components/ui/KpiCard";
import { IconCoin, IconBoxes, IconTrendUp } from "../components/ui/Icons";

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

  const kpis = useMemo(() => {
    const productsCount = products.length;
    const withReorder = products.filter((p) => (p.reorder_point ?? 0) > 0).length;
    const movements = txns.length;

    let net = 0;
    for (const t of txns) net += Number(t.quantity || 0);

    const topType = txns.reduce(
      (acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1;
        return acc;
      },
      {},
    );
    const mostCommonType = Object.entries(topType).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return {
      productsCount,
      withReorder,
      movements,
      net,
      mostCommonType,
    };
  }, [products, txns]);

  return (
    <div className="space-y-6">
      <div className="poster soft-shadow overflow-hidden rounded-3xl p-6 text-white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-white/70">Today</div>
            <h1 className="mt-1 text-2xl font-semibold leading-tight">
              Inventory dashboard
            </h1>
            <div className="mt-2 text-sm text-white/80">
              Track products, keep reorder points in check, and log stock moves.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/products">
                <Button size="sm">Add products</Button>
              </Link>
              <Link to="/alerts">
                <Button size="sm" variant="secondary">
                  View alerts
                </Button>
              </Link>
              <Link to="/inventory">
                <Button size="sm" variant="secondary">
                  Record stock
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-semibold text-white">
            <IconActivity className="h-4 w-4" />
            Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard
          title="Products"
          value={kpis.productsCount}
          subtitle="Total SKUs in catalog"
          tone="indigo"
          icon={<IconBoxes />}
          loading={productsQuery.isLoading}
        />
        <KpiCard
          title="Movements"
          value={kpis.movements}
          subtitle={`Most common: ${kpis.mostCommonType}`}
          tone="emerald"
          icon={<IconTrendUp />}
          loading={txnsQuery.isLoading}
        />
        <KpiCard
          title="Net Quantity"
          value={kpis.net}
          subtitle="Net delta (last 200)"
          tone="amber"
          icon={<IconCoin />}
          loading={txnsQuery.isLoading}
        />
        <KpiCard
          title="Reorder Points"
          value={kpis.withReorder}
          subtitle="Products with RP set"
          tone="rose"
          icon={<IconAlert />}
          loading={productsQuery.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <div className="mt-1 text-sm text-slate-600">
              Common tasks to keep things moving.
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/products"
                className="surface rounded-3xl p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="text-sm font-semibold text-slate-900">
                  Add products
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Create SKUs and set reorder points.
                </div>
              </Link>
              <Link
                to="/inventory"
                className="surface rounded-3xl p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="text-sm font-semibold text-slate-900">
                  Record stock
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Stock in, out, and adjustments.
                </div>
              </Link>
              <Link
                to="/alerts"
                className="surface rounded-3xl p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="text-sm font-semibold text-slate-900">
                  Check alerts
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Low stock items to replenish.
                </div>
              </Link>
              <div className="surface rounded-3xl p-4">
                <div className="text-sm font-semibold text-slate-900">
                  Coming soon
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Reports, exports, and user invites.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent products</CardTitle>
            <div className="mt-1 text-sm text-slate-600">
              Latest additions (up to 6).
            </div>
          </CardHeader>
          <CardContent>
            {productsQuery.isLoading ? (
              <div className="text-sm text-slate-600">Loading…</div>
            ) : products.length ? (
              <div className="space-y-2">
                {products.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {p.name}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {p.sku} · {p.category || "Uncategorized"}
                      </div>
                    </div>
                    <Badge tone={(p.reorder_point ?? 0) > 0 ? "amber" : "slate"}>
                      RP {p.reorder_point}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-600">
                No products yet. Add your first SKU.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today</CardTitle>
            <div className="mt-1 text-sm text-slate-600">
              A quick checklist to stay ahead.
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="surface rounded-3xl px-4 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <IconBox className="h-4 w-4" />
                  Add SKUs
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Keep catalog tidy and searchable.
                </div>
              </div>
              <div className="surface rounded-3xl px-4 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <IconAlert className="h-4 w-4" />
                  Set reorder points
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Avoid running out unexpectedly.
                </div>
              </div>
              <div className="surface rounded-3xl px-4 py-4">
                <div className="text-xs font-semibold text-slate-700">
                  Move stock
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Record receipts, sales, and adjustments.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
            <div className="mt-1 text-sm text-slate-600">
              Snapshot of what to watch.
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-sm text-slate-700">Low-stock watch</div>
                <Badge tone={kpis.withReorder ? "amber" : "emerald"}>
                  {kpis.withReorder ? "Watch" : "OK"}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-sm text-slate-700">Audit trail</div>
                <Badge tone="slate">On</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
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
