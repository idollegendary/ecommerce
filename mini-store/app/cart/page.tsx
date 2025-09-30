"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRemoveCartItem, useUpdateCartItem } from "@/features/cart/queries";

export default function CartPage() {
  const { data, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get(`/api/cart`);
      return data as { items: { productId: number; name: string; unitPrice: string; qty: number; totalPrice: string }[]; subtotal: string; total: string };
    },
  });
  const upd = useUpdateCartItem();
  const del = useRemoveCartItem();

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Your cart</h1>
      <div className="space-y-3">
        {data?.items?.length ? (
          data.items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-muted-foreground">{i.unitPrice} x {i.qty} = {i.totalPrice}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={async () => { await upd.mutateAsync({ itemId: i.productId, qty: i.qty + 1 }); refetch(); }}>+</Button>
                <Button variant="secondary" onClick={async () => { await upd.mutateAsync({ itemId: i.productId, qty: Math.max(1, i.qty - 1) }); refetch(); }}>-</Button>
                <Button variant="destructive" onClick={async () => { await del.mutateAsync({ itemId: i.productId }); refetch(); }}>Remove</Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">Your cart is empty.</div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg">Subtotal: <span className="font-semibold">{data?.subtotal ?? "0.00"}</span></div>
        <Button asChild>
          <a href="/checkout">Checkout</a>
        </Button>
      </div>
    </div>
  );
}

