"use client";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function Header() {
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get(`/api/cart`);
      return data as { items: { qty: number }[] };
    },
  });
  const count = data?.items?.reduce((s, i) => s + i.qty, 0) ?? 0;
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">mini-store</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/catalog">Catalog</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" asChild>
            <Link href="/cart" aria-label="Cart" className="relative">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <Button size="icon" variant="ghost" asChild>
            <Link href="/auth/login" aria-label="Account">
              <User className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

