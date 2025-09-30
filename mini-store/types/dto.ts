// Auth
export type RegisterRequest = { username: string; email: string; password: string };
export type AuthRequest = { usernameOrEmail: string; password: string };
export type UserDto = { id: number; username: string; email: string; roles: string[] };
export type AuthResponse = { token: string; expiresAt: string; userDto: UserDto };

// Catalog
export type ProductDto = {
  id: number;
  sku: string;
  name: string;
  shortDescription?: string;
  price: string;
  currency: string;
  images: { url: string; altText?: string }[];
  rating?: number;
  stock?: number;
  isPreorder?: boolean;
  category?: { id: number; name: string } | null;
};

export type ProductFilterParams = {
  q?: string;
  category?: number | string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "popular";
  page?: number;
  size?: number;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

// Cart
export type CartItemDto = { productId: number; name: string; unitPrice: string; qty: number; totalPrice: string };
export type CartDto = { items: CartItemDto[]; subtotal: string; total: string };

// Orders
export type OrderRequestDto = {
  cartId?: string;
  items?: { productId: number; quantity: number }[];
  shippingAddressId?: number;
  paymentMethodId?: number;
  couponCode?: string;
};
export type OrderResponseDto = { orderId: number; status: string; paymentUrl?: string };

// Review
export type ReviewDto = { productId: number; rating: number; title?: string; body?: string };

