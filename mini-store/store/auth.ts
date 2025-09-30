"use client";
import { create } from "zustand";

type AuthState = {
  token: string | null;
  user: { id: number; username: string; email: string; roles: string[] } | null;
  login: (token: string, user: AuthState["user"]) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
  login: (token, user) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));

