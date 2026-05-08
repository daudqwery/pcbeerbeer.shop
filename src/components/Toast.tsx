import { useState, useEffect, useCallback } from 'react';
import toast from '../utils/toast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = toast.subscribe((event) => {
      const newToast: ToastItem = {
        id: event.id,
        message: event.message,
        type: event.type,
      };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(event.id), 3000);
    });
    return unsubscribe;
  }, [removeToast]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
  };

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in ${colors[t.type]}`}
        >
          {icons[t.type]}
          <span className="text-sm font-medium text-gray-700">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="ml-2 p-1 hover:bg-black/5 rounded-full transition">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
