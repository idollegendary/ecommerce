"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AuthRequest, AuthResponse, RegisterRequest } from "@/types/dto";
import { useAuthStore } from "@/store/auth";

export function useLogin() {
  const loginStore = useAuthStore();
  return useMutation({
    mutationFn: async (payload: AuthRequest) => {
      const { data } = await api.post<AuthResponse>(`/api/auth/login`, payload);
      return data;
    },
    onSuccess: (data) => {
      loginStore.login(data.token, data.userDto);
    },
  });
}

export function useRegister() {
  const loginStore = useAuthStore();
  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const { data } = await api.post<AuthResponse>(`/api/auth/register`, payload);
      return data;
    },
    onSuccess: (data) => {
      loginStore.login(data.token, data.userDto);
    },
  });
}

