export interface WeightOption {
  label: string;
  labelJP: string;
  multiplier: number;
  grams: number;
}

export interface Product {
  id: string;
  name: string;
  nameJP: string;
  category: 'beans' | 'merch';
  subCategory?: 'single-origin' | 'blend' | 'drinkware' | 'gear' | 'lifestyle';
  price: number;
  image: string;
  tag?: string;
  tagJP?: string;
  detail: string;
  detailJP: string;
  description: string;
  descriptionJP: string;
  region?: string;
  regionJP?: string;
  elevation?: string;
  process?: string;
  processJP?: string;
  roast?: string;
  roastJP?: string;
  brewMethod?: string;
  brewMethodJP?: string;
  notes?: string[];
  notesJP?: string[];
  availableGrinds?: string[];
  availableWeights?: WeightOption[];
}

export interface CartItem {
  id: string; // unique composite key: productId + grind + weight
  productId: string;
  name: string;
  nameJP: string;
  category: 'beans' | 'merch';
  price: number;
  quantity: number;
  image: string;
  grind?: string;
  weight?: string;
  weightGrams?: number;
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'shipping' | 'pickup';
  postalCode?: string;
  prefecture?: string;
  address?: string;
  paymentMethod: string;
  note?: string;
  createdAt: string;
}
