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
import { getOptimizedImageUrl } from '../../utils/imageUtils';

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
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);

  // Form state
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [program, setProgram] = useState('Beasiswa Santri Qur\'an');
  const [amount, setAmount] = useState<number>(100000);
  const [prayer, setPrayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Salin nomor rekening dengan feedback visual "Tersalin!"
  const handleCopyAccount = (text: string, accountId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccountId(accountId);
    setTimeout(() => {
      setCopiedAccountId(null);
    }, 2000);
  };

  // Resolved list of bank accounts (mendukung array baru & fallback kompatibilitas data lama)
  const bankAccounts = (settings.bankAccounts && settings.bankAccounts.length > 0)
    ? settings.bankAccounts
    : [
        ...(settings.bankBsi ? [{
          id: 'bank-bsi',
          bankName: settings.bankBsi.bankName || 'Bank Syariah Indonesia (BSI)',
          accountNumber: settings.bankBsi.accountNumber || '7211-9876-54',
          holderName: settings.bankBsi.holderName || "YAYASAN AL I'TISHAM PLAYEN",
          branch: settings.bankBsi.branch || 'Kantor Cabang Wonosari (Kode: 451)'
        }] : []),
        ...(settings.bankBpd ? [{
          id: 'bank-bpd',
          bankName: settings.bankBpd.bankName || 'Bank BPD DIY Syariah',
          accountNumber: settings.bankBpd.accountNumber || '801-211-009876',
          holderName: settings.bankBpd.holderName || "SDQ UNGGULAN AL I'TISHAM",
          branch: settings.bankBpd.branch || 'Capem Gunungkidul (Kode: 112)'
        }] : [])
      ];

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
    <div className="space-y-5 sm:space-y-7 pb-10">
      
      {/* HEADER SECTION - Ringkas & Padat */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3">
        <div className="max-w-3xl space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{settings.infaqBadge || settings.infaqHeaderTagline || "INFAQ, WAKAF & SEDEKAH PENDIDIKAN"}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
            {settings.infaqTitle || settings.infaqHeaderTitle || "Investasi Abadi untuk Generasi Penghafal Al-Qur'an"}
          </h1>

          <p className="text-slate-600 text-xs sm:text-xs leading-relaxed max-w-2xl">
            {settings.infaqSubtitle || settings.infaqHeaderDesc || "Salurkan infaq dan wakaf terbaik Anda guna mendukung operasional beasiswa santri dhuafa berprestasi, fasilitas halaqah tahfidz, dan sarana dakwah di Playen, Gunungkidul."}
          </p>

          {/* 3 Badge Ringkas */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-600">
            <div className="inline-flex items-center gap-1 bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 rounded-md text-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>100% Saluran Amanah</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 rounded-md text-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Laporan Transparan</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 rounded-md text-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Doa Keberkahan Santri</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: 3 PROGRAM INFAQ UNGGULAN - Ringkas & Padat */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {(settings.infaqPrograms && settings.infaqPrograms.length > 0 ? settings.infaqPrograms : [
            {
              id: "infaq-1",
              title: "Beasiswa Santri Qur'an",
              description: "Bantuan biaya pendidikan, seragam, dan buku untuk santri yatim dan dhuafa berprestasi agar terus lancar menghafal Al-Qur'an.",
              tag: "BEASISWA DHUAFA",
              highlight: "Mulai Rp 50.000 / paket",
              iconType: "scholarship"
            },
            {
              id: "infaq-2",
              title: "Wakaf Sarana & Bangunan",
              description: "Pembangunan dan perluasan ruang kelas baru, perluasan masjid jami' sekolah, serta pengadaan AC ramah lingkungan.",
              tag: "WAKAF JARIYAH",
              highlight: "Pahala Mengalir Abadi",
              iconType: "building"
            },
            {
              id: "infaq-3",
              title: "Operasional Halaqah & Sanad",
              description: "Penyediaan mushaf Al-Qur'an standar Madinah, buku tajwid matan Jazariyyah, serta apresiasi kafalah asatidz pengampu tahfidz.",
              tag: "MUSHAF & ASATIDZ",
              highlight: "Dukungan Rutin Bulanan",
              iconType: "book"
            }
          ]).map((item: any, idx) => {
            const renderIcon = () => {
              if (item.iconType === 'building') return <Building className="w-4 h-4" />;
              if (item.iconType === 'book') return <BookOpen className="w-4 h-4" />;
              return <GraduationCap className="w-4 h-4" />;
            };
            const colors = [
              { bg: "bg-emerald-100", text: "text-emerald-800", badgeBg: "bg-emerald-50", badgeText: "text-emerald-800" },
              { bg: "bg-amber-100", text: "text-amber-800", badgeBg: "bg-amber-50", badgeText: "text-amber-800" },
              { bg: "bg-teal-100", text: "text-teal-800", badgeBg: "bg-teal-50", badgeText: "text-teal-800" }
            ];
            const style = colors[idx % colors.length];
            const displayTag = item.tag || item.badge || "PROGRAM";
            const displayHighlight = item.highlight || item.target || "Salurkan Kebaikan";

            return (
              <div key={item.id || idx} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className={`w-8 h-8 rounded-lg ${style.bg} ${style.text} flex items-center justify-center shrink-0`}>
                    {renderIcon()}
                  </div>
                  <span className={`text-[9px] font-bold ${style.badgeText} uppercase tracking-wide ${style.badgeBg} px-2 py-0.5 rounded`}>
                    {displayTag}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className={`pt-1 text-[11px] font-bold ${style.text} flex items-center gap-1 border-t border-slate-100`}>
                  <span>{displayHighlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: KANAL REKENING & QRIS (Dark Green Theme) - Ringkas & Padat */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-800 space-y-5 sm:space-y-6">
          
          <div className="text-center space-y-1 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-700">
              REKENING RESMI YAYASAN
            </span>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white">
              Kanal Penyaluran Infaq &amp; Wakaf
            </h2>
            <p className="text-[11px] sm:text-xs text-emerald-200/90">
              Seluruh transaksi tercatat dalam pembukuan yayasan secara transparan dan dilaporkan secara berkala.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
            
            {/* Bank Cards (7 cols) - Render dinamis dari array bankAccounts */}
            <div className="lg:col-span-7 space-y-2.5">
              {bankAccounts.length === 0 ? (
                <div className="bg-white/10 rounded-xl p-4 text-center text-emerald-200 text-xs">
                  Belum ada rekening bank yang dikonfigurasi di Admin CMS.
                </div>
              ) : (
                bankAccounts.map((account, idx) => {
                  const isCopied = copiedAccountId === account.id;
                  const accents = [
                    { bg: "bg-teal-800", badge: "text-teal-800 bg-teal-50", label: "INFAQ & WAKAF" },
                    { bg: "bg-purple-900", badge: "text-purple-900 bg-purple-50", label: "OPERASIONAL" },
                    { bg: "bg-emerald-800", badge: "text-emerald-800 bg-emerald-50", label: "PEMBANGUNAN" },
                    { bg: "bg-amber-800", badge: "text-amber-800 bg-amber-50", label: "SOSIAL & DAKWAH" }
                  ];
                  const accent = accents[idx % accents.length];
                  const cleanDigits = (account.accountNumber || '').replace(/[^0-9]/g, '');

                  return (
                    <div key={account.id || idx} className="bg-white text-slate-900 rounded-xl p-3 sm:p-4 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-7 h-7 rounded-md ${accent.bg} text-white flex items-center justify-center font-black text-xs shrink-0`}>
                            <CreditCard className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {account.bankName || 'Bank Rekening'}
                            </div>
                            {account.branch && (
                              <div className="text-[10px] text-slate-500 truncate">
                                {account.branch}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold ${accent.badge} px-2 py-0.5 rounded shrink-0`}>
                          {accent.label}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg flex items-center justify-between gap-2.5">
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-mono font-bold text-slate-900 tracking-wider truncate">
                            {account.accountNumber}
                          </div>
                          <div className="text-[10px] sm:text-xs font-semibold text-slate-600 truncate">
                            a.n. {account.holderName}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyAccount(cleanDigits || account.accountNumber, account.id)}
                          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0 ${
                            isCopied
                              ? 'bg-amber-500 text-emerald-950 font-bold'
                              : 'bg-emerald-900 hover:bg-emerald-800 text-white'
                          }`}
                          title="Salin Nomor Rekening"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">{isCopied ? 'Tersalin!' : 'Salin'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* QRIS Box (5 cols) - Supports Real Uploaded QRIS */}
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-xl text-center space-y-3 border border-slate-100">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[11px] font-extrabold tracking-wider text-emerald-950 uppercase">
                  QRIS STANDAR NASIONAL
                </span>
                <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                  INSTAN
                </span>
              </div>

              {/* QR Image Display */}
              <div className="max-w-[190px] mx-auto bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center justify-center relative shadow-inner">
                {settings.qrisImageUrl ? (
                  <img
                    src={getOptimizedImageUrl(settings.qrisImageUrl)}
                    alt="QRIS SD Qur'an Unggulan Al I'tisham"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-44 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-50 flex flex-col items-center justify-center relative rounded-lg">
                    <QrCode className="w-28 h-28 text-slate-900" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-7 h-7 rounded-md bg-white shadow-md flex items-center justify-center border border-slate-200">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-900" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">
                  {settings.schoolName || "SDQU AL I'TISHAM PLAYEN"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {settings.qrisId || "NMID: ID1023249081721"}
                </div>
                <p className="text-[10px] text-slate-500 pt-0.5 leading-snug">
                  Mendukung seluruh aplikasi mobile banking &amp; e-wallet nasional.
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
                  {(settings.infaqPrograms && settings.infaqPrograms.length > 0 ? settings.infaqPrograms : [
                    { id: '1', title: "Beasiswa Santri Qur'an" },
                    { id: '2', title: "Wakaf Sarana & Bangunan" },
                    { id: '3', title: "Operasional Halaqah & Sanad" }
                  ]).map((progItem) => (
                    <option key={progItem.id || progItem.title} value={progItem.title}>
                      {progItem.title}
                    </option>
                  ))}
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
