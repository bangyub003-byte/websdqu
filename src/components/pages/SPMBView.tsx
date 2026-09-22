import React, { useState } from 'react';
import { ActivePage, SchoolSettings } from '../../types';
import {
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  HelpCircle,
  Phone,
  Sparkles,
  Info
} from 'lucide-react';

interface SPMBViewProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
}

export const SPMBView: React.FC<SPMBViewProps> = ({ setActivePage, settings }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'syarat' | 'faq'>('form');
  const [iframeKey, setIframeKey] = useState(1);
  const [iframeLoading, setIframeLoading] = useState(true);

  const iframeUrl = settings.psbIframeUrl || 'https://psb-sdqu-alitisham.netlify.app';

  const handleRefreshIframe = () => {
    setIframeLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const getWaLink = () => {
    const text = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSaya ingin berkonsultasi mengenai Penerimaan Santri Baru (PSB) di SD Qur'an Unggulan Al I'tisham Playen Gunungkidul. Mohon informasi syarat dan jadwal observasi selanjutnya. Terima kasih.`
    );
    return `https://wa.me/${settings.whatsappSpmb}?text=${text}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      
      {/* HEADER HERO - Ringkas & Proporsional */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div className="bg-emerald-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xl relative overflow-hidden border border-emerald-800/80">
          <div className="relative z-10 max-w-3xl space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-emerald-900 border border-emerald-700/80 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>PENERIMAAN SANTRI BARU (PSB) ONLINE</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
              Pendaftaran Santri Baru {settings.schoolName}
            </h1>

            <p className="text-xs sm:text-xs text-emerald-200/90 leading-relaxed max-w-2xl">
              Portal resmi pendaftaran santri baru. Silakan mengisi formulir online di bawah ini. Tim panitia siap mendampingi ananda bertumbuh dalam keimanan kokoh, hafalan Al-Qur'an mutqin, serta budi pekerti mulia.
            </p>

            {/* Quick Status Pill */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 text-[11px] sm:text-xs">
              <span className="bg-amber-500 text-emerald-950 font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                KUOTA TERBATAS • MAKS. 28 SANTRI/KELAS
              </span>
              <span className="text-emerald-300 font-medium">
                NPSN Resmi: {settings.npsn}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formulir Pendaftaran Online</span>
            </button>

            <button
              onClick={() => setActiveTab('syarat')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'syarat'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Alur, Gelombang &amp; Syarat</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'faq'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tanya Jawab (FAQ)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getWaLink()}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bantuan Panitia WA</span>
            </a>
          </div>
        </div>
      </section>

      {/* TAB 1: FORMULIR PENDAFTARAN RESMI VIA IFRAME */}
      {activeTab === 'form' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Top Info & Action Toolbar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Portal Formulir Penerimaan Santri Baru (PSB)
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>Terhubung langsung ke sistem pendaftaran resmi:</span>
                  <span className="font-mono text-emerald-800 font-semibold">{iframeUrl}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRefreshIframe}
                title="Muat ulang formulir jika koneksi lambat"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <a
                href={iframeUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Buka Layar Penuh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="w-full bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl relative min-h-[780px] sm:min-h-[880px]">
            {iframeLoading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10">
                <div className="w-8 h-8 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-700">Memuat formulir pendaftaran...</p>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={iframeUrl}
              title="Formulir PSB SDQU Al I'tisham Playen"
              className="w-full h-full min-h-[780px] sm:min-h-[880px] border-0"
              onLoad={() => setIframeLoading(false)}
              allow="camera; microphone; geolocation"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          </div>

          {/* Tips Bantuan */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
            <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <p>
              Jika formulir di atas tidak tampil sempurna di perangkat Anda, silakan klik tombol <strong>"Buka Layar Penuh"</strong> atau hubungi panitia pendaftaran melalui nomor WhatsApp resmi:{' '}
              <a
                href={`https://wa.me/${(settings.whatsappSpmb || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold underline text-emerald-900 hover:text-emerald-700"
              >
                {settings.phoneSpmb || settings.whatsappSpmb}
              </a>.
            </p>
          </div>
        </section>
      )}

      {/* TAB 2: GELOMBANG, ALUR & SYARAT */}
      {activeTab === 'syarat' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Alur Pendaftaran */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                TAHAPAN PENDAFTARAN
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Alur Pendaftaran Santri Baru
              </h3>
              <p className="text-xs text-slate-500">
                Proses mudah dan transparan dari pengisian formulir hingga penyambutan santri baru:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
              {(settings.spmbSteps && settings.spmbSteps.length > 0 ? settings.spmbSteps : [
                { id: "step-1", stepNumber: 1, title: "Isi Formulir Online", description: "Mengisi formulir PSB melalui link yang tersedia dan melengkapi biodata dasar santri." },
                { id: "step-2", stepNumber: 2, title: "Konfirmasi Panitia", description: "Konfirmasi pengisian data via WhatsApp panitia untuk penjadwalan observasi." },
                { id: "step-3", stepNumber: 3, title: "Observasi & Pemetaan", description: "Pemetaan fitrah, kesiapan belajar, dan sosialisasi santri bersama para asatidz." },
                { id: "step-4", stepNumber: 4, title: "Wawancara Orang Tua", description: "Penyelarasan visi pendidikan antara orang tua dan madrasah demi tumbuh kembang optimal." },
                { id: "step-5", stepNumber: 5, title: "Daftar Ulang", description: "Verifikasi berkas fisik, pengukuran seragam, dan penerimaan atribut santri baru." }
              ]).map((st, idx) => (
                <div key={st.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-white font-bold text-xs flex items-center justify-center">
                    {st.stepNumber || idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Persyaratan Berkas */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Syarat &amp; Dokumen Kelengkapan Berkas
              </h3>
              <p className="text-xs text-slate-500">
                Berkas diserahkan dalam map folio saat tahapan observasi tatap muka:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              {(settings.spmbRequirements && settings.spmbRequirements.length > 0 ? settings.spmbRequirements : [
                "Fotokopi Akta Kelahiran Calon Santri (2 lembar)",
                "Fotokopi Kartu Keluarga (KK) terbaru (2 lembar)",
                "Fotokopi KTP kedua orang tua / wali (masing-masing 1 lembar)",
                "Pas foto berwarna calon santri ukuran 3x4 (4 lembar)",
                "Fotokopi Ijazah / Surat Keterangan Lulus TK/RA/PAUD",
                "Surat Keterangan Sehat dari Dokter / Fasilitas Kesehatan"
              ]).map((reqText, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>{reqText}</span>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* TAB 3: FAQ */}
      {activeTab === 'faq' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p className="text-xs text-slate-500">
              Jawaban seputar tes observasi, kurikulum tahfidz, dan proses pendaftaran santri baru.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {(settings.spmbFaqs && settings.spmbFaqs.length > 0 ? settings.spmbFaqs : [
              {
                id: "faq-1",
                question: "1. Apakah calon santri harus sudah bisa membaca Al-Qur'an dan Calistung saat mendaftar?",
                answer: "Tidak diwajibkan. Observasi bertujuan untuk memetakan kesiapan psikologis, motorik, dan kebiasaan adab ananda. Tim guru akan membimbing dari nol dengan metode talaqqi yang menyenangkan dan penuh kasih sayang."
              },
              {
                id: "faq-2",
                question: "2. Berapa target hafalan Al-Qur'an di SDQU Al I'tisham Playen?",
                answer: "Target standar kelulusan adalah minimal hafalan mutqin bersanad dengan tartil. Bagi santri dengan potensi akselerasi, disediakan bimbingan khusus untuk mencapai target hafalan yang lebih tinggi."
              },
              {
                id: "faq-3",
                question: "3. Bagaimana jika saya mengalami kendala saat mengisi formulir online?",
                answer: `Ayah/Bunda dapat langsung menghubungi panitia SPMB via WhatsApp di nomor ${settings.phoneSpmb || settings.whatsappSpmb} atau datang langsung ke kantor tata usaha sekolah pada jam kerja (Senin - Kamis pukul 07.15 - 15.30 WIB, Jumat pukul 07.15 - 11.30 WIB).`
              }
            ]).map((faqItem, idx) => (
              <div key={faqItem.id || idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <h4 className="text-sm font-bold text-slate-900">
                  {faqItem.question}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {faqItem.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
