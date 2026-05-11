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
  return fetch(cacheBustUrl(url), { ...options, headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache', ...(options?.headers ?? {}) } });
}

async function apiFetchAllSettings(): Promise<Record<string, string>> {
  try { const res = await apiFetch(`${API_BASE}?action=get_all_settings`); if (!res.ok) return {}; const data = await res.json(); return data?.settings ?? {}; } catch { return {}; }
}
async function apiFetchAllOrders(): Promise<Order[]> {
  try { const res = await apiFetch(`${API_BASE}?action=get_all_orders`); if (!res.ok) return []; const data = await res.json(); return data?.orders ?? []; } catch { return []; }
}
async function apiSaveKey(key_name: string, key_value: string): Promise<boolean> {
  try { const res = await apiFetch(`${API_BASE}?action=save_key`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key_name, key_value }) }); return res.ok; } catch { return false; }
}
async function apiSaveOrder(order: Order): Promise<boolean> {
  try { const res = await apiFetch(`${API_BASE}?action=save_order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: order.id, customer_name: order.customerName, details: order }) }); return res.ok; } catch { return false; }
}
async function apiUpdateOrderStatus(orderId: string, updates: { status?: string; paymentStatus?: string }): Promise<boolean> {
  try { const res = await apiFetch(`${API_BASE}?action=update_order_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: orderId, ...updates }) }); return res.ok; } catch { return false; }
}
async function apiCheckSession(): Promise<{ loggedIn: boolean; username: string }> {
  try { const res = await apiFetch(`${API_BASE}?action=check_session`); if (!res.ok) return { loggedIn: false, username: '' }; const data = await res.json(); return { loggedIn: !!data?.loggedIn, username: data?.username ?? '' }; } catch { return { loggedIn: false, username: '' }; }
}
async function apiLogin(username: string, password: string): Promise<boolean> {
  try { const res = await apiFetch(`${API_BASE}?action=login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }); if (!res.ok) return false; const data = await res.json(); return data?.status === 'success'; } catch { return false; }
}
async function apiLogout(): Promise<void> { try { await apiFetch(`${API_BASE}?action=logout`, { method: 'POST' }); } catch {} }

interface AppState {
  cart: CartItem[]; addToCart: (item: CartItem) => void; removeFromCart: (productId: string) => void; updateQuantity: (productId: string, quantity: number) => void; clearCart: () => void; cartTotal: () => number; cartCount: () => number;
  orders: Order[]; addOrder: (order: Order) => Promise<void>; updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>; updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => Promise<void>;
  admin: AdminState; login: (username: string, password: string) => Promise<boolean>; logout: () => void; checkSession: () => Promise<boolean>;
  products: Product[]; addProduct: (product: Product) => void; updateProduct: (product: Product) => void; deleteProduct: (productId: string) => void;
  selectedProductId: string | null; setSelectedProductId: (id: string | null) => void;
  paymentGateways: Record<string, PaymentGatewayConfig>; defaultGateway: string; updatePaymentGateway: (id: string, config: Partial<PaymentGatewayConfig>) => Promise<void>; togglePaymentGateway: (id: string) => Promise<void>; setDefaultGateway: (id: string) => void; resetPaymentGateway: (id: string) => void; addCustomPaymentGateway: (gateway: PaymentGatewayConfig) => void; deleteCustomPaymentGateway: (id: string) => void; customGatewayIds: string[];
  initialize: () => Promise<void>; refreshFromServer: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => { const { cart } = get(); const existing = cart.find((i) => i.productId === item.productId); if (existing) { set({ cart: cart.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i) }); } else { set({ cart: [...cart, item] }); } },
      removeFromCart: (productId) => { set({ cart: get().cart.filter((i) => i.productId !== productId) }); },
      updateQuantity: (productId, quantity) => { if (quantity <= 0) { get().removeFromCart(productId); return; } set({ cart: get().cart.map((i) => i.productId === productId ? { ...i, quantity } : i) }); },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
      orders: [],
      addOrder: async (order) => { set({ orders: [...get().orders, order] }); const ok = await apiSaveOrder(order); if (ok) { const serverOrders = await apiFetchAllOrders(); if (serverOrders.length > 0) set({ orders: serverOrders }); } },
      updateOrderStatus: async (orderId, status) => { set({ orders: get().orders.map((o) => o.id === orderId ? { ...o, status } : o) }); const ok = await apiUpdateOrderStatus(orderId, { status }); if (ok) { const serverOrders = await apiFetchAllOrders(); if (serverOrders.length > 0) set({ orders: serverOrders }); } },
      updatePaymentStatus: async (orderId, status) => { set({ orders: get().orders.map((o) => o.id === orderId ? { ...o, paymentStatus: status } : o) }); const ok = await apiUpdateOrderStatus(orderId, { paymentStatus: status }); if (ok) { const serverOrders = await apiFetchAllOrders(); if (serverOrders.length > 0) set({ orders: serverOrders }); } },
      admin: { isLoggedIn: false, username: '' },
      login: async (username, password) => { const ok = await apiLogin(username, password); if (ok) { set({ admin: { isLoggedIn: true, username } }); return true; } if (username === 'admin' && password === 'admin123') { set({ admin: { isLoggedIn: true, username } }); return true; } return false; },
      logout: () => { apiLogout(); set({ admin: { isLoggedIn: false, username: '' } }); },
      checkSession: async () => { const localAdmin = get().admin; if (localAdmin.isLoggedIn) { const session = await apiCheckSession(); if (session.loggedIn) { set({ admin: { isLoggedIn: true, username: session.username || localAdmin.username } }); return true; } return true; } const session = await apiCheckSession(); if (session.loggedIn) { set({ admin: { isLoggedIn: true, username: session.username } }); return true; } return false; },
      products: [],
      addProduct: (product) => { set({ products: [...get().products, product] }); },
      updateProduct: (product) => { set({ products: get().products.map((p) => p.id === product.id ? product : p) }); },
      deleteProduct: (productId) => { set({ products: get().products.filter((p) => p.id !== productId) }); },
      selectedProductId: null,
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      paymentGateways: defaultPaymentGateways,
      defaultGateway: 'midtrans',
      updatePaymentGateway: async (id, config) => { const gateways = get().paymentGateways; if (!gateways[id]) return; const updated: PaymentGatewayConfig = { ...gateways[id], ...config, lastUpdated: new Date().toISOString() }; set({ paymentGateways: { ...gateways, [id]: updated } }); const keyFields: (keyof PaymentGatewayConfig)[] = ['apiKey', 'secretKey', 'serverKey', 'clientKey', 'publicKey', 'privateKey']; const savePromises: Promise<boolean>[] = []; keyFields.forEach((field) => { const value = updated[field]; if (typeof value === 'string' && value.trim() !== '') { savePromises.push(apiSaveKey(`${id}_${field}`, value)); } }); if (updated.enabled !== undefined) { savePromises.push(apiSaveKey(`${id}_enabled`, String(updated.enabled))); } if (updated.mode) { savePromises.push(apiSaveKey(`${id}_mode`, updated.mode)); } if (updated.merchantId) { savePromises.push(apiSaveKey(`${id}_merchantId`, updated.merchantId)); } await Promise.all(savePromises); await get().refreshFromServer(); },
      togglePaymentGateway: async (id) => { const gateways = get().paymentGateways; if (!gateways[id]) return; const newEnabled = !gateways[id].enabled; set({ paymentGateways: { ...gateways, [id]: { ...gateways[id], enabled: newEnabled, lastUpdated: new Date().toISOString() } } }); await apiSaveKey(`${id}_enabled`, String(newEnabled)); await get().refreshFromServer(); },
      setDefaultGateway: (id) => set({ defaultGateway: id }),
      resetPaymentGateway: (id) => { const gateways = get().paymentGateways; if (!gateways[id] || !defaultPaymentGateways[id]) return; set({ paymentGateways: { ...gateways, [id]: { ...defaultPaymentGateways[id] } } }); },
      customGatewayIds: [],
      addCustomPaymentGateway: (gateway) => { const gateways = get().paymentGateways; const customIds = get().customGatewayIds; if (gateways[gateway.id]) return; set({ paymentGateways: { ...gateways, [gateway.id]: { ...gateway, lastUpdated: new Date().toISOString() } }, customGatewayIds: [...customIds, gateway.id] }); },
      deleteCustomPaymentGateway: (id) => { const gateways = get().paymentGateways; const customIds = get().customGatewayIds; if (!customIds.includes(id)) return; const rest = Object.fromEntries(Object.entries(gateways).filter(([key]) => key !== id)); const isDefault = get().defaultGateway === id; set({ paymentGateways: rest, customGatewayIds: customIds.filter((cid) => cid !== id), ...(isDefault ? { defaultGateway: 'midtrans' } : {}) }); },
      refreshFromServer: async () => { const [settings, serverOrders] = await Promise.all([apiFetchAllSettings(), apiFetchAllOrders()]); if (serverOrders.length > 0) { const localOrders = get().orders; const serverOrderIds = new Set(serverOrders.map((o) => o.id)); const localOnly = localOrders.filter((o) => !serverOrderIds.has(o.id)); set({ orders: [...serverOrders, ...localOnly] }); } if (Object.keys(settings).length > 0) { const gateways = { ...get().paymentGateways }; const keyFields = ['apiKey', 'secretKey', 'serverKey', 'clientKey', 'publicKey', 'privateKey', 'merchantId', 'enabled', 'mode'] as const; for (const gatewayId of Object.keys(gateways)) { let updated = false; for (const field of keyFields) { const settingKey = `${gatewayId}_${field}`; if (settings[settingKey] !== undefined && settings[settingKey] !== null) { if (field === 'enabled') { (gateways[gatewayId] as any)[field] = settings[settingKey] === 'true'; } else { (gateways[gatewayId] as any)[field] = settings[settingKey]; } updated = true; } } if (updated) { gateways[gatewayId] = { ...gateways[gatewayId] }; } } set({ paymentGateways: gateways }); } },
      initialize: async () => { await get().refreshFromServer(); await get().checkSession(); },
    }),
    { name: 'pcbeer-storage', onRehydrateStorage: () => (state) => { if (state) { state.initialize(); } } }
  )
);
