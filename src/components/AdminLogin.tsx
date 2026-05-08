import { useState } from 'react';
import { useStore } from '../store';
import { Lock, User, LogIn, ArrowLeft, Eye, EyeOff, Zap } from 'lucide-react';
import toast from '../utils/toast';

export default function AdminLogin() {
  const { login, setCurrentPage } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Harap isi username dan password');
      return;
    }
    const success = login(username, password);
    if (success) {
      toast.success('Selamat datang, Admin!');
      setCurrentPage('admin-dashboard');
    } else {
      toast.error('Username atau password salah');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
              <Zap className="w-10 h-10 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Login Admin</h1>
            <p className="text-gray-500 mt-2">Masuk ke dashboard PCBeerBeer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin123"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <LogIn className="w-5 h-5" />
              Masuk Dashboard
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-1">
              🔑 Demo Credentials:
            </h4>
            <p className="text-xs text-blue-600 font-mono">Username: <span className="font-bold">admin</span></p>
            <p className="text-xs text-blue-600 font-mono">Password: <span className="font-bold">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
