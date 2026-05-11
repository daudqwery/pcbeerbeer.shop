import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, HelpCircle, RotateCcw } from 'lucide-react';
import { cn } from '../utils/cn';

interface LegalPageLayoutProps { title: string; subtitle?: string; icon: 'terms' | 'privacy' | 'faq' | 'refund'; lastUpdated?: string; children: ReactNode; }

const icons = { terms: FileText, privacy: Shield, faq: HelpCircle, refund: RotateCcw };
const iconColors = { terms: 'from-blue-500 to-blue-600', privacy: 'from-green-500 to-emerald-600', faq: 'from-purple-500 to-violet-600', refund: 'from-orange-500 to-red-500' };

export default function LegalPageLayout({ title, subtitle, icon, lastUpdated = '15 Januari 2024', children }: LegalPageLayoutProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const Icon = icons[icon];

  const navItems = [
    { id: 'terms', label: 'Syarat & Ketentuan', icon: FileText, path: '/terms' },
    { id: 'privacy', label: 'Privasi & Keamanan', icon: Shield, path: '/privacy' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, path: '/faq' },
    { id: 'refund', label: 'Refund Policy', icon: RotateCcw, path: '/refund' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      <div className={`bg-gradient-to-br ${iconColors[icon]} text-white py-12 md:py-16`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/80 hover:text-white transition mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />Kembali ke Beranda
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl"><Icon className="w-8 h-8 text-white" /></div>
            <div><h1 className="text-3xl md:text-4xl font-bold">{title}</h1>{subtitle && <p className="text-white/80 mt-1">{subtitle}</p>}</div>
          </div>
          <p className="text-white/70 text-sm mt-4">📅 Terakhir diperbarui: <span className="font-semibold">{lastUpdated}</span></p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-3 sticky top-20 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Halaman Bantuan</h3>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => navigate(item.path)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left', pathname === item.path ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50')}>
                    <item.icon className="w-4 h-4" />{item.label}
                  </button>
                ))}
              </nav>
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-800 font-semibold mb-1">📞 Butuh Bantuan?</p>
                <p className="text-xs text-blue-600">WhatsApp: 0812-3456-7890</p>
                <p className="text-xs text-blue-600">Email: cs@pcbeerbeer.com</p>
              </div>
            </div>
          </aside>
          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm">
              <article className="prose prose-slate max-w-none">{children}</article>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
