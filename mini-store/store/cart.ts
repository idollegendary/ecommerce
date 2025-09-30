"use client";
import { create } from "zustand";

export type CartItem = {
  productId: number;
  name: string;
  unitPrice: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

const storageKey = "mini_cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {}
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),
  addItem: (item) => {
    const existing = get().items.find((i) => i.productId === item.productId);
    let items: CartItem[];
    if (existing) {
      items = get().items.map((i) => (i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i));
    } else {
      items = [...get().items, item];
    }
    saveCart(items);
    set({ items });
  },
  updateQty: (productId, qty) => {
    const items = get().items.map((i) => (i.productId === productId ? { ...i, qty } : i));
    saveCart(items);
    set({ items });
  },
  removeItem: (productId) => {
    const items = get().items.filter((i) => i.productId !== productId);
    saveCart(items);
    set({ items });
  },
  clear: () => {
    saveCart([]);
    set({ items: [] });
  },
}));

