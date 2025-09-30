"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CartDto } from "@/types/dto";

export function useCart() {
  const qc = useQueryClient();
  return {
    refresh: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  };
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { productId: number; qty: number }) => {
      const { data } = await api.post<CartDto>(`/api/cart/items`, payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, qty }: { itemId: string | number; qty: number }) => {
      const { data } = await api.put<CartDto>(`/api/cart/items/${itemId}`, { qty });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId }: { itemId: string | number }) => {
      const { data } = await api.delete<CartDto>(`/api/cart/items/${itemId}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

