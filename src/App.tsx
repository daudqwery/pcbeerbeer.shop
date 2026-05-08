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
import { useStore } from './store';
import { useEffect } from 'react';

export default function App() {
  const { currentPage } = useStore();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'product-detail':
        return <ProductDetail />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'orders':
        return <OrdersPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'faq':
        return <FAQPage />;
      case 'refund':
        return <RefundPage />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
      case 'admin-products':
      case 'admin-orders':
      case 'admin-add-product':
      case 'admin-edit-product':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  const isAdminPage = ['admin-dashboard', 'admin-products', 'admin-orders', 'admin-add-product', 'admin-edit-product'].includes(currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminPage && <Navbar />}
      <main>{renderPage()}</main>
      <ToastContainer />
    </div>
  );
}
