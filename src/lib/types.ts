export type Category =
  | "bangles"
  | "hoop-earrings"
  | "ringlets"
  | "necklaces"
  | "special-packs"
  | "custom";

export type OrderStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";

export type PaymentMethod = "cod" | "bank-transfer";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: Category;
  stock_qty: number;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
};

/** A line item is a snapshot: if a product is later renamed or repriced,
 *  past orders still show what the customer actually bought. */
export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total_price: number;
  payment_method: PaymentMethod;
  payment_reference: string | null;
  status: OrderStatus;
  created_at: string;
};
