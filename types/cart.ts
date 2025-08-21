export interface CartItem {
  id: string;
  serrureId: string;
  codeArticle: string;
  designation?: string;
  typeSerrureNom?: string;
  photoUrl?: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  id?: string;
  cartId?: string;
  userId?: string;
  items: CartItem[];
  totalItems: number;
  updatedAt: Date;
  createdAt?: Date;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  totalItems: number;
  orderDate: Date;
  notes?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface CartStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}
