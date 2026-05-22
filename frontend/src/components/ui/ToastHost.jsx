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
            "glass-2 rounded-2xl px-4 py-3 text-sm shadow-[0_20px_80px_rgba(0,0,0,0.35)]",
            t.tone === "success" && "ring-1 ring-emerald-300/20",
            t.tone === "error" && "ring-1 ring-rose-300/20",
            t.tone === "info" && "ring-1 ring-indigo-300/20",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-white">{t.title}</div>
              {t.message ? (
                <div className="mt-0.5 text-slate-300">{t.message}</div>
              ) : null}
            </div>
            <button
              className="rounded-xl px-2 py-1 text-slate-300 hover:bg-white/5 hover:text-white"
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
