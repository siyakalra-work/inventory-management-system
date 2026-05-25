import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { cn } from "../lib/cn";
import Input from "./ui/Input";
import Button from "./ui/Button";
import {
  IconBox,
  IconDashboard,
  IconRepeat,
  IconSearch,
} from "./ui/Icons";
import Badge from "./ui/Badge";

export default function Layout() {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);
  const role = useAuthStore((s) => s.role);

  const navItems = [
    { to: "/", label: "Home", icon: IconDashboard },
    { to: "/products", label: "Products", icon: IconBox },
    { to: "/inventory", label: "Inventory", icon: IconRepeat },
    { to: "/alerts", label: "Alerts", icon: IconAlertNav },
  ];

  return (
    <div className="min-h-screen district-bg text-slate-900">
      <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white/60 backdrop-blur md:block">
          <div className="sticky top-0 flex h-screen flex-col gap-4 px-4 pb-6 pt-6">
            <div className="surface soft-shadow rounded-3xl p-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="brand-gradient grid h-10 w-10 place-items-center rounded-2xl text-white">
                  IO
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-slate-900">
                    InventoryOS
                  </div>
                  <div className="text-xs text-slate-500">
                    {role || "signed in"}
                  </div>
                </div>
              </Link>
            </div>

            <nav className="surface soft-shadow rounded-3xl p-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-50",
                    )
                  }
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.to === "/alerts" ? <Badge tone="rose">!</Badge> : null}
                </NavLink>
              ))}
              <button
                className="mt-2 w-full rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  clear();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </nav>

            <div className="surface soft-shadow rounded-3xl p-4 text-xs text-slate-600">
              Tip: Add reorder points in Products to enable Alerts.
            </div>
          </div>
        </aside>

        <main className="px-4 pb-24 pt-6 md:px-8 md:pb-10">
          <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-3 md:hidden">
              <Link to="/" className="flex items-center gap-3">
                <div className="brand-gradient grid h-10 w-10 place-items-center rounded-2xl text-white">
                  IO
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-slate-900">
                    InventoryOS
                  </div>
                  <div className="text-xs text-slate-500">
                    {role || "signed in"}
                  </div>
                </div>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  clear();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </div>

            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9 sm:w-[420px]"
                placeholder="Search products (coming soon)…"
              />
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="secondary" onClick={() => navigate("/products")}>
                Add product
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  clear();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </div>
          </header>

          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-4 px-4 py-3">
          {[
            { to: "/", label: "Home", icon: IconDashboard },
            { to: "/products", label: "Products", icon: IconBox },
            { to: "/inventory", label: "Inventory", icon: IconRepeat },
            { to: "/alerts", label: "Alerts", icon: IconAlertNav },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition",
                  isActive ? "text-rose-600" : "text-slate-600 hover:bg-slate-50",
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

function IconAlertNav(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10.3 3.7 2.9 16.6A2 2 0 0 0 4.6 19h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
