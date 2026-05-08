import { useState } from 'react';
import { useStore } from '../store';
import { cn } from '../utils/cn';
import { ShoppingCart, Menu, X, LogIn, User, Zap } from 'lucide-react';

export default function Navbar() {
  const { cartCount, currentPage, setCurrentPage, setSelectedProductId, admin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', page: 'home' },
    { label: 'Produk', page: 'products' },
    { label: 'Pesanan Saya', page: 'orders' },
    { label: 'FAQ', page: 'faq' },
  ];

  const handleNav = (page: string) => {
    setCurrentPage(page);
    setSelectedProductId(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight">PC<span className="text-cyan-400">Beer</span>Beer</span>
              <span className="text-[10px] text-blue-200 -mt-0.5">Marketing Tools & PC Store</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  currentPage === link.page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-white/10 text-blue-100'
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav('cart')}
              className="relative p-2 rounded-lg hover:bg-white/10 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount()}
                </span>
              )}
            </button>

            {admin.isLoggedIn ? (
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 transition text-sm font-semibold"
              >
                <User className="w-4 h-4" />
                Admin
              </button>
            ) : (
              <button
                onClick={() => handleNav('admin-login')}
                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Admin
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-blue-800">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition',
                  currentPage === link.page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-white/10 text-blue-100'
                )}
              >
                {link.label}
              </button>
            ))}
            {admin.isLoggedIn ? (
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10"
              >
                <User className="w-4 h-4 inline mr-2" />
                Dashboard Admin
              </button>
            ) : (
              <button
                onClick={() => handleNav('admin-login')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Login Admin
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
