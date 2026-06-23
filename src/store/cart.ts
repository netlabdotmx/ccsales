"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CustomerInfo, Product, PriceTier } from "@/types";

function getBestTier(product: Product, quantity: number): PriceTier {
  const applicable = product.priceTiers
    .filter((t) => quantity >= t.minQty)
    .sort((a, b) => b.minQty - a.minQty);
  return applicable[0] ?? {
    id: 0,
    minQty: 1,
    maxQty: null,
    price: product.listPrice,
    label: "Precio de lista",
  };
}

interface LastOrder {
  id: number;
  name: string;
  accessToken: string;
  total: number;
  currency: string;
}

interface CartStore {
  items: CartItem[];
  customer: CustomerInfo | null;
  lastOrder: LastOrder | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  setCustomer: (info: CustomerInfo) => void;
  setLastOrder: (order: LastOrder) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customer: null,
      lastOrder: null,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id
          );
          if (existing) {
            const newQty = existing.quantity + quantity;
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: newQty, selectedTier: getBestTier(product, newQty) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                selectedTier: getBestTier(product, quantity),
              },
            ],
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? {
                  ...i,
                  quantity,
                  selectedTier: getBestTier(i.product, quantity),
                }
              : i
          ),
        }));
      },

      setCustomer: (info) => set({ customer: info }),

      setLastOrder: (order) => set({ lastOrder: order }),

      clearCart: () => set({ items: [], customer: null }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + i.quantity * i.selectedTier.price,
          0
        ),
    }),
    { name: "ccs-cart" }
  )
);
