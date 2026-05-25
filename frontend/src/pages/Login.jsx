import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, me } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { IconTicket } from "../components/ui/Icons";
import { cn } from "../lib/cn";

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToastStore((s) => s.push);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen district-bg text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-2 lg:gap-10">
        <div className="order-2 lg:order-1">
          <div className="perspective-1200">
            <div className="surface soft-shadow tilt-3d shine rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="brand-gradient grid h-11 w-11 place-items-center rounded-2xl text-white">
                  IO
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-slate-900">
                    InventoryOS
                  </div>
                  <div className="text-xs text-slate-500">
                    Inventory, without the chaos
                  </div>
                </div>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login">
                  <button className={cn("rounded-2xl px-4 py-2 text-sm font-semibold", "bg-slate-900 text-white")}>
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className={cn("rounded-2xl px-4 py-2 text-sm font-semibold", "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50")}>
                    Sign up
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { title: "Poster cards", desc: "Beautiful product cards, fast scanning." },
                { title: "Low stock alerts", desc: "Reorder points → alerts page." },
                { title: "Audit trail", desc: "Every movement is logged." },
                { title: "Mobile-first", desc: "Bottom nav + responsive UI." },
              ].map((x) => (
                <div key={x.title} className="perspective-1200">
                  <div className="tilt-3d rounded-3xl bg-slate-50 p-5">
                  <div className="text-sm font-semibold text-slate-900">{x.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{x.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">History</div>
                <div className="text-xs text-slate-500">Scroll</div>
              </div>
              <div className="mt-3 max-h-[320px] space-y-3 overflow-auto pr-2">
                {[
                  { t: "Today", d: "Alerts page + sidebar navigation added." },
                  { t: "Last week", d: "Poster-style product cards shipped." },
                  { t: "Earlier", d: "Inventory transactions + stock snapshot." },
                  { t: "Foundation", d: "Auth, tenants, and product catalog built." },
                ].map((x) => (
                  <div key={x.t} className="perspective-1200">
                    <div className="surface tilt-3d rounded-3xl p-4">
                    <div className="text-xs font-semibold text-slate-500">{x.t}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{x.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:flex lg:items-center">
          <div className="perspective-1200 w-full">
            <Card className="tilt-3d shine w-full">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <div className="mt-1 text-sm text-slate-600">
                Sign in to your tenant workspace.
              </div>
              <div className="mt-4 flex items-center gap-2 sm:hidden">
                <Link to="/login" className="flex-1">
                  <Button className="w-full" variant="secondary">
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true);
                  setError(null);
                  try {
                    const tokens = await login(email, password);
                    setSession({
                      accessToken: tokens.access_token,
                      refreshToken: tokens.refresh_token,
                      role: null,
                      tenantId: null,
                    });
                    const profile = await me();
                    setSession({
                      accessToken: tokens.access_token,
                      refreshToken: tokens.refresh_token,
                      role: profile.role,
                      tenantId: profile.tenant_id,
                    });
                    toast({
                      tone: "success",
                      title: "Signed in",
                      message: `Role: ${profile.role}`,
                    });
                    navigate("/");
                  } catch (err) {
                    setError(err?.response?.data?.detail || "Login failed");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">
                    Email
                  </div>
                  <Input
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">
                    Password
                  </div>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={busy}>
                  <IconTicket className="h-4 w-4" />
                  {busy ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="mt-5 text-sm text-slate-600">
                No account?{" "}
                <Link className="font-semibold text-slate-900" to="/register">
                  Create a tenant
                </Link>
              </div>
            </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
