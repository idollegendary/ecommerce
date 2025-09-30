"use client";
import { useProduct } from "@/features/catalog/queries";
import { useAddToCart } from "@/features/cart/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { params: { id: string } };

export default function ProductDetailPage({ params }: Props) {
  const { id } = params;
  const { data: p } = useProduct(id);
  const addToCart = useAddToCart();
  const inStock = (p?.stock ?? 0) > 0;
  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-muted aspect-square rounded flex items-center justify-center">
        <img src={p?.images?.[0]?.url ?? "/next.svg"} alt={p?.name ?? "Product"} className="h-40" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-2">{p?.name}</h1>
        <div className="text-muted-foreground mb-4">{p?.shortDescription}</div>
        <div className="flex items-center gap-2 mb-4">
          <div className="text-xl font-bold">{p?.price} {p?.currency}</div>
          {!inStock && <Badge variant="secondary">Out of stock</Badge>}
          {p?.isPreorder && <Badge>Preorder</Badge>}
        </div>
        <Button onClick={() => addToCart.mutate({ productId: Number(id), qty: 1 })}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}

