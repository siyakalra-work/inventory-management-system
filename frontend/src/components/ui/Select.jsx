import { cn } from "../../lib/cn";

export default function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
        className,
      )}
      {...props}
    />
  );
}

