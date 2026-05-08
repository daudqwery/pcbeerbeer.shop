import { useState } from 'react';
import { useStore } from '../store';
import { products as initialProducts, categoryIcons } from '../data/products';
import { ShoppingCart, Search, SlidersHorizontal, X, Star } from 'lucide-react';
import { CartItem } from '../types';
import { cn } from '../utils/cn';
import toast from '../utils/toast';

export default function ProductsPage() {
  const { addToCart, setSelectedProductId, setCurrentPage, products: storeProducts } = useStore();
  const allProducts = [...initialProducts, ...storeProducts];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));

  let filtered = allProducts;

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (selectedCategory) {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const handleAddToCart = (product: typeof allProducts[0]) => {
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

  const handleView = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product-detail');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Katalog Produk</h1>
        <p className="text-gray-500 mt-2">Software Marketing Tools & PC Gaming - Pilih sesuai kebutuhan Anda</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari WhatsApp Blast, Telegram Tools, PC Gaming..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition sm:w-auto"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-sm font-medium">Kategori</span>
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="default">Urutkan: Default</option>
          <option value="price-asc">Harga: Termurah</option>
          <option value="price-desc">Harga: Termahal</option>
          <option value="name">Nama A-Z</option>
        </select>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition',
                !selectedCategory
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-100'
              )}
            >
              🌐 Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition',
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-blue-100'
                )}
              >
                {categoryIcons[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick category bar (always visible) */}
      {!showFilters && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition',
              !selectedCategory ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
            )}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition',
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
              )}
            >
              {categoryIcons[cat]} {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 mb-6">
        Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> dari {allProducts.length} produk
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">Produk Tidak Ditemukan</h3>
          <p className="text-gray-400">Coba gunakan kata kunci pencarian yang berbeda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition group border border-gray-100"
            >
              <div
                onClick={() => handleView(product.id)}
                className="relative h-44 overflow-hidden cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-500"
                />
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    Sisa {product.stock}
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">HABIS</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                  {categoryIcons[product.category]} {product.category}
                </div>
              </div>
              <div className="p-4">
                <h3
                  onClick={() => handleView(product.id)}
                  className="font-bold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition line-clamp-2 min-h-[3rem]"
                >
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">(50+)</span>
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <div className="text-lg font-bold text-blue-600 leading-tight">
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
                    disabled={addingId === product.id || product.stock === 0}
                    className={cn(
                      'p-2 rounded-xl transition',
                      product.stock === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700'
                    )}
                  >
                    <ShoppingCart className={`w-5 h-5 ${addingId === product.id ? 'animate-bounce' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
