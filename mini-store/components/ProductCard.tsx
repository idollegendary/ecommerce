"use client";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/features/cart/queries";

type Props = {
  product: {
    id: number;
    name: string;
    shortDescription?: string;
    price: string;
    currency: string;
    images: { url: string; altText?: string }[];
    rating?: number;
    stock?: number;
    isPreorder?: boolean;
  };
};

export function ProductCard({ product }: Props) {
  const addToCart = useAddToCart();
  const imageUrl = product.images?.[0]?.url ?? "/next.svg";
  const inStock = (product.stock ?? 0) > 0;
  return (
    <Card>
      <CardHeader>
        <Link href={`/product/${product.id}`} className="block">
          <div className="aspect-video bg-muted flex items-center justify-center rounded">
            <img src={imageUrl} alt={product.name} className="h-24" />
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="font-medium line-clamp-1">{product.name}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="font-semibold">{product.price} {product.currency}</div>
          {!inStock && <Badge variant="secondary">Out of stock</Badge>}
          {product.isPreorder && <Badge>Preorder</Badge>}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="secondary">
          <Link href={`/product/${product.id}`}>View</Link>
        </Button>
        <Button
          disabled={addToCart.isPending}
          onClick={() => addToCart.mutate({ productId: product.id, qty: 1 })}
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}

