import { useEffect } from "react";
import { cn } from "../../lib/cn";
import { useToastStore } from "../../store/toastStore";

export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => remove(t.id), t.ttlMs ?? 3500),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "surface soft-shadow rounded-2xl px-4 py-3 text-sm",
            t.tone === "success" && "border-emerald-200",
            t.tone === "error" && "border-rose-200",
            t.tone === "info" && "border-indigo-200",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900">{t.title}</div>
              {t.message ? (
                <div className="mt-0.5 text-slate-600">{t.message}</div>
              ) : null}
            </div>
            <button
              className="rounded-xl px-2 py-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              onClick={() => remove(t.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
