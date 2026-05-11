import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrdersPage from './components/OrdersPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ToastContainer from './components/Toast';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import FAQPage from './components/FAQPage';
import RefundPage from './components/RefundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      {!isAdminPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}
