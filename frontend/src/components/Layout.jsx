import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { cn } from "../lib/cn";

export default function Layout() {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);
  const role = useAuthStore((s) => s.role);
  return (
    <div className="min-h-screen bg-slate-50 app-gradient">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4 shadow-sm">
              <Link to="/" className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white">
                  IO
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    InventoryOS
                  </div>
                  <div className="text-xs text-slate-600">
                    {role || "signed in"}
                  </div>
                </div>
              </Link>
            </div>

            <nav className="rounded-2xl border border-slate-200/70 bg-white p-2 shadow-sm">
              {[
                { to: "/", label: "Dashboard" },
                { to: "/products", label: "Products" },
                { to: "/inventory", label: "Inventory" },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-700 hover:bg-slate-50",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                className="mt-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  clear();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500">
                InventoryOS
              </div>
              <div className="text-lg font-semibold text-slate-900">
                Manage products and stock
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/products"
                className="hidden rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 md:inline-flex"
              >
                Add products
              </Link>
              <button
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                onClick={() => {
                  clear();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
