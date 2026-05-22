import { create } from "zustand";

const storageKey = "inventoryos_auth";

function loadInitial() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

export const useAuthStore = create((set, get) => ({
  accessToken: loadInitial().accessToken || null,
  refreshToken: loadInitial().refreshToken || null,
  role: loadInitial().role || null,
  tenantId: loadInitial().tenantId || null,
  setSession: ({ accessToken, refreshToken, role, tenantId }) => {
    const next = { accessToken, refreshToken, role, tenantId };
    localStorage.setItem(storageKey, JSON.stringify(next));
    set(next);
  },
  clear: () => {
    localStorage.removeItem(storageKey);
    set({ accessToken: null, refreshToken: null, role: null, tenantId: null });
  },
}));

