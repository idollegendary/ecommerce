"use client";
import Link from "next/link";
import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
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
            <Link href="/cart" aria-label="Cart">
              <ShoppingCart className="size-5" />
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

