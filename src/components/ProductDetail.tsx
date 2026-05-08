import { useState } from 'react';
import { useStore } from '../store';
import { products as initialProducts, categoryIcons } from '../data/products';
import { ShoppingCart, ArrowLeft, MapPin, Package, Tag, CheckCircle, Shield, Star } from 'lucide-react';
import { CartItem } from '../types';
import toast from '../utils/toast';

export default function ProductDetail() {
  const { selectedProductId, setCurrentPage, addToCart, products: storeProducts, setSelectedProductId } = useStore();
  const allProducts = [...initialProducts, ...storeProducts];
  const product = allProducts.find((p) => p.id === selectedProductId);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Produk Tidak Ditemukan</h2>
        <button
          onClick={() => setCurrentPage('products')}
          className="text-blue-600 font-semibold hover:underline"
        >
          ← Kembali ke produk
        </button>
      </div>
    );
  }

  const isHardware = product.category === 'PC Gaming';
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    setAdding(true);
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    };
    addToCart(item);
    toast.success(`${quantity}x ${product.name} ditambahkan ke keranjang!`);
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('products')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke Produk</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 md:h-96 object-contain rounded-xl"
          />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
              {categoryIcons[product.category]} {product.category}
            </span>
            {product.featured && (
              <span className="text-sm bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" fill="currentColor" /> Featured
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-gray-500">5.0 (50+ pelanggan puas)</span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl">
              <Tag className="w-4 h-4 text-blue-600" />
              {product.volume}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl">
              <MapPin className="w-4 h-4 text-blue-600" />
              {product.origin}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl">
              <Package className="w-4 h-4 text-blue-600" />
              Stok: {product.stock}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Benefits */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">✨ Yang Anda Dapatkan:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {isHardware ? (
                <>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Garansi resmi 1 tahun</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Free instalasi & setting</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Test sebelum pengiriman</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Packing aman & terjamin</li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Lifetime License (1x bayar selamanya)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Free update software seumur hidup</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Tutorial penggunaan lengkap</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Support 24/7 via WhatsApp & Telegram</li>
                </>
              )}
            </ul>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through ml-3">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </span>
                <div className="bg-red-50 text-red-600 text-sm font-semibold px-3 py-1 rounded-lg inline-block ml-2">
                  Hemat {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-50 transition text-lg font-bold"
              >
                -
              </button>
              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-50 transition text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30"
            >
              <ShoppingCart className={`w-5 h-5 ${adding ? 'animate-bounce' : ''}`} />
              {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                setTimeout(() => setCurrentPage('checkout'), 600);
              }}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl transition shadow-lg"
            >
              ⚡ Beli Sekarang
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Pembayaran aman dengan Midtrans (kartu, VA, e-wallet, QRIS)</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <button
                key={rp.id}
                onClick={() => {
                  setSelectedProductId(rp.id);
                  window.scrollTo(0, 0);
                }}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition text-left group"
              >
                <img src={rp.image} alt={rp.name} className="w-full h-32 object-cover group-hover:scale-105 transition" />
                <div className="p-3">
                  <div className="text-xs text-blue-600 font-semibold">{categoryIcons[rp.category]} {rp.category}</div>
                  <div className="font-semibold text-gray-800 text-sm line-clamp-2 mt-1">{rp.name}</div>
                  <div className="text-blue-600 font-bold mt-1">
                    Rp {rp.price.toLocaleString('id-ID')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
