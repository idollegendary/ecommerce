"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PageResponse, ProductDto, ProductFilterParams } from "@/types/dto";

export function useProducts(params: ProductFilterParams) {
  const search = new URLSearchParams(
    Object.entries(params).reduce((acc, [k, v]) => {
      if (v === undefined || v === null || v === "") return acc;
      acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  );
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { data } = await api.get<PageResponse<ProductDto>>(`/api/products?${search.toString()}`);
      return data;
    },
  });
}

export function useProduct(id: string | number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get<ProductDto>(`/api/products/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

