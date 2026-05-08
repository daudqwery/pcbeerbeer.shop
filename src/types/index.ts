export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  alcohol: number; // Used as "version number" or rating for software
  volume: string; // Used as "license type" for software, or "set type" for hardware
  origin: string;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  snapToken?: string;
  createdAt: string;
}

export interface AdminState {
  isLoggedIn: boolean;
  username: string;
}

export type PageView = 'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'admin-login' | 'admin-dashboard' | 'admin-products' | 'admin-orders' | 'admin-add-product' | 'admin-edit-product' | 'terms' | 'privacy' | 'faq' | 'refund';

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  enabled: boolean;
  mode: 'sandbox' | 'production';
  // Common fields
  merchantId?: string;
  apiKey?: string;
  secretKey?: string;
  serverKey?: string;
  clientKey?: string;
  publicKey?: string;
  privateKey?: string;
  // Webhook
  webhookUrl?: string;
  callbackUrl?: string;
  // Custom fields
  customFields?: Record<string, string>;
  // Metadata
  logo: string;
  description: string;
  supportedMethods: string[];
  fees?: string;
  lastUpdated?: string;
}

export interface PaymentGatewaySettings {
  gateways: Record<string, PaymentGatewayConfig>;
  defaultGateway: string;
}
