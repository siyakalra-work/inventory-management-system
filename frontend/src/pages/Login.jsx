import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, me } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { IconTicket } from "../components/ui/Icons";

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToastStore((s) => s.push);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen district-bg text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="glass rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <div className="inline-flex items-center gap-3">
                <div className="brand-gradient grid h-11 w-11 place-items-center rounded-2xl text-white">
                  IO
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    InventoryOS
                  </div>
                  <div className="text-xs text-slate-300">
                    Inventory, without the chaos
                  </div>
                </div>
              </div>
              <div className="mt-6 text-sm text-slate-200">
                Sign in to manage products, log stock movements, and keep
                reorder points under control.
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  Fast search
                </div>
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  Clean tables
                </div>
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  Stock history
                </div>
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  Alerts ready
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <div className="mt-1 text-sm text-slate-300">
                Sign in to your tenant.
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
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
                  <div className="mb-1 text-xs font-semibold text-slate-300">
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
                  <div className="mb-1 text-xs font-semibold text-slate-300">
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
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={busy}
                >
                  <IconTicket className="h-4 w-4" />
                  {busy ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="mt-5 text-sm text-slate-300">
                No account?{" "}
                <Link className="font-semibold text-white" to="/register">
                  Create a tenant
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
