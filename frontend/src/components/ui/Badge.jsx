import { cn } from "../../lib/cn";

export default function Badge({ tone = "slate", className, ...props }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    amber: "bg-amber-50 text-amber-800 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
