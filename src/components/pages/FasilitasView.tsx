import React, { useState } from 'react';
import { ActivePage, FacilityItem, SchoolSettings } from '../../types';
import {
  Building2,
  ShieldCheck,
  Droplets,
  Sparkles,
  TreePine,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Users
} from 'lucide-react';

interface FasilitasViewProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
  facilities: FacilityItem[];
}

export const FasilitasView: React.FC<FasilitasViewProps> = ({
  setActivePage,
  settings,
  facilities
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Ibadah & Tahfidz',
    'Akademik & Sains',
    'Olahraga & Terbuka',
    'Penunjang & Layanan'
  ];

  const filteredFacilities = activeCategory === 'Semua'
    ? facilities
    : facilities.filter(f => f.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(f.category.toLowerCase()));

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              <Building2 className="w-3.5 h-3.5" />
              <span>SARANA &amp; PRASARANA MODERN</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] font-['Plus_Jakarta_Sans',sans-serif]">
              Fasilitas Pendukung Belajar &amp; Tahfidz yang Asri
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Menghadirkan lingkungan belajar yang aman, nyaman, dan sejuk di Playen. Menunjang percepatan hafalan Al-Qur'an, eksplorasi sains, serta kesehatan jasmani santri.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                100%
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Milik Sendiri</div>
                <div className="text-slate-500">Lahan Wakaf Resmi</div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                24/7
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Keamanan Terpadu</div>
                <div className="text-slate-500">CCTV &amp; One Gate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t border-slate-200">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'Semua' ? 'Semua Fasilitas' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* FACILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFacilities.map(fac => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={fac.imageUrl}
                    alt={fac.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-950/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
                    {fac.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
                  <span className="truncate">{fac.features}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: EKOSISTEM BELAJAR HIJAU & RAMAH ANAK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              STANDAR KESELAMATAN &amp; KENYAMANAN
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Ekosistem Belajar Hijau, Aman, dan Ramah Anak di Playen
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kenyamanan lingkungan fisik secara langsung mempengaruhi daya serap ingatan hafalan Al-Qur'an santri dan ketenangan orang tua selama ananda beraktivitas di sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                CCTV 24 Jam &amp; One Gate
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pintu gerbang terpusat dengan pos sekuriti siaga, buku tamu digital, serta kamera pemantau di setiap sudut strategis.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Air Minum Higienis Gratis
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stasiun air minum filtrasi Reverse Osmosis (RO) siap minum bagi seluruh santri, mengurangi sampah botol plastik sekali pakai.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Sanitasi &amp; Toilet Bersih
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kloset duduk ramah anak, wastafel cuci tangan dengan sabun cair antiseptik di setiap lorong, serta pembersihan berkala per 2 jam.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center">
                <TreePine className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Ruang Terbuka Hijau &amp; Asri
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kawasan 100% bebas asap rokok dan polusi kendaraan, dikelilingi pepohonan rindang khas Gunungkidul yang menyejukkan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              KUNJUNGAN LOKASI SEKOLAH
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ingin Melihat Langsung Fasilitas Kami?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
              Kami menyambut hangat kunjungan Ayah, Bunda, dan ananda untuk merasakan langsung suasana belajar yang asri dan tenang di kampus SDQU Al I'tisham Playen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`https://wa.me/${settings.whatsappSpmb}?text=Assalamu'alaikum%20Panitia%20SPMB,%20saya%20ingin%20jadwalkan%20School%20Tour%20ke%20SDQU%20Al%20I'tisham.`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-6 py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Jadwalkan School Tour</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setActivePage('spmb')}
              className="bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700 px-6 py-3 rounded-full text-xs font-bold transition-all"
            >
              Daftar SPMB Online
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
