import { useStore } from '../store';
import { products, categoryIcons } from '../data/products';
import { ShoppingCart, Truck, Shield, Headphones, Award, Zap, MessageCircle, CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '../types';
import toast from '../utils/toast';

export default function HomePage() {
  const { setCurrentPage, setSelectedProductId, addToCart } = useStore();
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddToCart = (product: typeof products[0]) => {
    setAddingId(product.id);
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    addToCart(item);
    toast.success(`${product.name} ditambahkan ke keranjang!`);
    setTimeout(() => setAddingId(null), 500);
  };

  const handleViewProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product-detail');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 text-sm font-medium text-blue-200 mb-6">
                <Zap className="w-4 h-4 text-cyan-400" fill="currentColor" />
                <span>#1 Marketing Tools Indonesia</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Tingkatkan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  Bisnis Anda
                </span>{' '}
                dengan Tools Profesional
              </h1>
              <p className="text-lg text-blue-200 mb-8 leading-relaxed">
                Software marketing terbaik untuk WhatsApp, Telegram & Instagram. 
                Tersedia juga PC Gaming Rakitan berkualitas dengan harga terjangkau.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setCurrentPage('products')}
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold rounded-xl transition transform hover:scale-105 shadow-xl shadow-blue-500/30"
                >
                  Belanja Sekarang
                </button>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="px-8 py-3.5 border-2 border-blue-400 text-blue-200 hover:bg-blue-800/50 font-semibold rounded-xl transition"
                >
                  Lihat Katalog
                </button>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div>
                  <div className="text-3xl font-bold text-cyan-300">10K+</div>
                  <div className="text-xs text-blue-300">Pelanggan Puas</div>
                </div>
                <div className="w-px h-10 bg-blue-700" />
                <div>
                  <div className="text-3xl font-bold text-cyan-300">15+</div>
                  <div className="text-xs text-blue-300">Produk Premium</div>
                </div>
                <div className="w-px h-10 bg-blue-700" />
                <div>
                  <div className="text-3xl font-bold text-cyan-300">24/7</div>
                  <div className="text-xs text-blue-300">Support</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl blur-2xl opacity-50" />
                <div className="relative bg-gradient-to-br from-slate-800 to-blue-900 rounded-3xl p-8 border border-blue-500/30 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10">
                      <div className="text-3xl mb-2">💬</div>
                      <div className="font-bold text-white">WhatsApp Tools</div>
                      <div className="text-xs text-blue-300">Bulk Sender Pro</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10">
                      <div className="text-3xl mb-2">✈️</div>
                      <div className="font-bold text-white">Telegram Tools</div>
                      <div className="text-xs text-blue-300">Auto Marketing</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10">
                      <div className="text-3xl mb-2">📸</div>
                      <div className="font-bold text-white">Instagram Bot</div>
                      <div className="text-xs text-blue-300">Auto Engage</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10">
                      <div className="text-3xl mb-2">🖥️</div>
                      <div className="font-bold text-white">PC Gaming</div>
                      <div className="text-xs text-blue-300">High Spec</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Pengiriman Cepat', desc: 'Software langsung kirim, PC 1-3 hari', color: 'bg-blue-500' },
              { icon: Shield, title: '100% Original', desc: 'Garansi keaslian produk', color: 'bg-green-500' },
              { icon: Award, title: 'Lifetime Update', desc: 'Free update software selamanya', color: 'bg-purple-500' },
              { icon: Headphones, title: 'Support 24/7', desc: 'Tim support siap membantu', color: 'bg-orange-500' },
            ].map((feat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl hover:shadow-lg transition">
                <div className={`w-16 h-16 ${feat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <feat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-800">{feat.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Kategori Produk</h2>
            <p className="text-gray-500">Temukan tools dan hardware terbaik untuk kebutuhan Anda</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryIcons).map(([cat, icon]) => (
              <button
                key={cat}
                onClick={() => setCurrentPage('products')}
                className="p-6 bg-white rounded-2xl hover:shadow-xl transition text-center group border border-gray-100"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition">{icon}</div>
                <div className="font-bold text-gray-800 group-hover:text-blue-600 transition">
                  {cat}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {products.filter(p => p.category === cat).length} produk
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Produk Unggulan</h2>
              <p className="text-gray-500 mt-2">Pilihan terbaik dari koleksi kami</p>
            </div>
            <button
              onClick={() => setCurrentPage('products')}
              className="text-blue-600 hover:text-blue-700 font-semibold transition hidden sm:flex items-center gap-1"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition group border border-gray-100"
              >
                <div
                  onClick={() => handleViewProduct(product.id)}
                  className="relative h-52 overflow-hidden cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-500"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                      HEMAT {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-2 py-1 rounded-lg">
                    {categoryIcons[product.category]} {product.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3
                    onClick={() => handleViewProduct(product.id)}
                    className="font-bold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">(50+ terjual)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-400 line-through">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className="p-2.5 bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl transition"
                    >
                      <ShoppingCart className={`w-5 h-5 ${addingId === product.id ? 'animate-bounce' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Mengapa Memilih PCBeerBeer?</h2>
            <p className="text-blue-200">Trusted by ribuan pelanggan di seluruh Indonesia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Software Terbaik', desc: 'Software marketing terupdate dengan fitur paling lengkap dan terus dikembangkan oleh tim developer berpengalaman.' },
              { title: 'Harga Bersaing', desc: 'Dapatkan harga terbaik untuk software & PC gaming berkualitas dengan diskon menarik setiap bulannya.' },
              { title: 'After Sales Service', desc: 'Tim support siap membantu Anda 24/7 melalui WhatsApp, Telegram, dan platform lainnya.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
                <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Boost Bisnis Anda?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan pebisnis sukses yang sudah menggunakan tools dari PCBeerBeer. 
            Pesan sekarang dan dapatkan diskon spesial!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setCurrentPage('products')}
              className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-xl"
            >
              Belanja Sekarang
            </button>
            <button
              className="px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              Chat WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="text-lg font-bold text-white">PC<span className="text-cyan-400">Beer</span>Beer</span>
              </div>
              <p className="text-sm">
                Toko software marketing dan PC Gaming terpercaya di Indonesia. Tingkatkan bisnis Anda bersama kami!
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Menu</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition">Beranda</button></li>
                <li><button onClick={() => setCurrentPage('products')} className="hover:text-white transition">Produk</button></li>
                <li><button onClick={() => setCurrentPage('orders')} className="hover:text-white transition">Pesanan Saya</button></li>
                <li><button onClick={() => setCurrentPage('cart')} className="hover:text-white transition">Keranjang</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Bantuan & Info</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('faq')} className="hover:text-white transition">❓ FAQ</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="hover:text-white transition">📋 Syarat & Ketentuan</button></li>
                <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition">🛡️ Privasi & Keamanan</button></li>
                <li><button onClick={() => setCurrentPage('refund')} className="hover:text-white transition">🔄 Refund Policy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm">
                <li>📱 WhatsApp: 0812-3456-7890</li>
                <li>✉️ Email: cs@pcbeerbeer.com</li>
                <li>📍 Jakarta, Indonesia</li>
                <li>🕒 24/7 Online Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <p>© 2024 PCBeerBeer. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <button onClick={() => setCurrentPage('terms')} className="hover:text-white transition">Syarat</button>
              <span>•</span>
              <button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition">Privasi</button>
              <span>•</span>
              <button onClick={() => setCurrentPage('faq')} className="hover:text-white transition">FAQ</button>
              <span>•</span>
              <button onClick={() => setCurrentPage('refund')} className="hover:text-white transition">Refund</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
