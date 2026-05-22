import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { me, register } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function Register() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToastStore((s) => s.push);

  const [tenantName, setTenantName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 app-gradient">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Create your tenant</CardTitle>
              <div className="mt-1 text-sm text-slate-600">
                You’ll get a retailer admin account for this tenant.
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
                    const tokens = await register({
                      tenant_name: tenantName,
                      tenant_slug: tenantSlug,
                      email,
                      full_name: fullName || null,
                      password,
                    });
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
                      title: "Tenant created",
                      message: "You’re signed in as retailer_admin",
                    });
                    navigate("/");
                  } catch (err) {
                    setError(err?.response?.data?.detail || "Registration failed");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs font-semibold text-slate-600">
                      Tenant name
                    </div>
                    <Input
                      placeholder="Sigmoid Retail"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold text-slate-600">
                      Tenant slug
                    </div>
                    <Input
                      placeholder="sigmoid-retail"
                      value={tenantSlug}
                      onChange={(e) =>
                        setTenantSlug(
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        )
                      }
                    />
                    <div className="mt-1 text-xs text-slate-500">
                      Lowercase letters, numbers, hyphens.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs font-semibold text-slate-600">
                      Admin email
                    </div>
                    <Input
                      placeholder="admin@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold text-slate-600">
                      Full name (optional)
                    </div>
                    <Input
                      placeholder="Siya Kalra"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">
                    Password
                  </div>
                  <Input
                    placeholder="Min 8 characters (max 72)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={busy}>
                  {busy ? "Creating..." : "Create tenant"}
                </Button>
              </form>

              <div className="mt-5 text-sm text-slate-600">
                Already have an account?{" "}
                <Link className="font-semibold text-indigo-700" to="/login">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

