import { cn } from "../../lib/cn";

export default function KpiCard({
  title,
  value,
  subtitle,
  tone = "slate",
  icon,
  loading,
}) {
  const tones = {
    slate: "ring-slate-200",
    indigo: "ring-indigo-200",
    rose: "ring-rose-200",
    amber: "ring-amber-200",
    emerald: "ring-emerald-200",
  };

  return (
    <div className={cn("surface soft-shadow rounded-3xl p-5 ring-1", tones[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-600">{title}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {loading ? <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-100" /> : value}
          </div>
          {subtitle ? (
            <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
          ) : null}
        </div>

        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200",
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

