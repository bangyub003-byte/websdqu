import React, { useState } from 'react';
import { ActivePage, InfaqConfirmation, SchoolSettings } from '../../types';
import { dataService } from '../../services/dataService';
import {
  HeartHandshake,
  CreditCard,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Send,
  MessageCircle,
  GraduationCap,
  Building,
  BookOpen,
  Sparkles,
  Users
} from 'lucide-react';

interface InfaqViewProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
  infaqRecords: InfaqConfirmation[];
}

export const InfaqView: React.FC<InfaqViewProps> = ({
  setActivePage,
  settings,
  infaqRecords
}) => {
  const [copiedBsi, setCopiedBsi] = useState(false);
  const [copiedMuamalat, setCopiedMuamalat] = useState(false);

  // Form state
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [program, setProgram] = useState('Beasiswa Santri Qur\'an');
  const [amount, setAmount] = useState<number>(100000);
  const [prayer, setPrayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleCopy = (text: string, type: 'bsi' | 'muamalat') => {
    navigator.clipboard.writeText(text);
    if (type === 'bsi') {
      setCopiedBsi(true);
      setTimeout(() => setCopiedBsi(false), 2000);
    } else {
      setCopiedMuamalat(true);
      setTimeout(() => setCopiedMuamalat(false), 2000);
    }
  };

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

  const handleSubmitInfaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorPhone || !amount) {
      alert('Mohon lengkapi nama, nomor WhatsApp, dan nominal infaq.');
      return;
    }

    setIsSubmitting(true);

    await dataService.submitInfaq({
      donorName,
      phone: donorPhone,
      amount,
      program,
      bankDestination: 'BSI Yayasan Al I\'tisham',
      transferDate: new Date().toISOString().split('T')[0],
      prayerNotes: prayer || 'Semoga berkah untuk para santri penghafal Al-Qur\'an.'
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Format WhatsApp message to school treasury
    const waText = `Assalamu'alaikum Warahmatullahi Wabarakatuh.%0A%0ASaya telah melakukan infaq/donasi untuk *SDQU Al I'tisham Playen*:%0A- Nama: *${donorName}*%0A- Program: *${program}*%0A- Nominal: *Rp ${amount.toLocaleString('id-ID')}*%0A- Pesan/Doa: _${prayer || 'Semoga bermanfaat'}_%0A%0AMohon berkenan dicatat. Jazaakumullahu khairan.`;
    
    // Prompt WhatsApp redirect
    window.open(`https://wa.me/${settings.whatsappSpmb}?text=${waText}`, '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>INFAQ, WAKAF &amp; SEDEKAH PENDIDIKAN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] font-['Plus_Jakarta_Sans',sans-serif]">
            Investasi Abadi untuk Generasi Penghafal Al-Qur'an
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Salurkan infaq dan wakaf terbaik Anda guna mendukung operasional beasiswa santri dhuafa berprestasi, fasilitas halaqah tahfidz, dan pengembangan sarana dakwah di Playen, Gunungkidul.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Saluran Amanah</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Laporan Keuangan Berkala</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Terdaftar Kemenag DIY</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: 3 PROGRAM INFAQ UNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2.5 py-1 rounded-md">
              BEASISWA DHUAFA
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Beasiswa Santri Qur'an
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bantuan biaya pendidikan, seragam, dan buku untuk santri yatim dan dhuafa berprestasi agar terus lancar menghafal Al-Qur'an.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-900 flex items-center gap-1">
              <span>Mulai Rp 50.000 / paket</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide bg-amber-50 px-2.5 py-1 rounded-md">
              WAKAF JARIYAH
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Wakaf Sarana &amp; Bangunan
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pembangunan dan perluasan ruang kelas baru, perluasan masjid jami' sekolah, serta pengadaan AC ramah lingkungan.
            </p>
            <div className="pt-2 text-xs font-bold text-amber-800 flex items-center gap-1">
              <span>Pahala Mengalir Abadi</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide bg-teal-50 px-2.5 py-1 rounded-md">
              MUSHAF &amp; ASATIDZ
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Operasional Halaqah &amp; Sanad
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Penyediaan mushaf Al-Qur'an standar Madinah, buku tajwid matan Jazariyyah, serta apresiasi kafalah asatidz pengampu tahfidz.
            </p>
            <div className="pt-2 text-xs font-bold text-teal-800 flex items-center gap-1">
              <span>Dukungan Rutin Bulanan</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: KANAL REKENING & QRIS (Dark Green Theme) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-800 space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              REKENING RESMI YAYASAN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Kanal Penyaluran Infaq &amp; Wakaf
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90">
              Seluruh transaksi tercatat dalam pembukuan yayasan secara transparan dan dilaporkan secara berkala.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Bank Cards (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* BSI Card */}
              <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-black text-xs">
                      BSI
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{settings.bankBsi?.bankName || 'Bank Syariah Indonesia (BSI)'}</div>
                      <div className="text-[10px] text-slate-500">{settings.bankBsi?.branch || 'Kode Bank: 451'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                    INFAQ &amp; WAKAF
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-base sm:text-xl font-mono font-bold text-slate-900 tracking-wider truncate">
                      {settings.bankBsi?.accountNumber || '712-345-6789'}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5 truncate">
                      {settings.bankBsi?.holderName || "a.n. YAYASAN AL I'TISHAM PLAYEN"}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy((settings.bankBsi?.accountNumber || '7123456789').replace(/[^0-9]/g, ''), 'bsi')}
                    className="p-2 sm:p-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    title="Salin Nomor Rekening BSI"
                  >
                    {copiedBsi ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedBsi ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Second Bank Card (BPD DIY Syariah / Mitra) */}
              <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-900 text-white flex items-center justify-center font-black text-xs">
                      BPD
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{settings.bankBpd?.bankName || 'Bank BPD DIY Syariah'}</div>
                      <div className="text-[10px] text-slate-500">{settings.bankBpd?.branch || 'Capem Gunungkidul'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md">
                    OPERASIONAL
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-base sm:text-xl font-mono font-bold text-slate-900 tracking-wider truncate">
                      {settings.bankBpd?.accountNumber || '801-211-009876'}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5 truncate">
                      {settings.bankBpd?.holderName || "a.n. SDQ UNGGULAN AL I'TISHAM"}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy((settings.bankBpd?.accountNumber || '801211009876').replace(/[^0-9]/g, ''), 'muamalat')}
                    className="p-2 sm:p-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    title="Salin Nomor Rekening"
                  >
                    {copiedMuamalat ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedMuamalat ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* QRIS Box (5 cols) - Supports Real Uploaded QRIS */}
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl text-center space-y-4 border border-slate-100">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-extrabold tracking-wider text-emerald-950 uppercase">
                  QRIS STANDAR NASIONAL
                </span>
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">
                  INSTAN
                </span>
              </div>

              {/* QR Image Display */}
              <div className="max-w-[240px] mx-auto bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center relative shadow-inner">
                {settings.qrisImageUrl ? (
                  <img
                    src={settings.qrisImageUrl}
                    alt="QRIS SD Qur'an Unggulan Al I'tisham"
                    className="w-full h-auto max-h-56 object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-44 h-44 bg-slate-50 flex flex-col items-center justify-center relative rounded-xl">
                    <QrCode className="w-36 h-36 text-slate-900" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center border border-slate-200">
                        <BookOpen className="w-4 h-4 text-emerald-900" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  {settings.schoolName || "SDQU AL I'TISHAM PLAYEN"}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {settings.qrisId || "NMID: ID1023249081721"}
                </div>
                <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">
                  Mendukung BCA, Mandiri, BSI, BNI, BRI, GoPay, OVO, ShopeePay, DANA, LinkAja &amp; seluruh e-wallet nasional.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: FORMULIR KONFIRMASI INFAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl max-w-3xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              FORMULIR AKAD &amp; KONFIRMASI
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Konfirmasi Donasi &amp; Titipan Doa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Kirimkan bukti dan catatan doa Anda agar para asatidz dan santri dapat mengaminkan kebaikan Anda.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <strong>Alhamdulillah, konfirmasi donasi berhasil dikirim!</strong>
                <p className="text-emerald-800 mt-0.5">
                  Data telah dicatat dalam sistem dan diarahkan ke WhatsApp resmi panitia untuk validasi. Jazaakumullahu khairan.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitInfaq} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nama Donatur / Hamba Allah *
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  placeholder="Contoh: H. Ahmad Subagio / Hamba Allah"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={donorPhone}
                  onChange={e => setDonorPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Pilihan Program Infaq *
                </label>
                <select
                  value={program}
                  onChange={e => setProgram(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none bg-white"
                >
                  <option value="Beasiswa Santri Qur'an">Beasiswa Santri Qur'an</option>
                  <option value="Wakaf Sarana & Bangunan">Wakaf Sarana &amp; Bangunan</option>
                  <option value="Operasional Halaqah & Sanad">Operasional Halaqah &amp; Sanad</option>
                  <option value="Sedekah Subuh & Operasional Umum">Sedekah Subuh &amp; Operasional Umum</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nominal Donasi (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={10000}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Pilihan Cepat Nominal:</span>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map(val => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      amount === val
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Rp {val.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>

            {/* Prayer / Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Pesan / Doa Kebaikan
              </label>
              <textarea
                rows={3}
                value={prayer}
                onChange={e => setPrayer(e.target.value)}
                placeholder="Tuliskan permohonan doa untuk keluarga, almarhum orang tua, atau kelancaran hajat..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#d97706] hover:bg-[#b45309] text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Menyimpan Donasi...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Konfirmasi Infaq &amp; Buka WhatsApp Panitia</span>
                </>
              )}
            </button>

          </form>

        </div>
      </section>

      {/* SECTION 4: RIWAYAT DONATUR TERKINI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            TRANSPARANSI &amp; AKUNTABILITAS
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Doa &amp; Amanah Terkini dari Muhsinin
          </h3>
          <p className="text-xs text-slate-500">
            Semoga Allah membalas dengan keberkahan rezeki, kesehatan, dan surga Firdaus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {infaqRecords.slice(0, 6).map(record => (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {record.donorName}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Rp {record.amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Program: <span className="font-semibold text-slate-700">{record.program}</span>
              </div>
              <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{record.prayerNotes || 'Semoga Allah membalas dengan kebaikan yang berlimpah.'}"
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
