"use client";
import { create } from "zustand";

type UiState = {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
}));

