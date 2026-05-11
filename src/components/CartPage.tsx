import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Trash2, ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import toast from '../utils/toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Keranjang Kosong</h2>
        <p className="text-gray-500 mb-8">Belum ada produk yang ditambahkan ke keranjang</p>
        <button onClick={() => navigate('/products')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/30">Mulai Belanja</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Keranjang Belanja</h1>
          <p className="text-gray-500 mt-1">{cartCount()} item dalam keranjang</p>
        </div>
        <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Lanjut Belanja</span>
        </button>
      </div>
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item.productId} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
              <div className="text-blue-600 font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition"><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center font-semibold">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="text-right min-w-[100px]"><div className="font-bold text-gray-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div></div>
            <button onClick={() => { removeFromCart(item.productId); toast.info(`${item.name} dihapus dari keranjang`); }} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-gray-600"><span>Subtotal ({cartCount()} item)</span><span>Rp {cartTotal().toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between text-gray-600"><span>Estimasi Pengiriman</span><span>Dihitung saat checkout</span></div>
          <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800"><span>Total</span><span className="text-blue-600">Rp {cartTotal().toLocaleString('id-ID')}</span></div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { clearCart(); toast.info('Keranjang dikosongkan'); }} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium">Kosongkan</button>
          <button onClick={() => navigate('/checkout')} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"><ShoppingBag className="w-5 h-5" />Lanjut ke Checkout</button>
        </div>
      </div>
    </div>
  );
}
