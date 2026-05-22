import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listProducts } from "../api/productsApi";
import { createTransaction, getStock, listTransactions } from "../api/inventoryApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Table, TD, TH, THead } from "../components/ui/Table";
import { useToastStore } from "../store/toastStore";

function typeTone(type) {
  if (type === "stock_in") return "emerald";
  if (type === "stock_out") return "rose";
  return "slate";
}

export default function Inventory() {
  const qc = useQueryClient();
  const toast = useToastStore((s) => s.push);

  const [productId, setProductId] = useState("");
  const [type, setType] = useState("stock_in");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const products = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });

  const selectedProduct = useMemo(() => {
    const id = Number(productId);
    return (products.data || []).find((p) => p.id === id) || null;
  }, [products.data, productId]);

  const stockQuery = useQuery({
    queryKey: ["stock", productId || null],
    queryFn: () => getStock(Number(productId)),
    enabled: Boolean(productId),
  });

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
      qc.invalidateQueries({ queryKey: ["stock"] });
      toast({ tone: "success", title: "Transaction recorded" });
    },
    onError: (e) => {
      toast({
        tone: "error",
        title: "Transaction failed",
        message: e?.response?.data?.detail || "Try again",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Inventory</h1>
          <div className="mt-1 text-sm text-slate-600">
            Record stock movements and review history.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="slate">tenant-scoped</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New transaction</CardTitle>
            <div className="mt-1 text-sm text-slate-600">
              Choose a product, then stock in/out/adjust.
            </div>
          </CardHeader>
          <CardContent>
            <form
              className="grid grid-cols-1 gap-3 md:grid-cols-12"
              onSubmit={(e) => {
                e.preventDefault();
                create.mutate({
                  product_id: Number(productId),
                  type,
                  quantity: Number(quantity),
                  note: note || null,
                });
              }}
            >
              <div className="md:col-span-5">
                <div className="mb-1 text-xs font-semibold text-slate-600">
                  Product
                </div>
                <Select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                >
                  <option value="">Select product</option>
                  {(products.data || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} — {p.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="md:col-span-3">
                <div className="mb-1 text-xs font-semibold text-slate-600">
                  Type
                </div>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="stock_in">Stock in</option>
                  <option value="stock_out">Stock out</option>
                  <option value="adjustment">Adjustment</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <div className="mb-1 text-xs font-semibold text-slate-600">
                  Quantity
                </div>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="md:col-span-12">
                <div className="mb-1 text-xs font-semibold text-slate-600">
                  Note (optional)
                </div>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. supplier delivery, damaged stock, cycle count…"
                />
              </div>
              <div className="md:col-span-12">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={create.isPending}
                >
                  {create.isPending ? "Saving…" : "Record transaction"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock snapshot</CardTitle>
            <div className="mt-1 text-sm text-slate-600">
              {selectedProduct
                ? `${selectedProduct.sku} — ${selectedProduct.name}`
                : "Select a product"}
            </div>
          </CardHeader>
          <CardContent>
            {productId ? (
              stockQuery.isLoading ? (
                <div className="text-sm text-slate-600">Loading…</div>
              ) : stockQuery.error ? (
                <div className="text-sm text-rose-700">Failed to load stock</div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4">
                    <div className="text-xs font-semibold text-slate-600">
                      Current stock
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
                      {stockQuery.data.stock}
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
                    <div className="text-sm text-slate-700">Reorder point</div>
                    <div className="text-sm font-semibold tabular-nums text-slate-900">
                      {stockQuery.data.reorder_point}
                    </div>
                  </div>
                  {(stockQuery.data.reorder_point ?? 0) > 0 &&
                  stockQuery.data.stock <= stockQuery.data.reorder_point ? (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      Low stock. Consider stocking in soon.
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Stock level looks healthy.
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="text-sm text-slate-600">
                Select a product to see stock and reorder status.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent transactions</CardTitle>
            <div className="mt-1 text-sm text-slate-600">
              {txns.isLoading ? "Loading…" : `${(txns.data || []).length} shown`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {productId ? (
              <Badge tone="indigo">filtered</Badge>
            ) : (
              <Badge tone="slate">all products</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <THead>
              <tr>
                <TH>ID</TH>
                <TH>Product</TH>
                <TH>Type</TH>
                <TH>Qty</TH>
                <TH>Note</TH>
              </tr>
            </THead>
            <tbody>
              {txns.isLoading ? (
                <tr>
                  <TD colSpan={5} className="text-slate-600">
                    Loading…
                  </TD>
                </tr>
              ) : (txns.data || []).length ? (
                txns.data.map((t) => (
                  <tr key={t.id} className="border-t border-slate-200/70">
                    <TD className="tabular-nums text-slate-700">{t.id}</TD>
                    <TD className="text-slate-900">#{t.product_id}</TD>
                    <TD>
                      <Badge tone={typeTone(t.type)}>{t.type}</Badge>
                    </TD>
                    <TD className="tabular-nums font-medium text-slate-900">
                      {t.quantity}
                    </TD>
                    <TD className="text-slate-600">{t.note || "—"}</TD>
                  </tr>
                ))
              ) : (
                <tr>
                  <TD colSpan={5} className="text-slate-600">
                    No transactions yet.
                  </TD>
                </tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

