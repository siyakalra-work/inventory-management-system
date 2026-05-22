import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Layout() {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);
  return (
    <div className="min-h-screen">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link className="font-semibold" to="/">
            InventoryOS
          </Link>
          <button
            className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white"
            onClick={() => {
              clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="mb-6 flex gap-3 text-sm">
          <Link className="underline" to="/">
            Dashboard
          </Link>
          <Link className="underline" to="/products">
            Products
          </Link>
          <Link className="underline" to="/inventory">
            Inventory
          </Link>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

