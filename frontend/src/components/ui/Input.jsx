import { cn } from "../../lib/cn";

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-white/15 focus:ring-4 focus:ring-indigo-500/15",
        className,
      )}
      {...props}
    />
  );
}
