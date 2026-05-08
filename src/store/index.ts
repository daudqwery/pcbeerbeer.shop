import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Order, AdminState, Product, PaymentGatewayConfig } from '../types';
import { defaultPaymentGateways } from '../data/paymentGateways';

interface AppState {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;

  // Admin
  admin: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Current page
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  // Payment Gateways
  paymentGateways: Record<string, PaymentGatewayConfig>;
  defaultGateway: string;
  updatePaymentGateway: (id: string, config: Partial<PaymentGatewayConfig>) => void;
  togglePaymentGateway: (id: string) => void;
  setDefaultGateway: (id: string) => void;
  resetPaymentGateway: (id: string) => void;
  addCustomPaymentGateway: (gateway: PaymentGatewayConfig) => void;
  deleteCustomPaymentGateway: (id: string) => void;
  customGatewayIds: string[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) => {
        const { cart } = get();
        const existing = cart.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            cart: cart.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((i) => i.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      // Orders
      orders: [],
      addOrder: (order) => {
        set({ orders: [...get().orders, order] });
      },
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        });
      },
      updatePaymentStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: status } : o
          ),
        });
      },

      // Admin
      admin: { isLoggedIn: false, username: '' },
      login: (username, password) => {
        if (username === 'admin' && password === 'admin123') {
          set({ admin: { isLoggedIn: true, username } });
          return true;
        }
        return false;
      },
      logout: () => set({ admin: { isLoggedIn: false, username: '' } }),

      // Products
      products: [],
      addProduct: (product) => {
        set({ products: [...get().products, product] });
      },
      updateProduct: (product) => {
        set({
          products: get().products.map((p) =>
            p.id === product.id ? product : p
          ),
        });
      },
      deleteProduct: (productId) => {
        set({ products: get().products.filter((p) => p.id !== productId) });
      },

      // Page
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      selectedProductId: null,
      setSelectedProductId: (id) => set({ selectedProductId: id }),

      // Payment Gateways
      paymentGateways: defaultPaymentGateways,
      defaultGateway: 'midtrans',
      updatePaymentGateway: (id, config) => {
        const gateways = get().paymentGateways;
        if (!gateways[id]) return;
        set({
          paymentGateways: {
            ...gateways,
            [id]: {
              ...gateways[id],
              ...config,
              lastUpdated: new Date().toISOString(),
            },
          },
        });
      },
      togglePaymentGateway: (id) => {
        const gateways = get().paymentGateways;
        if (!gateways[id]) return;
        set({
          paymentGateways: {
            ...gateways,
            [id]: {
              ...gateways[id],
              enabled: !gateways[id].enabled,
              lastUpdated: new Date().toISOString(),
            },
          },
        });
      },
      setDefaultGateway: (id) => set({ defaultGateway: id }),
      resetPaymentGateway: (id) => {
        const gateways = get().paymentGateways;
        if (!gateways[id] || !defaultPaymentGateways[id]) return;
        set({
          paymentGateways: {
            ...gateways,
            [id]: { ...defaultPaymentGateways[id] },
          },
        });
      },
      customGatewayIds: [],
      addCustomPaymentGateway: (gateway) => {
        const gateways = get().paymentGateways;
        const customIds = get().customGatewayIds;
        if (gateways[gateway.id]) return; // ID already exists
        set({
          paymentGateways: {
            ...gateways,
            [gateway.id]: {
              ...gateway,
              lastUpdated: new Date().toISOString(),
            },
          },
          customGatewayIds: [...customIds, gateway.id],
        });
      },
      deleteCustomPaymentGateway: (id) => {
        const gateways = get().paymentGateways;
        const customIds = get().customGatewayIds;
        if (!customIds.includes(id)) return; // Cannot delete built-in gateway
        const rest = Object.fromEntries(
          Object.entries(gateways).filter(([key]) => key !== id)
        );
        const isDefault = get().defaultGateway === id;
        set({
          paymentGateways: rest,
          customGatewayIds: customIds.filter(cid => cid !== id),
          ...(isDefault ? { defaultGateway: 'midtrans' } : {}),
        });
      },
    }),
    {
      name: 'pcbeer-storage',
    }
  )
);
