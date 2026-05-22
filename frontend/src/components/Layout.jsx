import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { cn } from "../lib/cn";
import Input from "./ui/Input";
import {
  IconBox,
  IconDashboard,
  IconRepeat,
  IconSearch,
} from "./ui/Icons";

export default function Layout() {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);
  const role = useAuthStore((s) => s.role);
  return (
    <div className="min-h-screen district-bg text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-7 px-4 py-7">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-6 space-y-4">
            <div className="glass rounded-3xl px-4 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <Link to="/" className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 via-indigo-500 to-emerald-400 text-white shadow-lg shadow-indigo-500/20">
                  IO
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    InventoryOS
                  </div>
                  <div className="text-xs text-slate-300">
                    {role || "signed in"}
                  </div>
                </div>
              </Link>
            </div>

            <nav className="glass rounded-3xl p-2 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
              {[
                { to: "/", label: "Dashboard", icon: IconDashboard },
                { to: "/products", label: "Products", icon: IconBox },
                { to: "/inventory", label: "Inventory", icon: IconRepeat },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-200 hover:bg-white/5",
                    )
                  }
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 opacity-90" />
                    {item.label}
                  </span>
                </NavLink>
              ))}
              <button
                className="mt-2 w-full rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-200 hover:bg-white/5"
                onClick={() => {
                  clear();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </nav>

            <div className="glass rounded-3xl px-4 py-4 text-xs text-slate-300">
              Tip: Set reorder points on products, then use Inventory to keep
              stock healthy.
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-medium text-slate-300">InventoryOS</div>
              <div className="text-[22px] font-semibold leading-tight text-white">
                Manage products and stock
              </div>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="relative w-full md:w-80">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <Input
                  className="h-10 w-full rounded-2xl border-white/10 bg-white/6 pl-9 text-slate-100 placeholder:text-slate-400 shadow-none focus:border-white/15 focus:ring-white/10"
                  placeholder="Search (coming soon)…"
                />
              </div>
              <Link
                to="/products"
                className="hidden rounded-2xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/15 md:inline-flex"
              >
                Add products
              </Link>
              <button
                className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/15"
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
