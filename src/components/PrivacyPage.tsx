import LegalPageLayout from './LegalPageLayout';
import { Lock, Database, Eye, Cookie, UserCheck, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privasi & Keamanan"
      subtitle="Komitmen kami melindungi data pribadi Anda"
      icon="privacy"
    >
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl mb-6">
            <p className="text-sm text-green-900">
              <strong>🛡️ Komitmen Privasi Kami:</strong> PCBeerBeer berkomitmen melindungi privasi dan keamanan data pribadi Anda. 
              Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda 
              sesuai dengan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
            </p>
          </div>
        </section>

        {/* Quick Summary Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ringkasan Kebijakan Privasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Database, title: 'Data yang Dikumpulkan', desc: 'Hanya data yang diperlukan untuk transaksi & layanan' },
              { icon: Lock, title: 'Enkripsi Data', desc: 'SSL/TLS encryption untuk semua transaksi' },
              { icon: Eye, title: 'Tidak Dijual ke Pihak Ke-3', desc: 'Data Anda tidak akan kami jual atau bagikan' },
              { icon: UserCheck, title: 'Hak Anda Terjamin', desc: 'Akses, ubah, atau hapus data kapan saja' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Data Pribadi yang Kami Kumpulkan</h2>
          <p className="mb-3">Kami mengumpulkan informasi berikut saat Anda melakukan transaksi:</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-4 border border-gray-200 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" /> Data Identitas
              </h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                <li>Nama lengkap</li>
                <li>Email address</li>
                <li>Nomor WhatsApp/HP</li>
                <li>Alamat pengiriman</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600" /> Data Transaksi
              </h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                <li>Riwayat pesanan</li>
                <li>Metode pembayaran (token only)</li>
                <li>Status pembayaran</li>
                <li>Invoice & receipt</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-600" /> Data Teknis
              </h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                <li>IP address</li>
                <li>Browser type & version</li>
                <li>Device information</li>
                <li>Log aktivitas</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Cookie className="w-4 h-4 text-orange-600" /> Cookies
              </h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                <li>Session cookies</li>
                <li>Cart preferences</li>
                <li>Login state</li>
                <li>Analytics (anonim)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Penggunaan Data</h2>
          <p className="mb-3">Data Anda kami gunakan untuk tujuan berikut:</p>
          <div className="space-y-2">
            {[
              { num: '1', text: 'Memproses dan mengirimkan pesanan Anda' },
              { num: '2', text: 'Mengirimkan lisensi software via email/WhatsApp' },
              { num: '3', text: 'Verifikasi pembayaran dan deteksi fraud' },
              { num: '4', text: 'Memberikan customer support dan after-sales service' },
              { num: '5', text: 'Mengirimkan informasi produk baru, promo, dan update (dengan persetujuan Anda)' },
              { num: '6', text: 'Memenuhi kewajiban hukum dan pajak' },
              { num: '7', text: 'Meningkatkan kualitas layanan berdasarkan analitik' },
            ].map(item => (
              <div key={item.num} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {item.num}
                </div>
                <p className="text-sm text-blue-900">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Keamanan Data</h2>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5" /> Lapisan Proteksi Keamanan
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>SSL/TLS Encryption (HTTPS)</strong>
                  <p className="text-xs text-gray-600">Semua data transfer dienkripsi end-to-end</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>PCI DSS Compliant Payment</strong>
                  <p className="text-xs text-gray-600">Via Midtrans, Xendit & gateway terpercaya lainnya</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Tidak Menyimpan Data Kartu</strong>
                  <p className="text-xs text-gray-600">Data kartu kredit ditangani langsung oleh payment gateway</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Hashed Password</strong>
                  <p className="text-xs text-gray-600">Password disimpan dengan bcrypt hashing</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Server Firewall & DDoS Protection</strong>
                  <p className="text-xs text-gray-600">Cloudflare protection 24/7</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <strong>Regular Security Audit</strong>
                  <p className="text-xs text-gray-600">Audit keamanan berkala oleh tim IT</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Pembagian Data ke Pihak Ketiga</h2>
          <p className="mb-3">Kami <strong>TIDAK</strong> menjual atau menyewakan data Anda. Namun, kami dapat membagikan data ke pihak berikut bila diperlukan:</p>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-xl">
              <strong className="text-gray-800">💳 Payment Gateway</strong>
              <p className="text-sm text-gray-600">Midtrans, Xendit, Ayolinx, Certenz, OneBrick, dll - untuk memproses pembayaran</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-xl">
              <strong className="text-gray-800">📦 Jasa Ekspedisi</strong>
              <p className="text-sm text-gray-600">JNE, J&T, SiCepat, AnterAja - untuk pengiriman PC/hardware</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-xl">
              <strong className="text-gray-800">⚖️ Otoritas Hukum</strong>
              <p className="text-sm text-gray-600">Hanya jika diminta secara resmi oleh penegak hukum sesuai peraturan yang berlaku</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Cookie Policy</h2>
          <p className="mb-3">Website kami menggunakan cookies untuk:</p>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li><strong>Essential Cookies:</strong> Diperlukan untuk fungsi website (cart, login session)</li>
            <li><strong>Performance Cookies:</strong> Memahami bagaimana pengunjung menggunakan website</li>
            <li><strong>Functional Cookies:</strong> Menyimpan preferensi (bahasa, tema)</li>
            <li><strong>Marketing Cookies:</strong> Untuk personalisasi iklan (opsional, dapat dinonaktifkan)</li>
          </ul>
          <p className="text-sm text-gray-500 mt-3">
            Anda dapat mengelola cookies melalui pengaturan browser Anda.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Hak Anda Sebagai Subjek Data</h2>
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
            <p className="font-semibold text-blue-900 mb-3">Sesuai UU PDP, Anda berhak untuk:</p>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {[
                '🔍 Mengakses data pribadi Anda',
                '✏️ Mengubah/memperbarui data',
                '🗑️ Menghapus data (right to be forgotten)',
                '⛔ Menolak pemrosesan data',
                '📤 Memindahkan data ke layanan lain',
                '❌ Mencabut persetujuan kapan saja',
                '📢 Mengajukan keluhan',
                '💬 Bertanya kepada kami kapan saja',
              ].map((right, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <span>{right}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-700 mt-3">
              Untuk menggunakan hak-hak di atas, hubungi kami di <strong>privacy@pcbeerbeer.com</strong>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">7. Penyimpanan Data</h2>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li><strong>Data Akun:</strong> Disimpan selama akun aktif</li>
            <li><strong>Data Transaksi:</strong> 5 tahun (untuk kepentingan pajak & audit)</li>
            <li><strong>Data Marketing:</strong> Hingga Anda berhenti berlangganan</li>
            <li><strong>Log Sistem:</strong> 90 hari</li>
          </ul>
          <p className="text-sm text-gray-500 mt-3">
            Setelah masa penyimpanan berakhir, data akan dihapus secara permanen dari sistem kami.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">8. Anak di Bawah Umur</h2>
          <p className="text-sm text-gray-600">
            Layanan kami ditujukan untuk pengguna berusia 17 tahun ke atas. Kami tidak secara sengaja mengumpulkan 
            data dari anak di bawah umur. Jika Anda mengetahui ada anak di bawah umur menggunakan layanan kami, 
            silakan hubungi kami untuk segera dihapus.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">9. Perubahan Kebijakan</h2>
          <p className="text-sm text-gray-600">
            Kebijakan privasi ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan kami beritahukan via email 
            atau notifikasi di website. Tanggal "Terakhir diperbarui" di atas menunjukkan versi terkini.
          </p>
        </section>

        <div className="mt-10 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5" /> Kontak Data Protection Officer (DPO)
          </h3>
          <p className="text-sm text-green-800 mb-3">
            Untuk pertanyaan, keluhan, atau permintaan terkait data pribadi Anda:
          </p>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded-xl">
              <strong className="text-green-900">✉️ Email DPO</strong>
              <p className="text-green-700">privacy@pcbeerbeer.com</p>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <strong className="text-green-900">📞 WhatsApp</strong>
              <p className="text-green-700">0812-3456-7890</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-3">
            Kami akan merespons permintaan Anda dalam waktu maksimal <strong>14 hari kerja</strong>.
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
}
