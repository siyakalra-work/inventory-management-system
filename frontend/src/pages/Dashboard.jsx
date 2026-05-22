import { useQuery } from "@tanstack/react-query";
import { listProducts } from "../api/productsApi";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="rounded bg-white p-4 shadow">
        <div className="text-sm text-slate-600">Products</div>
        <div className="text-2xl font-semibold">{isLoading ? "…" : (data?.length ?? 0)}</div>
      </div>
    </div>
  );
}

