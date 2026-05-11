import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Order, AdminState, Product, PaymentGatewayConfig } from '../types';
import { defaultPaymentGateways } from '../data/paymentGateways';

const API_BASE = './api.php';

function cacheBustUrl(url: string): string {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}_t=${Date.now()}`;
}

async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  return fetch(cacheBustUrl(url), {
    ...options,
    headers: {
      'Cache-Control': 'no-cache, no-store',
      'Pragma': 'no-cache',
      ...(options?.headers ?? {}),
    },
  });
}

// ─── API helpers ───

async function apiFetchAllSettings(): Promise<Record<string, string>> {
  try {
    const res = await apiFetch(`${API_BASE}?action=get_all_settings`);
    if (!res.ok) return {};
    const data = await res.json();
    return data?.settings ?? {};
  } catch {
    return {};
  }
}

async function apiFetchAllOrders(): Promise<Order[]> {
  try {
    const res = await apiFetch(`${API_BASE}?action=get_all_orders`);
    if (!res.ok) return [];
    const data = await res.json();
    return data?.orders ?? [];
  } catch {
    return [];
  }
}

async function apiSaveKey(key_name: string, key_value: string): Promise<boolean> {
  try {
    const res = await apiFetch(`${API_BASE}?action=save_key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key_name, key_value }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function apiSaveOrder(order: Order): Promise<boolean> {
  try {
    const res = await apiFetch(`${API_BASE}?action=save_order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: order.id,
        customer_name: order.customerName,
        details: order,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function apiUpdateOrderStatus(
  orderId: string,
  updates: { status?: string; paymentStatus?: string }
): Promise<boolean> {
  try {
    const res = await apiFetch(`${API_BASE}?action=update_order_status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, ...updates }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

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

  // API initialisation & sync
  initialize: () => Promise<void>;
  refreshFromServer: () => Promise<void>;
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
      addOrder: async (order) => {
        set({ orders: [...get().orders, order] });
        await apiSaveOrder(order);
      },
      updateOrderStatus: async (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        });
        await apiUpdateOrderStatus(orderId, { status });
      },
      updatePaymentStatus: async (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: status } : o
          ),
        });
        await apiUpdateOrderStatus(orderId, { paymentStatus: status });
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
      updatePaymentGateway: async (id, config) => {
        const gateways = get().paymentGateways;
        if (!gateways[id]) return;
        const updated: PaymentGatewayConfig = {
          ...gateways[id],
          ...config,
          lastUpdated: new Date().toISOString(),
        };
        set({
          paymentGateways: {
            ...gateways,
            [id]: updated,
          },
        });
        // Persist each sensitive key field to server and wait for completion
        const keyFields: (keyof PaymentGatewayConfig)[] = [
          'apiKey', 'secretKey', 'serverKey', 'clientKey', 'publicKey', 'privateKey',
        ];
        const savePromises: Promise<boolean>[] = [];
        keyFields.forEach((field) => {
          const value = updated[field];
          if (typeof value === 'string' && value.trim() !== '') {
            savePromises.push(apiSaveKey(`${id}_${field}`, value));
          }
        });
        // Also persist enabled/mode/merchantId
        if (updated.enabled !== undefined) {
          savePromises.push(apiSaveKey(`${id}_enabled`, String(updated.enabled)));
        }
        if (updated.mode) {
          savePromises.push(apiSaveKey(`${id}_mode`, updated.mode));
        }
        if (updated.merchantId) {
          savePromises.push(apiSaveKey(`${id}_merchantId`, updated.merchantId));
        }
        await Promise.all(savePromises);
      },
      togglePaymentGateway: async (id) => {
        const gateways = get().paymentGateways;
        if (!gateways[id]) return;
        const newEnabled = !gateways[id].enabled;
        set({
          paymentGateways: {
            ...gateways,
            [id]: {
              ...gateways[id],
              enabled: newEnabled,
              lastUpdated: new Date().toISOString(),
            },
          },
        });
        await apiSaveKey(`${id}_enabled`, String(newEnabled));
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
        if (gateways[gateway.id]) return;
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
        if (!customIds.includes(id)) return;
        const rest = Object.fromEntries(
          Object.entries(gateways).filter(([key]) => key !== id)
        );
        const isDefault = get().defaultGateway === id;
        set({
          paymentGateways: rest,
          customGatewayIds: customIds.filter((cid) => cid !== id),
          ...(isDefault ? { defaultGateway: 'midtrans' } : {}),
        });
      },

      // Fetch all data from server and merge into state
      refreshFromServer: async () => {
        const [settings, serverOrders] = await Promise.all([
          apiFetchAllSettings(),
          apiFetchAllOrders(),
        ]);

        // Merge server orders with local orders (server is source of truth)
        if (serverOrders.length > 0) {
          const localOrders = get().orders;
          const serverOrderIds = new Set(serverOrders.map((o) => o.id));
          // Keep local orders not yet on server, then append server orders
          const localOnly = localOrders.filter((o) => !serverOrderIds.has(o.id));
          set({ orders: [...serverOrders, ...localOnly] });
        }

        // Merge settings into payment gateways
        if (Object.keys(settings).length > 0) {
          const gateways = { ...get().paymentGateways };
          const keyFields = ['apiKey', 'secretKey', 'serverKey', 'clientKey', 'publicKey', 'privateKey', 'merchantId', 'enabled', 'mode'] as const;

          for (const gatewayId of Object.keys(gateways)) {
            let updated = false;
            for (const field of keyFields) {
              const settingKey = `${gatewayId}_${field}`;
              if (settings[settingKey] !== undefined && settings[settingKey] !== null) {
                if (field === 'enabled') {
                  (gateways[gatewayId] as any)[field] = settings[settingKey] === 'true';
                } else {
                  (gateways[gatewayId] as any)[field] = settings[settingKey];
                }
                updated = true;
              }
            }
            if (updated) {
              gateways[gatewayId] = { ...gateways[gatewayId] };
            }
          }
          set({ paymentGateways: gateways });
        }
      },

      // Initialize: fetch both settings and orders from server
      initialize: async () => {
        await get().refreshFromServer();
      },
    }),
    {
      name: 'pcbeer-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialize();
        }
      },
    }
  )
);
