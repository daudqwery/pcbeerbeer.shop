import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

const statusIcons: Record<string, { icon: any; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
  shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

const statusLabels: Record<string, string> = { pending: 'Menunggu', processing: 'Diproses', shipped: 'Dikirim', delivered: 'Terkirim', cancelled: 'Dibatalkan' };
const paymentStatusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700' };
const paymentStatusLabels: Record<string, string> = { pending: 'Belum Dibayar', paid: 'Lunas', failed: 'Gagal' };

export default function OrdersPage() {
  const { orders } = useStore();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">📦</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Belum Ada Pesanan</h2>
        <p className="text-gray-500 mb-8">Anda belum memiliki riwayat pesanan</p>
        <button onClick={() => navigate('/products')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/30">Mulai Belanja</button>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pesanan Saya</h1>
        <p className="text-gray-500 mt-1">Riwayat pesanan Anda</p>
      </div>
      <div className="space-y-4">
        {sortedOrders.map((order) => {
          const statusInfo = statusIcons[order.status] || statusIcons.pending;
          const StatusIcon = statusInfo.icon;
          return (
            <div key={order.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div><div className="text-sm text-gray-500">Order ID</div><div className="font-mono text-sm font-semibold text-gray-800">{order.id}</div></div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[order.paymentStatus]}`}>{paymentStatusLabels[order.paymentStatus]}</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}><StatusIcon className="w-3.5 h-3.5" />{statusLabels[order.status]}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</div><div className="text-sm text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</div></div>
                      <div className="text-sm font-bold text-gray-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-sm text-gray-500">
                    <p><span className="font-medium">Pembayaran:</span> {order.paymentMethod}</p>
                    <p className="mt-1"><span className="font-medium">Tanggal:</span> {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right"><div className="text-sm text-gray-500">Total</div><div className="text-xl font-bold text-blue-600">Rp {order.total.toLocaleString('id-ID')}</div></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
