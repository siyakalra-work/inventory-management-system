import { cn } from "../../lib/cn";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "glass-2 surface rounded-3xl shadow-[0_18px_70px_rgba(0,0,0,0.35)] transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_22px_90px_rgba(0,0,0,0.45)]",
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
        "border-b border-white/10 px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <div
      className={cn("text-sm font-semibold text-white", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}
