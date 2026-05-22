import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, me } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToastStore((s) => s.push);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 app-gradient">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm backdrop-blur">
              <div className="inline-flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white">
                  IO
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    InventoryOS
                  </div>
                  <div className="text-xs text-slate-600">
                    Inventory, without the chaos
                  </div>
                </div>
              </div>
              <div className="mt-6 text-sm text-slate-700">
                Sign in to manage products, log stock movements, and keep
                reorder points under control.
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                  Fast search
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                  Clean tables
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                  Stock history
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                  Alerts ready
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <div className="mt-1 text-sm text-slate-600">
                Sign in to your tenant.
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
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
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={busy}
                >
                  {busy ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="mt-5 text-sm text-slate-600">
                No account?{" "}
                <Link className="font-semibold text-indigo-700" to="/register">
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

