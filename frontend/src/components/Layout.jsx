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

export default function Layout() {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);
  const role = useAuthStore((s) => s.role);
  return (
    <div className="min-h-screen district-bg text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        <header className="mb-5 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="brand-gradient grid h-10 w-10 place-items-center rounded-2xl text-white">
              IO
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">
                InventoryOS
              </div>
              <div className="text-xs text-slate-500">{role || "signed in"}</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/products")}
            >
              Add
            </Button>
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
        </header>

        <div className="mb-6">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search products (coming soon)…" />
          </div>
        </div>

        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-3 px-4 py-3">
          {[
            { to: "/", label: "Home", icon: IconDashboard },
            { to: "/products", label: "Products", icon: IconBox },
            { to: "/inventory", label: "Inventory", icon: IconRepeat },
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
