"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { OrderRequestDto, OrderResponseDto } from "@/types/dto";

export function useCheckout() {
  return useMutation({
    mutationFn: async (payload: OrderRequestDto) => {
      const { data } = await api.post<OrderResponseDto>(`/api/checkout`, payload);
      return data;
    },
  });
}

