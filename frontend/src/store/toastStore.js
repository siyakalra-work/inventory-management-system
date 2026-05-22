import { create } from "zustand";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export const useToastStore = create((set) => ({
  toasts: [],
  push: ({ tone = "info", title, message, ttlMs }) =>
    set((s) => ({
      toasts: [
        { id: uid(), tone, title, message, ttlMs },
        ...s.toasts.slice(0, 2),
      ],
    })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

