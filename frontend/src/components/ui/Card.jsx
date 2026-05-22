import { cn } from "../../lib/cn";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "surface soft-shadow rounded-3xl",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "border-b border-slate-200 px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <div
      className={cn("text-sm font-semibold text-slate-900", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}
