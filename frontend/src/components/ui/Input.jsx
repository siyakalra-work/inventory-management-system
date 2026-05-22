import { cn } from "../../lib/cn";

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10",
        className,
      )}
      {...props}
    />
  );
}
