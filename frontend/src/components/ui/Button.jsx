import { cn } from "../../lib/cn";

export default function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  ...props
}) {
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600",
    secondary:
      "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-slate-300",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-300",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

