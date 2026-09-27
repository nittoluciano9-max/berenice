"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  addLine,
  changeLineVariant,
  getAhorro,
  getItemCount,
  getSubtotal,
  getTotal,
  updateLineQuantity,
} from "@/lib/cart";
import type { AddResult, CartItem, VariantPatch } from "@/types/cart";

const STORAGE_KEY = "berenice-cart";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  /** Mensaje efímero del drawer (p. ej. tope de stock); no se persiste. */
  aviso: string | null;
  /** El tope (`max`) lo calcula quien llama: el store no conoce el catálogo. */
  addItem: (item: CartItem, max: number) => AddResult;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number, max: number) => void;
  changeVariant: (id: string, patch: VariantPatch, max: number) => void;
  clear: () => void;
  open: (aviso?: string) => void;
  close: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      aviso: null,
      addItem: (item, max) => {
        const { items, result } = addLine(get().items, item, max);
        set({ items });
        return result;
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, cantidad, max) =>
        set({ items: updateLineQuantity(get().items, id, cantidad, max) }),
      changeVariant: (id, patch, max) =>
        set({ items: changeLineVariant(get().items, id, patch, max) }),
      clear: () => set({ items: [] }),
      open: (aviso) => set({ isOpen: true, aviso: aviso ?? null }),
      close: () => set({ isOpen: false, aviso: null }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Server y primer render del cliente arrancan vacíos (sin mismatch); useCartHydration
      // carga lo guardado recién después de montar.
      skipHydration: true,
      migrate: (persisted) => persisted as { items: CartItem[] },
    },
  ),
);

// Selectores derivados: no son estado, se calculan desde `items`.
export const selectItemCount = (s: CartState) => getItemCount(s.items);
export const selectSubtotal = (s: CartState) => getSubtotal(s.items);
export const selectAhorro = (s: CartState) => getAhorro(s.items);
export const selectTotal = (s: CartState) => getTotal(s.items);

/** Se monta una sola vez (en CartDrawer). Rehidrata y sincroniza entre pestañas. */
export function useCartHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) void useCartStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}
