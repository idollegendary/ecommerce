import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default function ProductDetailPage({ params }: Props) {
  const { id } = params;
  if (!id) return notFound();
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Product #{id}</h1>
      <p className="text-muted-foreground">Product details, stock and preorder flag will be shown.</p>
    </div>
  );
}

