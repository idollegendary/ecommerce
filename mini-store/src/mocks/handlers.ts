import { http, HttpResponse } from "msw";

type Product = {
  id: number;
  sku: string;
  name: string;
  shortDescription?: string;
  price: number;
  currency: string;
  images: { url: string; altText?: string }[];
  rating?: number;
  stock?: number;
  isPreorder?: boolean;
  categoryId?: number | null;
};

type CartItem = { productId: number; name: string; unitPrice: number; qty: number };

const categories = [
  { id: 1, name: "Laptops", slug: "laptops" },
  { id: 2, name: "Phones", slug: "phones" },
  { id: 3, name: "Accessories", slug: "accessories" },
];

const products: Product[] = [
  {
    id: 1,
    sku: "LAP-001",
    name: "Ultrabook Pro 14",
    shortDescription: "Powerful and portable 14" + " laptop",
    price: 1299,
    currency: "USD",
    images: [{ url: "/next.svg", altText: "Ultrabook" }],
    rating: 4.6,
    stock: 5,
    isPreorder: false,
    categoryId: 1,
  },
  {
    id: 2,
    sku: "PHN-101",
    name: "Smartphone X",
    shortDescription: "Flagship phone with great camera",
    price: 899,
    currency: "USD",
    images: [{ url: "/next.svg", altText: "Phone" }],
    rating: 4.4,
    stock: 0,
    isPreorder: true,
    categoryId: 2,
  },
  {
    id: 3,
    sku: "ACC-550",
    name: "Wireless Headphones",
    shortDescription: "Noise-cancelling, long battery",
    price: 199,
    currency: "USD",
    images: [{ url: "/next.svg", altText: "Headphones" }],
    rating: 4.2,
    stock: 25,
    isPreorder: false,
    categoryId: 3,
  },
  {
    id: 4,
    sku: "LAP-777",
    name: "Developer Laptop 16",
    shortDescription: "High performance for devs",
    price: 1899,
    currency: "USD",
    images: [{ url: "/next.svg", altText: "Laptop" }],
    rating: 4.8,
    stock: 11,
    isPreorder: false,
    categoryId: 1,
  },
];

let cartItems: CartItem[] = [];

function buildCartDto() {
  const items = cartItems.map((i) => ({
    productId: i.productId,
    name: i.name,
    unitPrice: i.unitPrice.toFixed(2),
    qty: i.qty,
    totalPrice: (i.unitPrice * i.qty).toFixed(2),
  }));
  const subtotalNum = cartItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  return { items, subtotal: subtotalNum.toFixed(2), total: subtotalNum.toFixed(2) };
}

export const handlers = [
  // Auth
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json();
    const username = body.usernameOrEmail ?? "demo";
    const token = "mock-token";
    const userDto = { id: 1, username, email: `${username}@example.com`, roles: ["USER"] };
    return new HttpResponse(JSON.stringify({ token, expiresAt: new Date().toISOString(), userDto }), {
      headers: { "Content-Type": "application/json", "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax` },
    });
  }),
  http.post("/api/auth/register", async ({ request }) => {
    const body = await request.json();
    const username = body.username ?? "user";
    const token = "mock-token";
    const userDto = { id: 2, username, email: body.email ?? `${username}@example.com`, roles: ["USER"] };
    return new HttpResponse(JSON.stringify({ token, expiresAt: new Date().toISOString(), userDto }), {
      headers: { "Content-Type": "application/json", "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax` },
    });
  }),
  http.get("/api/users/me", async () => {
    return HttpResponse.json({ id: 1, username: "demo", email: "demo@example.com", roles: ["USER"] });
  }),

  // Catalog
  http.get("/api/categories", async () => {
    return HttpResponse.json(categories);
  }),

  http.get("/api/products", async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() ?? "";
    const category = url.searchParams.get("category");
    const minPrice = Number(url.searchParams.get("minPrice") ?? "0");
    const maxPrice = Number(url.searchParams.get("maxPrice") ?? Number.MAX_SAFE_INTEGER);
    const minRating = Number(url.searchParams.get("minRating") ?? "0");
    const sort = url.searchParams.get("sort") ?? "";
    const page = Number(url.searchParams.get("page") ?? "0");
    const size = Number(url.searchParams.get("size") ?? "12");

    let filtered = products.filter((p) =>
      (!q || p.name.toLowerCase().includes(q) || p.shortDescription?.toLowerCase().includes(q)) &&
      (!category || String(p.categoryId) === category) &&
      p.price >= minPrice && p.price <= maxPrice &&
      (p.rating ?? 0) >= minRating
    );

    if (sort === "price_asc") filtered = filtered.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") filtered = filtered.sort((a, b) => b.price - a.price);
    if (sort === "rating") filtered = filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const start = page * size;
    const content = filtered.slice(start, start + size).map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      shortDescription: p.shortDescription,
      price: p.price.toFixed(2),
      currency: p.currency,
      images: p.images,
      rating: p.rating,
      stock: p.stock,
      isPreorder: p.isPreorder,
      category: categories.find((c) => c.id === p.categoryId) ? { id: p.categoryId!, name: categories.find((c) => c.id === p.categoryId)!.name } : null,
    }));
    return HttpResponse.json({ content, page, size, totalElements, totalPages });
  }),

  http.get("/api/products/:id", async ({ params }) => {
    const id = Number(params.id);
    const p = products.find((x) => x.id === id);
    if (!p) return new HttpResponse("Not Found", { status: 404 });
    return HttpResponse.json({
      id: p.id,
      sku: p.sku,
      name: p.name,
      shortDescription: p.shortDescription,
      price: p.price.toFixed(2),
      currency: p.currency,
      images: p.images,
      rating: p.rating,
      stock: p.stock,
      isPreorder: p.isPreorder,
      category: categories.find((c) => c.id === p.categoryId) ? { id: p.categoryId!, name: categories.find((c) => c.id === p.categoryId)!.name } : null,
    });
  }),

  // Cart
  http.get("/api/cart", async () => {
    return HttpResponse.json(buildCartDto());
  }),
  http.post("/api/cart/items", async ({ request }) => {
    const body = await request.json();
    const productId = Number(body.productId);
    const qty = Number(body.qty ?? 1);
    const p = products.find((x) => x.id === productId);
    if (!p) return new HttpResponse("Not Found", { status: 404 });
    const existing = cartItems.find((i) => i.productId === productId);
    if (existing) existing.qty += qty; else cartItems.push({ productId, name: p.name, unitPrice: p.price, qty });
    return HttpResponse.json(buildCartDto());
  }),
  http.put("/api/cart/items/:itemId", async ({ params, request }) => {
    const itemId = Number(params.itemId);
    const body = await request.json();
    const qty = Number(body.qty ?? 1);
    cartItems = cartItems.map((i) => (i.productId === itemId ? { ...i, qty } : i));
    return HttpResponse.json(buildCartDto());
  }),
  http.delete("/api/cart/items/:itemId", async ({ params }) => {
    const itemId = Number(params.itemId);
    cartItems = cartItems.filter((i) => i.productId !== itemId);
    return HttpResponse.json(buildCartDto());
  }),

  // Checkout
  http.post("/api/checkout", async () => {
    const total = cartItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    cartItems = [];
    return HttpResponse.json({ orderId: Math.floor(Math.random() * 100000), status: "PAID", paymentUrl: undefined, total });
  }),
];

