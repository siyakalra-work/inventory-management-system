import { cn } from "../../lib/cn";

export default function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10",
        className,
      )}
      {...props}
    />
  );
}
