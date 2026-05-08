import { useState } from 'react';
import LegalPageLayout from './LegalPageLayout';
import { ChevronDown, MessageCircle, Search } from 'lucide-react';
import { cn } from '../utils/cn';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // === Pemesanan ===
  {
    category: 'Pemesanan',
    question: 'Bagaimana cara melakukan pemesanan di PCBeerBeer?',
    answer: 'Cukup pilih produk yang Anda inginkan, klik "Tambah ke Keranjang", lalu lanjutkan ke Checkout. Isi data pengiriman, pilih metode pembayaran, dan klik "Bayar Sekarang". Setelah pembayaran berhasil, kami akan mengirimkan konfirmasi via email & WhatsApp.',
  },
  {
    category: 'Pemesanan',
    question: 'Apakah saya bisa pesan tanpa mendaftar akun?',
    answer: 'Ya, Anda bisa langsung checkout sebagai guest. Namun kami sarankan untuk mendaftar agar lebih mudah melacak pesanan, mendapatkan promo eksklusif, dan akses ke history pembelian.',
  },
  {
    category: 'Pemesanan',
    question: 'Bisakah saya membatalkan pesanan?',
    answer: 'Software/lisensi yang sudah dikirim TIDAK bisa dibatalkan. Untuk PC Gaming, pembatalan bisa dilakukan maksimal 2 jam setelah pembayaran atau sebelum proses perakitan dimulai (dikenakan biaya admin 5%).',
  },
  {
    category: 'Pemesanan',
    question: 'Berapa lama proses verifikasi pembayaran?',
    answer: 'Pembayaran via Midtrans, Xendit, OVO, GoPay, QRIS dll: VERIFIKASI INSTANT (otomatis). Transfer bank manual: 5-30 menit setelah konfirmasi via WhatsApp.',
  },

  // === Produk Software ===
  {
    category: 'Produk Software',
    question: 'Apakah lisensi software berlaku selamanya?',
    answer: 'YA! Semua software kami menggunakan model "Lifetime License" - sekali bayar, gunakan selamanya untuk 1 device/akun. Anda juga mendapat free update software seumur hidup.',
  },
  {
    category: 'Produk Software',
    question: 'Bagaimana cara menerima software setelah pembayaran?',
    answer: 'Setelah pembayaran terverifikasi, kami akan mengirimkan: (1) Link download software, (2) License key/aktivasi, (3) Tutorial penggunaan, (4) Akses grup support. Semua dikirim via email & WhatsApp dalam 15 menit - 2 jam.',
  },
  {
    category: 'Produk Software',
    question: 'Bisakah saya install software di banyak perangkat?',
    answer: '1 lisensi = 1 device. Jika ingin install di device lain, Anda perlu beli lisensi tambahan atau request transfer lisensi (gratis 1x untuk pindah device).',
  },
  {
    category: 'Produk Software',
    question: 'Apakah aman menggunakan WhatsApp/Telegram Blast tools?',
    answer: 'Software kami dilengkapi smart delay system & anti-ban technology untuk meminimalisir resiko banned. Namun penggunaan tetap menjadi tanggung jawab user. Ikuti tutorial penggunaan yang kami berikan untuk hasil terbaik.',
  },
  {
    category: 'Produk Software',
    question: 'Software berjalan di OS apa saja?',
    answer: 'TBPROMOB & WABPROMOB: Android (min. v7.0). WhatsApp SuperBlast & WBlaster Pro: Windows, RDP, Mac (Parallels). InstaRobo & Telegram Blast V2: Windows. Cek detail di halaman produk.',
  },
  {
    category: 'Produk Software',
    question: 'Apa beda WhatsApp SuperBlast vs BotMaster?',
    answer: 'WhatsApp SuperBlast: Fokus mass blast/promosi dengan multi RDP support. BotMaster WhatsApp Solution: Fokus customer service automation, scrape group, anti-ban yang lebih canggih. Pilih sesuai kebutuhan bisnis Anda.',
  },

  // === PC Gaming ===
  {
    category: 'PC Gaming',
    question: 'Berapa lama proses perakitan PC?',
    answer: 'Setelah pembayaran terverifikasi, perakitan PC membutuhkan 1-3 hari kerja, plus burn-in test 24 jam untuk memastikan stabilitas. Total dari order ke pengiriman: 3-5 hari kerja.',
  },
  {
    category: 'PC Gaming',
    question: 'Apakah PC sudah include OS Windows?',
    answer: 'Untuk paket Standard, Windows 10/11 sudah pre-installed (versi trial). Anda bisa upgrade ke Windows 11 Pro Original (+Rp 1.500.000) atau gunakan license sendiri.',
  },
  {
    category: 'PC Gaming',
    question: 'Berapa garansi PC Gaming?',
    answer: 'Garansi resmi 1 TAHUN untuk semua komponen utama (processor, motherboard, RAM, VGA, SSD). Garansi service 3 bulan untuk troubleshoot/setting. Garansi tidak berlaku untuk kerusakan akibat kelalaian/tegangan listrik tidak stabil.',
  },
  {
    category: 'PC Gaming',
    question: 'Bisakah custom spek PC?',
    answer: 'BISA! Hubungi kami via WhatsApp dengan detail kebutuhan Anda (budget, kegunaan, game yang dimainkan). Tim kami akan recommend build terbaik sesuai budget. Custom build butuh waktu 5-7 hari kerja.',
  },
  {
    category: 'PC Gaming',
    question: 'Apakah ada layanan COD untuk PC?',
    answer: 'COD (Cash on Delivery) hanya tersedia untuk area Jabodetabek dengan minimum order Rp 5.000.000. Customer akan dihubungi tim untuk konfirmasi alamat dan jadwal pengiriman.',
  },

  // === Pembayaran ===
  {
    category: 'Pembayaran',
    question: 'Metode pembayaran apa saja yang diterima?',
    answer: 'Kami menerima 10+ metode pembayaran: Kartu Kredit/Debit (Visa, Master, JCB), Virtual Account (BCA, Mandiri, BNI, BRI, Permata), E-Wallet (GoPay, OVO, DANA, ShopeePay, LinkAja), QRIS, Convenience Store (Indomaret, Alfamart), dan Transfer Bank Manual. Diproses melalui Midtrans, Xendit, Ayolinx, dan gateway terpercaya lainnya.',
  },
  {
    category: 'Pembayaran',
    question: 'Apakah pembayaran di PCBeerBeer aman?',
    answer: 'SANGAT AMAN. Semua transaksi diproses melalui Payment Gateway berlisensi resmi BI (Bank Indonesia) dan PCI DSS compliant. Data kartu kredit Anda tidak kami simpan, langsung diproses oleh gateway.',
  },
  {
    category: 'Pembayaran',
    question: 'Berapa biaya admin untuk masing-masing metode bayar?',
    answer: 'Kartu Kredit: 2.9% + Rp 2.000. VA Bank: Rp 4.440. QRIS: 0.7%. E-Wallet: 1.5% - 2%. Indomaret/Alfamart: Rp 5.000. Biaya sudah include di total pembayaran.',
  },
  {
    category: 'Pembayaran',
    question: 'Apakah bisa cicilan?',
    answer: 'Ya, untuk PC Gaming kami support cicilan 3, 6, 12 bulan via Kartu Kredit (BCA, Mandiri, BNI). Cicilan 0% untuk tenor 3 bulan dengan minimum transaksi Rp 5.000.000.',
  },

  // === Pengiriman ===
  {
    category: 'Pengiriman',
    question: 'Software dikirim via apa?',
    answer: 'Software dikirim secara digital via Email & WhatsApp dalam waktu 15 menit - 2 jam setelah pembayaran terverifikasi. Anda akan menerima link download, license key, dan tutorial.',
  },
  {
    category: 'Pengiriman',
    question: 'Berapa ongkos kirim PC Gaming?',
    answer: 'Jakarta: Rp 50.000 (gratis utk order >Rp 5jt). Pulau Jawa: Rp 150.000 - 300.000. Luar Jawa: Rp 350.000 - 1.000.000. Diasuransikan FULL VALUE produk. Bisa pilih JNE/J&T/SiCepat/AnterAja.',
  },
  {
    category: 'Pengiriman',
    question: 'Apakah ada layanan instalasi & setup?',
    answer: 'Software: Free remote install via AnyDesk/TeamViewer. PC Gaming: Free setup awal di kota Anda untuk pembelian via WhatsApp (khusus area Jabodetabek). Untuk area lain, kami sediakan video tutorial setup.',
  },

  // === Support ===
  {
    category: 'Support',
    question: 'Bagaimana jika ada masalah dengan software?',
    answer: 'Hubungi tim support kami 24/7 via: (1) WhatsApp 0812-3456-7890, (2) Telegram @pcbeerbeer_support, (3) Email cs@pcbeerbeer.com. Response time: < 30 menit di jam kerja, < 2 jam di luar jam kerja.',
  },
  {
    category: 'Support',
    question: 'Apakah ada training penggunaan?',
    answer: 'YA! Setiap pembelian software dapat: (1) Tutorial video lengkap, (2) PDF panduan step-by-step, (3) Akses grup Telegram members untuk tanya-jawab, (4) Free 1x sesi training online via Zoom (request via WhatsApp).',
  },
  {
    category: 'Support',
    question: 'Bagaimana jika lisensi/account saya bermasalah?',
    answer: 'Hubungi support dengan menyertakan: (1) Order ID, (2) Email pembelian, (3) Screenshot masalah. Tim kami akan cek dan reset/transfer lisensi Anda dalam 1-24 jam.',
  },

  // === Refund ===
  {
    category: 'Refund',
    question: 'Apakah bisa refund jika produk tidak sesuai?',
    answer: 'Software: Refund hanya jika produk tidak bisa dijalankan sama sekali setelah troubleshoot dengan tim teknis (max 3x percobaan). PC Gaming: Bisa refund 100% jika ada cacat produk dalam 7 hari (DOA - Death on Arrival). Detail lengkap di halaman Refund Policy.',
  },
  {
    category: 'Refund',
    question: 'Berapa lama proses refund?',
    answer: 'Refund diproses dalam 3-7 hari kerja setelah disetujui. Refund kembali ke metode pembayaran asal. Jika via VA/Transfer Bank, dikembalikan ke rekening Anda (perlu konfirmasi nomor rekening).',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(faqData.map(f => f.category)))];

  let filteredFAQ = faqData;
  if (activeCategory !== 'Semua') {
    filteredFAQ = filteredFAQ.filter(f => f.category === activeCategory);
  }
  if (search) {
    filteredFAQ = filteredFAQ.filter(
      f => f.question.toLowerCase().includes(search.toLowerCase()) ||
           f.answer.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <LegalPageLayout
      title="Frequently Asked Questions"
      subtitle="Pertanyaan yang sering ditanyakan customer"
      icon="faq"
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pertanyaan... (cth: lisensi, garansi, refund)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition',
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {cat}
              {cat !== 'Semua' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({faqData.filter(f => f.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-sm text-gray-500">
          Menampilkan <strong className="text-gray-700">{filteredFAQ.length}</strong> pertanyaan
        </p>

        {/* FAQ Items */}
        {filteredFAQ.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Pertanyaan Tidak Ditemukan</h3>
            <p className="text-sm text-gray-500 mb-4">Coba gunakan kata kunci lain atau hubungi tim kami</p>
            <button className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Chat WhatsApp
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFAQ.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={cn(
                    'border rounded-2xl overflow-hidden transition',
                    isOpen ? 'border-purple-300 bg-purple-50/30 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-start justify-between gap-3 text-left"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-gray-800 flex-1">{faq.question}</h3>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform mt-1',
                        isOpen && 'rotate-180 text-purple-600'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 ml-3 border-l-2 border-purple-200">
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-10 p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="text-5xl">💬</div>
            <div className="flex-1">
              <h3 className="font-bold text-purple-900 mb-1">Pertanyaan Anda tidak ada di sini?</h3>
              <p className="text-sm text-purple-700">Tim support kami siap membantu 24/7. Hubungi kami via WhatsApp atau email.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 justify-center"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href="mailto:cs@pcbeerbeer.com"
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 justify-center"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
}
