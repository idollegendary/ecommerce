"use client";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/features/catalog/queries";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

export default function CatalogPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const page = Number(sp.get("page") ?? "0");
  const size = Number(sp.get("size") ?? "12");
  const q = sp.get("q") ?? "";
  const sort = sp.get("sort") ?? "";
  const params = useMemo(() => ({ page, size, q, sort: sort || undefined }), [page, size, q, sort]);
  const { data } = useProducts(params);

  function update(upd: Record<string, string | number | undefined>) {
    const next = new URLSearchParams(sp.toString());
    Object.entries(upd).forEach(([k, v]) => {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    router.push(`/catalog?${next.toString()}`);
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-2 mb-2">
          <Input placeholder="Search products" value={q} onChange={(e) => update({ q: e.target.value, page: 0 })} />
          <Select value={sort} onValueChange={(v) => update({ sort: v, page: 0 })}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Default</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data?.content?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: data?.totalPages ?? 1 }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={i === page} onClick={() => update({ page: i })}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

