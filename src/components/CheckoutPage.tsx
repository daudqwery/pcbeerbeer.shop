import { useState } from 'react';
import { useStore } from '../store';
import { ArrowLeft, CreditCard, MapPin, Phone, Mail, User, Loader2, Shield } from 'lucide-react';
import toast from '../utils/toast';

// Midtrans configuration - Replace with your actual client key from Midtrans dashboard
const MIDTRANS_CLIENT_KEY = 'SB-Mid-client-xxxxx';

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, addOrder, setCurrentPage, paymentGateways, defaultGateway } = useStore();

  // Get enabled gateways for payment options
  const enabledGateways = Object.values(paymentGateways).filter(g => g.enabled);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(defaultGateway || 'midtrans');

  const total = cartTotal();
  // Software products don't need physical shipping
  const hasPhysicalProduct = cart.some(item => item.name.toLowerCase().includes('pc'));
  const shippingFee = hasPhysicalProduct ? (total >= 5000000 ? 0 : 50000) : 0;
  const grandTotal = total + shippingFee;

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const loadMidtransSnap = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.snap) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error('Harap lengkapi semua data terlebih dahulu');
      return;
    }

    setLoading(true);

    const selectedGateway = paymentGateways[paymentMethod];

    if (selectedGateway) {
      // Gateway-specific payment flow
      try {
        if (selectedGateway.id === 'midtrans') {
          await loadMidtransSnap();
          // In production: call backend API to get Snap token
          // POST /api/payment/midtrans with order details
          // Backend uses Server Key to call Midtrans Snap API
          // Then call window.snap.pay(snapToken, callbacks)
        } else if (selectedGateway.id === 'xendit') {
          // In production: POST /api/payment/xendit
          // Backend uses Xendit Secret Key to create invoice
          // Redirect customer to invoice_url
          toast.info(`Memproses pembayaran via ${selectedGateway.name}...`);
        } else if (selectedGateway.id === 'ayolinx') {
          // In production: POST /api/payment/ayolinx
          // Use Ayolinx API to generate payment link
          toast.info(`Memproses pembayaran via ${selectedGateway.name}...`);
        } else if (selectedGateway.id === 'certenz') {
          // Certenz integration
          toast.info(`Memproses pembayaran via ${selectedGateway.name}...`);
        } else if (selectedGateway.id === 'p2cp') {
          // P2CP integration
          toast.info(`Memproses pembayaran P2P Cash...`);
        } else if (selectedGateway.id === 'onebrick') {
          // OneBrick Open Banking
          toast.info(`Initializing OneBrick Direct Debit...`);
        } else {
          toast.info(`Memproses pembayaran via ${selectedGateway.name}...`);
        }

        // For demo, all gateways simulate success after 2s
        simulatePayment();
      } catch (error) {
        toast.error('Terjadi kesalahan saat memproses pembayaran');
        setLoading(false);
      }
    } else {
      // Manual transfer or COD
      simulatePayment();
    }
  };

  const simulatePayment = () => {
    setTimeout(() => {
      const orderId = 'PCBB-' + Date.now();

      const selectedGateway = paymentGateways[paymentMethod];
      const paymentMethodName = 
        selectedGateway ? `${selectedGateway.name} (${selectedGateway.mode === 'production' ? 'LIVE' : 'TEST'})` :
        paymentMethod === 'transfer' ? 'Transfer Bank Manual' :
        paymentMethod === 'cod' ? 'COD (Cash on Delivery)' :
        'Unknown';

      const order = {
        id: orderId,
        items: [...cart],
        total: grandTotal,
        status: 'pending' as const,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        customerAddress: form.address,
        paymentMethod: paymentMethodName,
        paymentStatus: selectedGateway ? 'paid' as const : 'pending' as const,
        snapToken: 'demo-snap-token-' + paymentMethod,
        createdAt: new Date().toISOString(),
      };

      addOrder(order);
      clearCart();
      setLoading(false);
      toast.success('Pesanan berhasil dibuat! 🎉');
      setCurrentPage('orders');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Keranjang Kosong</h2>
        <p className="text-gray-500 mb-8">Tambahkan produk terlebih dahulu sebelum checkout</p>
        <button
          onClick={() => setCurrentPage('products')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/30"
        >
          Mulai Belanja
        </button>
      </div>
    );
  }

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => setCurrentPage('cart')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke Keranjang</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Lengkapi data Anda untuk menyelesaikan pesanan</p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Data Pemesan
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={form.name} onChange={(e) => handleFormChange('name', e.target.value)}
                      className={inputClass} placeholder="Nama lengkap Anda" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" value={form.email} onChange={(e) => handleFormChange('email', e.target.value)}
                        className={inputClass} placeholder="email@contoh.com" required />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Software akan dikirim ke email ini</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="tel" value={form.phone} onChange={(e) => handleFormChange('phone', e.target.value)}
                        className={inputClass} placeholder="08123456789" required />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {hasPhysicalProduct ? 'Alamat Pengiriman' : 'Alamat (untuk invoice)'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea value={form.address} onChange={(e) => handleFormChange('address', e.target.value)}
                      className={inputClass.replace('py-3', 'py-3')} placeholder="Alamat lengkap, kota, kode pos" rows={3} required />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Metode Pembayaran
              </h2>
              <div className="space-y-3">
                {enabledGateways.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                    ⚠️ Tidak ada payment gateway yang aktif. Hubungi admin untuk mengaktifkannya.
                  </div>
                ) : (
                  enabledGateways.map((gw) => (
                    <label key={gw.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === gw.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="payment" value={gw.id}
                        checked={paymentMethod === gw.id}
                        onChange={() => setPaymentMethod(gw.id)}
                        className="mt-1 text-blue-600 focus:ring-blue-500" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-gray-800">{gw.name}</span>
                          {gw.id === defaultGateway && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">RECOMMENDED</span>
                          )}
                          {gw.mode === 'sandbox' && (
                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">TEST MODE</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">{gw.description}</div>
                        <div className="flex flex-wrap gap-1">
                          {gw.supportedMethods.slice(0, 8).map(m => (
                            <span key={m} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-600">{m}</span>
                          ))}
                          {gw.supportedMethods.length > 8 && (
                            <span className="text-[10px] text-gray-400 px-2 py-0.5">+{gw.supportedMethods.length - 8} lainnya</span>
                          )}
                        </div>
                      </div>
                      <div className="text-3xl">{gw.logo}</div>
                    </label>
                  ))
                )}

                {/* Always show Transfer & COD as alternative */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="radio" name="payment" value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                    className="mt-1 text-blue-600 focus:ring-blue-500" />
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 mb-1">Transfer Bank Manual</div>
                    <div className="text-sm text-gray-500">BCA, Mandiri, BNI, BRI - Konfirmasi via WhatsApp</div>
                  </div>
                  <div className="text-3xl">🏦</div>
                </label>

                {hasPhysicalProduct && (
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input type="radio" name="payment" value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-blue-600 focus:ring-blue-500" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 mb-1">COD (Cash on Delivery)</div>
                      <div className="text-sm text-gray-500">Bayar di tempat saat barang diterima (khusus PC Gaming Jakarta)</div>
                    </div>
                    <div className="text-3xl">💵</div>
                  </label>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  Transaksi Anda 100% aman dan terenkripsi. Kami tidak menyimpan data kartu Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Ringkasan Pesanan</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
                {hasPhysicalProduct && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ongkos Kirim PC</span>
                    <span>{shippingFee === 0 ? 'GRATIS' : `Rp ${shippingFee.toLocaleString('id-ID')}`}</span>
                  </div>
                )}
                {!hasPhysicalProduct && (
                  <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    📧 Software akan dikirim via email setelah pembayaran
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-blue-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses Pembayaran...
                  </>
                ) : (
                  <>⚡ Bayar Sekarang</>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Dengan klik "Bayar Sekarang" Anda menyetujui{' '}
                <button
                  type="button"
                  onClick={() => setCurrentPage('terms')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Syarat & Ketentuan
                </button>
                {' '}dan{' '}
                <button
                  type="button"
                  onClick={() => setCurrentPage('privacy')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Kebijakan Privasi
                </button>
                {' '}kami.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
