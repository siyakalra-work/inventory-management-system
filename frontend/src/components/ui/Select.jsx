import { cn } from "../../lib/cn";

export default function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-indigo-300/30 focus:ring-4 focus:ring-indigo-500/15",
        className,
      )}
      {...props}
    />
  );
}
