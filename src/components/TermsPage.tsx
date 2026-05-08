import LegalPageLayout from './LegalPageLayout';

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Syarat & Ketentuan"
      subtitle="Ketentuan penggunaan layanan PCBeerBeer"
      icon="terms"
    >
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
            <p className="text-sm text-blue-900">
              <strong>Selamat datang di PCBeerBeer!</strong> Dengan mengakses dan menggunakan website ini, 
              Anda dianggap telah membaca, memahami, dan menyetujui semua syarat dan ketentuan yang berlaku.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Definisi Umum</h2>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li><strong>"Kami"</strong> mengacu pada PCBeerBeer sebagai penyedia layanan.</li>
            <li><strong>"Anda"</strong> mengacu pada pengguna/pembeli yang mengakses website ini.</li>
            <li><strong>"Produk"</strong> mengacu pada software marketing tools, lisensi digital, dan PC Gaming yang dijual.</li>
            <li><strong>"Layanan"</strong> mencakup penjualan, dukungan teknis, dan after-sales service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Pendaftaran & Akun</h2>
          <p className="mb-3">Untuk melakukan transaksi, Anda harus memberikan informasi yang akurat dan lengkap, meliputi:</p>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>Nama lengkap sesuai identitas resmi</li>
            <li>Alamat email aktif (untuk pengiriman lisensi software)</li>
            <li>Nomor WhatsApp aktif (untuk konfirmasi pesanan & support)</li>
            <li>Alamat lengkap (untuk pengiriman PC/hardware)</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            Anda bertanggung jawab penuh atas keakuratan data yang diberikan. Kami tidak bertanggung jawab atas 
            kegagalan pengiriman akibat data yang salah.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Pemesanan & Pembayaran</h2>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2">3.1 Proses Pemesanan</h4>
              <p className="text-sm">Setelah Anda melakukan pemesanan, kami akan mengirimkan konfirmasi via email/WhatsApp. 
              Pesanan dianggap sah setelah pembayaran berhasil dikonfirmasi.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2">3.2 Metode Pembayaran</h4>
              <p className="text-sm mb-2">Kami menerima pembayaran melalui:</p>
              <div className="flex flex-wrap gap-1.5">
                {['Midtrans', 'Xendit', 'Ayolinx', 'Certenz', 'OneBrick', 'BCA VA', 'Mandiri VA', 'BNI VA', 'BRI VA', 'GoPay', 'OVO', 'DANA', 'QRIS', 'ShopeePay', 'Indomaret', 'Alfamart', 'Transfer Manual'].map(m => (
                  <span key={m} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-md">{m}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2">3.3 Harga & Pajak</h4>
              <p className="text-sm">Semua harga yang tercantum dalam Rupiah (IDR) sudah termasuk PPN. 
              Harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu, namun tidak akan mengubah pesanan yang sudah dikonfirmasi.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Pengiriman Produk</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Jenis Produk</th>
                  <th className="text-left p-3 font-semibold">Estimasi Pengiriman</th>
                  <th className="text-left p-3 font-semibold">Metode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3">💬 Software Marketing Tools</td>
                  <td className="p-3">15 menit - 2 jam</td>
                  <td className="p-3">Email & WhatsApp (digital)</td>
                </tr>
                <tr>
                  <td className="p-3">📱 Software Mobile (Android)</td>
                  <td className="p-3">15 menit - 2 jam</td>
                  <td className="p-3">Link download + lisensi</td>
                </tr>
                <tr>
                  <td className="p-3">🖥️ PC Gaming Rakitan</td>
                  <td className="p-3">3-7 hari kerja</td>
                  <td className="p-3">Kurir JNE/J&T/SiCepat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Lisensi Software</h2>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li><strong>Lifetime License:</strong> Lisensi berlaku selamanya untuk 1 device/akun.</li>
            <li><strong>Free Update:</strong> Update software gratis selama produk masih aktif dikembangkan.</li>
            <li><strong>Tidak boleh:</strong> Dijual ulang, di-share, atau di-crack.</li>
            <li><strong>Pelanggaran:</strong> Lisensi dapat dicabut tanpa pengembalian dana jika terbukti melanggar.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Penggunaan yang Dilarang</h2>
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <p className="font-semibold text-red-800 mb-2">⚠️ Anda DILARANG menggunakan produk untuk:</p>
            <ul className="space-y-1 list-disc list-inside ml-2 text-sm text-red-700">
              <li>Spam, scam, atau penipuan online</li>
              <li>Penjualan barang/jasa ilegal</li>
              <li>Aktivitas yang melanggar hukum di Indonesia</li>
              <li>Pelanggaran ketentuan platform (WhatsApp, Telegram, Instagram, dll)</li>
              <li>Tindakan yang merugikan pihak lain</li>
            </ul>
            <p className="mt-3 text-xs text-red-600">
              Kami tidak bertanggung jawab atas konsekuensi hukum dari penyalahgunaan produk.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">7. Garansi & Support</h2>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li><strong>Software:</strong> Free support 24/7 via WhatsApp & Telegram, free update selamanya.</li>
            <li><strong>PC Gaming:</strong> Garansi resmi 1 tahun untuk komponen, 3 bulan untuk service.</li>
            <li><strong>Tidak termasuk garansi:</strong> Kerusakan akibat kelalaian, salah pakai, atau force majeure.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">8. Pembatalan Pesanan</h2>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>Pesanan software <strong>tidak dapat dibatalkan</strong> setelah lisensi dikirimkan.</li>
            <li>Pesanan PC Gaming dapat dibatalkan maksimal <strong>2 jam setelah pembayaran</strong> atau sebelum perakitan dimulai.</li>
            <li>Pembatalan dikenakan biaya admin <strong>5% dari total transaksi</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">9. Batasan Tanggung Jawab</h2>
          <p className="text-sm text-gray-600">
            PCBeerBeer tidak bertanggung jawab atas kerugian tidak langsung, kehilangan keuntungan, kehilangan data, 
            atau kerusakan yang timbul akibat penggunaan produk. Total tanggung jawab kami terbatas pada nilai produk yang dibeli.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">10. Perubahan Syarat & Ketentuan</h2>
          <p className="text-sm text-gray-600">
            Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui website. 
            Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap ketentuan baru.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">11. Hukum yang Berlaku</h2>
          <p className="text-sm text-gray-600">
            Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Setiap sengketa akan diselesaikan secara musyawarah, 
            dan jika tidak tercapai kesepakatan akan diselesaikan melalui Pengadilan Negeri Jakarta Pusat.
          </p>
        </section>

        <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-900">
            <strong>📞 Pertanyaan?</strong> Jika ada hal yang tidak jelas atau membutuhkan klarifikasi terkait syarat & ketentuan, 
            silakan hubungi kami di <strong>WhatsApp: 0812-3456-7890</strong> atau email <strong>cs@pcbeerbeer.com</strong>.
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
}
