import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, me } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto max-w-md rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Login</h1>
      {error && <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</div>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            const tokens = await login(email, password);
            setSession({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, role: null, tenantId: null });
            const profile = await me();
            setSession({
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              role: profile.role,
              tenantId: profile.tenant_id,
            });
            navigate("/");
          } catch (err) {
            setError(err?.response?.data?.detail || "Login failed");
          } finally {
            setBusy(false);
          }
        }}
        className="space-y-3"
      >
        <input className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={busy} className="w-full rounded bg-blue-600 px-3 py-2 font-medium text-white disabled:opacity-60">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="mt-4 text-sm">
        No account? <Link className="underline" to="/register">Register</Link>
      </div>
    </div>
  );
}

