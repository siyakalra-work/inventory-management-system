import { cn } from "../../lib/cn";

export default function Badge({ tone = "slate", className, ...props }) {
  const tones = {
    slate: "bg-white/8 text-slate-100 ring-white/12",
    indigo: "bg-indigo-500/15 text-indigo-100 ring-indigo-300/20",
    amber: "bg-amber-500/15 text-amber-100 ring-amber-300/20",
    rose: "bg-rose-500/15 text-rose-100 ring-rose-300/20",
    emerald: "bg-emerald-500/15 text-emerald-100 ring-emerald-300/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
