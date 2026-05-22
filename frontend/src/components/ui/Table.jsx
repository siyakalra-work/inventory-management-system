import { cn } from "../../lib/cn";

export function Table({ className, ...props }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full text-left text-sm" {...props} />
    </div>
  );
}

export function THead({ className, ...props }) {
  return (
    <thead
      className={cn(
        "bg-slate-50 text-xs font-semibold text-slate-600",
        className,
      )}
      {...props}
    />
  );
}

export function TH({ className, ...props }) {
  return (
    <th
      className={cn("px-5 py-3 tracking-wide", className)}
      {...props}
    />
  );
}

export function TD({ className, ...props }) {
  return (
    <td
      className={cn("px-5 py-3 text-slate-800", className)}
      {...props}
    />
  );
}
