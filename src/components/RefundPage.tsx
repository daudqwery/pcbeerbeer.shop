import LegalPageLayout from './LegalPageLayout';
import { CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCcw, FileText } from 'lucide-react';

export default function RefundPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      subtitle="Kebijakan pengembalian dana yang transparan & adil"
      icon="refund"
    >
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl mb-6">
            <p className="text-sm text-orange-900">
              <strong>💯 Komitmen Kami:</strong> Kepuasan customer adalah prioritas utama kami. Refund Policy ini disusun 
              untuk memberikan kepastian dan keadilan bagi customer dan kami sebagai penjual. Mohon dibaca dengan teliti 
              sebelum melakukan pembelian.
            </p>
          </div>
        </section>

        {/* Quick Overview */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ringkasan Kebijakan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-green-50 border border-green-200 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-green-900 mb-2">100% Refund</h3>
              <p className="text-xs text-green-700">Untuk produk DOA (Death on Arrival), salah kirim, atau cacat produksi PC</p>
            </div>
            <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-2xl">
              <RefreshCcw className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="font-bold text-yellow-900 mb-2">Partial Refund</h3>
              <p className="text-xs text-yellow-700">Pembatalan PC sebelum perakitan (potongan biaya admin 5%)</p>
            </div>
            <div className="p-5 bg-red-50 border border-red-200 rounded-2xl">
              <XCircle className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="font-bold text-red-900 mb-2">No Refund</h3>
              <p className="text-xs text-red-700">Software/lisensi yang sudah dikirim/diaktivasi</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Refund untuk Produk Software</h2>
          <div className="space-y-4">
            <div className="p-5 border-l-4 border-green-500 bg-green-50 rounded-r-xl">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Refund DAPAT diberikan jika:
              </h4>
              <ul className="space-y-2 text-sm text-green-800 list-disc list-inside ml-2">
                <li>Software <strong>tidak bisa dijalankan sama sekali</strong> setelah 3x sesi troubleshoot dengan tim teknis kami</li>
                <li>Lisensi yang dikirim <strong>tidak valid/expired</strong> dan tidak bisa kami perbaiki dalam 48 jam</li>
                <li>Salah kirim produk (kami kirimkan software yang berbeda dari pesanan)</li>
                <li>Pembayaran double/duplikat secara tidak sengaja</li>
              </ul>
            </div>

            <div className="p-5 border-l-4 border-red-500 bg-red-50 rounded-r-xl">
              <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Refund TIDAK BERLAKU jika:
              </h4>
              <ul className="space-y-2 text-sm text-red-800 list-disc list-inside ml-2">
                <li>Lisensi sudah <strong>diaktivasi/digunakan</strong></li>
                <li>Software berjalan normal tetapi <strong>"tidak sesuai ekspektasi"</strong></li>
                <li>Akun/nomor user di-banned platform (WhatsApp, Telegram, IG) karena penyalahgunaan</li>
                <li>Tidak bisa install karena spek device tidak memenuhi syarat (cek spek di halaman produk dulu!)</li>
                <li>Sudah lewat 7 hari sejak tanggal pembelian</li>
                <li>User memberikan informasi palsu/tidak lengkap</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Refund untuk PC Gaming & Hardware</h2>
          <div className="space-y-4">
            <div className="p-5 border border-gray-200 rounded-2xl">
              <h4 className="font-bold text-gray-800 mb-3">📦 Garansi DOA (Death on Arrival)</h4>
              <p className="text-sm text-gray-600 mb-3">
                Jika PC yang Anda terima dalam keadaan mati total atau cacat fungsional dalam <strong>7 hari pertama</strong> setelah diterima:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <div className="text-2xl mb-1">🔄</div>
                  <div className="font-bold text-blue-900 text-sm">Tukar Unit Baru</div>
                  <div className="text-xs text-blue-600">Pengiriman gratis</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl text-center">
                  <div className="text-2xl mb-1">🔧</div>
                  <div className="font-bold text-purple-900 text-sm">Perbaikan Gratis</div>
                  <div className="text-xs text-purple-600">Service prioritas</div>
                </div>
                <div className="p-3 bg-green-50 rounded-xl text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="font-bold text-green-900 text-sm">Refund 100%</div>
                  <div className="text-xs text-green-600">Termasuk ongkir</div>
                </div>
              </div>
            </div>

            <div className="p-5 border border-gray-200 rounded-2xl">
              <h4 className="font-bold text-gray-800 mb-3">⏱️ Pembatalan Sebelum Pengiriman</h4>
              <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Waktu Pembatalan</th>
                    <th className="text-left p-3 font-semibold">Persentase Refund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-green-50">
                    <td className="p-3">Sebelum 2 jam setelah pembayaran</td>
                    <td className="p-3 font-bold text-green-700">100% (full refund)</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="p-3">Sebelum perakitan dimulai</td>
                    <td className="p-3 font-bold text-yellow-700">95% (potong biaya admin 5%)</td>
                  </tr>
                  <tr className="bg-orange-50">
                    <td className="p-3">Setelah perakitan dimulai</td>
                    <td className="p-3 font-bold text-orange-700">75% (potong jasa rakit 25%)</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="p-3">Setelah dikirim</td>
                    <td className="p-3 font-bold text-red-700">Tidak bisa dibatalkan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Cara Mengajukan Refund</h2>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Hubungi Customer Support', desc: 'WhatsApp ke 0812-3456-7890 atau email ke refund@pcbeerbeer.com dalam 7 hari setelah produk diterima.' },
              { step: '2', title: 'Sertakan Bukti & Dokumen', desc: 'Order ID, foto/video produk, screenshot error (untuk software), bukti pembayaran, dan detail keluhan.' },
              { step: '3', title: 'Tim Verifikasi (1-3 hari)', desc: 'Tim kami akan memverifikasi klaim Anda dan menghubungi untuk troubleshoot atau persetujuan refund.' },
              { step: '4', title: 'Persetujuan & Pengembalian', desc: 'Jika disetujui, dana akan dikembalikan ke metode pembayaran asal dalam 3-7 hari kerja.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-orange-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-orange-800">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Waktu Pemrosesan Refund</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { method: '💳 Kartu Kredit', time: '7-14 hari kerja', note: 'Tergantung bank issuer' },
              { method: '🏦 Virtual Account / Transfer Bank', time: '1-3 hari kerja', note: 'Diperlukan no. rekening' },
              { method: '📱 E-Wallet (GoPay, OVO, DANA)', time: '1-2 hari kerja', note: 'Otomatis ke saldo' },
              { method: '📲 QRIS / ShopeePay', time: '1-3 hari kerja', note: 'Via gateway provider' },
              { method: '🏪 Indomaret / Alfamart', time: '3-7 hari kerja', note: 'Manual transfer ke rekening' },
              { method: '🔁 Midtrans / Xendit', time: '3-7 hari kerja', note: 'Sesuai metode asal pembayaran' },
            ].map((item, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl">
                <div className="font-bold text-gray-800">{item.method}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">{item.time}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Biaya yang Dipotong dari Refund</h2>
          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-sm mb-3">Beberapa biaya berikut akan dipotong dari nilai refund:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between p-2 bg-white rounded-lg">
                <span>💼 Biaya admin gateway (Midtrans/Xendit/dll)</span>
                <span className="font-bold text-red-600">Rp 4.000 - 5.500</span>
              </li>
              <li className="flex justify-between p-2 bg-white rounded-lg">
                <span>📦 Ongkos kirim (jika sudah dikirim)</span>
                <span className="font-bold text-red-600">Sesuai tarif</span>
              </li>
              <li className="flex justify-between p-2 bg-white rounded-lg">
                <span>🛠️ Jasa rakit PC (jika sudah dirakit)</span>
                <span className="font-bold text-red-600">25% dari harga PC</span>
              </li>
              <li className="flex justify-between p-2 bg-white rounded-lg">
                <span>📋 Biaya admin (umum)</span>
                <span className="font-bold text-red-600">5%</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              * Tidak berlaku untuk produk DOA atau salah kirim (refund 100%)
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Penolakan Refund</h2>
          <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
            <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Refund DITOLAK jika:
            </h4>
            <ul className="space-y-2 text-sm text-red-800 list-disc list-inside ml-2">
              <li>Produk rusak akibat kelalaian customer (jatuh, terkena air, tegangan listrik tidak stabil, dll)</li>
              <li>Software disalahgunakan untuk hal melanggar hukum</li>
              <li>Bukti tidak lengkap atau dimanipulasi</li>
              <li>Permintaan refund di luar batas waktu (7 hari)</li>
              <li>PC sudah dimodifikasi (overclocking ekstrem, cat ulang, ganti komponen sendiri)</li>
              <li>User tidak kooperatif dalam proses troubleshoot</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">7. Force Majeure</h2>
          <p className="text-sm text-gray-600">
            Refund tidak berlaku untuk kerusakan/kehilangan akibat keadaan kahar (force majeure) seperti bencana alam, 
            kebakaran, perang, kerusuhan, atau peristiwa di luar kendali kami yang menghalangi pelaksanaan kewajiban.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">8. Penggantian / Tukar Produk</h2>
          <p className="text-sm text-gray-600 mb-3">
            Sebagai alternatif refund, Anda dapat mengajukan penggantian/tukar produk dengan ketentuan:
          </p>
          <ul className="space-y-2 list-disc list-inside ml-2 text-sm">
            <li>Produk pengganti dengan nilai yang <strong>sama atau lebih tinggi</strong> (selisih dibayar customer)</li>
            <li>Produk pengganti dengan nilai <strong>lebih rendah</strong> (selisih akan diberikan dalam bentuk voucher belanja)</li>
            <li>Stok produk pengganti tersedia</li>
            <li>Maksimal 1x penggantian per transaksi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">9. Sengketa & Penyelesaian</h2>
          <p className="text-sm text-gray-600 mb-3">
            Jika terjadi perbedaan pendapat terkait refund, kami berkomitmen menyelesaikannya secara musyawarah. 
            Jika tidak tercapai kesepakatan, Anda dapat:
          </p>
          <ol className="space-y-2 list-decimal list-inside ml-2 text-sm">
            <li>Mengajukan mediasi melalui <strong>Badan Penyelesaian Sengketa Konsumen (BPSK)</strong></li>
            <li>Melaporkan ke <strong>YLKI</strong> (Yayasan Lembaga Konsumen Indonesia)</li>
            <li>Mengajukan ke Pengadilan Negeri Jakarta Pusat</li>
          </ol>
        </section>

        <div className="mt-10 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
          <div className="flex items-start gap-4">
            <FileText className="w-10 h-10 text-orange-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-orange-900 mb-2">📞 Pengajuan Refund</h3>
              <p className="text-sm text-orange-800 mb-3">
                Untuk mengajukan refund atau pertanyaan terkait kebijakan ini, hubungi tim kami:
              </p>
              <div className="grid sm:grid-cols-3 gap-2 text-sm">
                <div className="bg-white p-2.5 rounded-xl">
                  <div className="font-bold text-orange-900">📱 WhatsApp</div>
                  <div className="text-orange-700 text-xs">0812-3456-7890</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl">
                  <div className="font-bold text-orange-900">✉️ Email</div>
                  <div className="text-orange-700 text-xs">refund@pcbeerbeer.com</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl">
                  <div className="font-bold text-orange-900">⏰ Jam Operasional</div>
                  <div className="text-orange-700 text-xs">24/7 Online Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
}
