import React, { useState } from 'react';
import { ActivePage, FacilityItem, SchoolSettings } from '../../types';
import {
  Building2,
  ShieldCheck,
  Droplets,
  Sparkles,
  TreePine,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

interface FasilitasViewProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
  facilities: FacilityItem[];
  selectedCategory?: 'semua' | 'ibadah' | 'belajar' | 'olahraga';
  onCategoryChange?: (category: 'semua' | 'ibadah' | 'belajar' | 'olahraga') => void;
}

export const FasilitasView: React.FC<FasilitasViewProps> = ({
  setActivePage,
  settings,
  facilities,
  selectedCategory,
  onCategoryChange
}) => {
  const [internalCategory, setInternalCategory] = useState<'semua' | 'ibadah' | 'belajar' | 'olahraga'>('semua');
  const activeCategory = selectedCategory ?? internalCategory;

  const handleCategorySelect = (cat: 'semua' | 'ibadah' | 'belajar' | 'olahraga') => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  // 3 Category Intros (fully customizable from settings)
  const categorySections = [
    {
      id: 'ibadah' as const,
      num: '01',
      title: settings.facilityCat1Title || "Sarana Ibadah & Al-Qur'an",
      desc: settings.facilityCat1Desc || "Pusat pembinaan ruhiyah santri berupa masjid yang sejuk dan bersih, area wudhu higienis terpisah ikhwan-akhwat, serta ruang halaqah tahfidzul Qur'an yang kondusif untuk kelancaran talaqqi dan muroja'ah.",
      image: settings.facilityCat1Image || "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <Compass className="w-4 h-4 text-emerald-700" />,
      filter: (f: FacilityItem) => {
        const cat = (f.category || '').toLowerCase();
        return cat.includes('ibadah') || cat.includes('masjid') || cat.includes('qur');
      }
    },
    {
      id: 'belajar' as const,
      num: '02',
      title: settings.facilityCat2Title || "Ruang Belajar & Pembiasaan",
      desc: settings.facilityCat2Desc || "Ruang kelas representatif dengan ventilasi optimal dan pencahayaan asri, laboratorium komputer untuk literasi digital santri, aula serbaguna, serta media peraga pembelajaran konkret dan interaktif.",
      image: settings.facilityCat2Image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <BookOpen className="w-4 h-4 text-amber-700" />,
      filter: (f: FacilityItem) => {
        const cat = (f.category || '').toLowerCase();
        return cat.includes('kelas') || cat.includes('belajar') || cat.includes('lab') || cat.includes('aula') || cat.includes('perpustakaan');
      }
    },
    {
      id: 'olahraga' as const,
      num: '03',
      title: settings.facilityCat3Title || "Olahraga, Seni & Pendukung",
      desc: settings.facilityCat3Desc || "Halaman terbuka hijau yang luas untuk apel, olahraga futsal, latihan memanah sunnah, kepanduan Hizbul Wathan/Pramuka, serta ekosistem lingkungan asri ramah anak yang bebas polusi.",
      image: settings.facilityCat3Image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      icon: <HeartHandshake className="w-4 h-4 text-teal-700" />,
      filter: (f: FacilityItem) => {
        const cat = (f.category || '').toLowerCase();
        return cat.includes('olahraga') || cat.includes('halaman') || cat.includes('kesehatan') || cat.includes('pendukung');
      }
    }
  ];

  // Helper to get facilities for a category
  const getFacilitiesForCategory = (catId: 'ibadah' | 'belajar' | 'olahraga') => {
    const sec = categorySections.find(s => s.id === catId);
    if (!sec) return [];
    
    // Matched items
    const matched = facilities.filter(sec.filter);
    
    // If it's the last category and there are unassigned facilities, append them gracefully
    if (catId === 'olahraga') {
      const allAssignedIds = new Set(
        categorySections.flatMap(s => facilities.filter(s.filter).map(f => f.id))
      );
      const unassigned = facilities.filter(f => !allAssignedIds.has(f.id));
      return [...matched, ...unassigned];
    }

    return matched;
  };

  const displayedSections = activeCategory === 'semua'
    ? categorySections
    : categorySections.filter(s => s.id === activeCategory);

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* HEADER SECTION */}
      <section id="fasilitas-header-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              <Building2 className="w-3.5 h-3.5" />
              <span>{settings.fasilitasBadge || settings.fasilitasHeaderTagline || "SARANA & PRASARANA MODERN"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] font-['Plus_Jakarta_Sans',sans-serif]">
              {settings.fasilitasTitle || settings.fasilitasHeaderTitle || "Fasilitas Pendukung Belajar & Tahfidz yang Asri"}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {settings.fasilitasSubtitle || settings.fasilitasHeaderDesc || "Menghadirkan lingkungan belajar yang aman, nyaman, dan sejuk di Playen. Menunjang percepatan hafalan Al-Qur'an, eksplorasi sains, serta kesehatan jasmani santri."}
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                {settings.fasilitasStat1Val || "100%"}
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">{settings.fasilitasStat1Label || "Milik Sendiri"}</div>
                <div className="text-slate-500">{settings.fasilitasStat1Sub || "Lahan Wakaf Resmi"}</div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                {settings.fasilitasStat2Val || "24/7"}
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">{settings.fasilitasStat2Label || "Keamanan Terpadu"}</div>
                <div className="text-slate-500">{settings.fasilitasStat2Sub || "CCTV & One Gate"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t border-slate-200">
          <button
            onClick={() => handleCategorySelect('semua')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'semua'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua Fasilitas ({facilities.length})
          </button>
          {categorySections.map(sec => {
            const count = getFacilitiesForCategory(sec.id).length;
            const isSelected = activeCategory === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleCategorySelect(sec.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{sec.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CATEGORY SECTIONS WITH INTROS & CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {displayedSections.map(sec => {
          const catFacilities = getFacilitiesForCategory(sec.id);
          return (
            <section
              key={sec.id}
              id={`fasilitas-cat-${sec.id}`}
              className="scroll-mt-28 space-y-8 bg-slate-50/70 p-6 sm:p-10 rounded-3xl border border-slate-200/80"
            >
              {/* Category Intro Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Kategori {sec.num}
                    </span>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span className="text-xs font-bold text-slate-500">{catFacilities.length} Sarana Tersedia</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    {sec.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                {/* Category Feature Image Banner */}
                {sec.image && (
                  <div className="w-full lg:w-72 h-36 rounded-2xl overflow-hidden shadow-xs border border-slate-200 shrink-0 relative group">
                    <img
                      src={getOptimizedImageUrl(sec.image)}
                      alt={sec.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-3">
                      <span className="text-[11px] font-bold text-white tracking-wide">
                        {sec.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid of Facility Cards for This Category */}
              {catFacilities.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                  Belum ada fasilitas terdaftar pada kategori ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catFacilities.map(fac => {
                    const title = fac.name || (fac as any).title || "Fasilitas Kampus";
                    const categoryLabel = fac.categoryLabel || fac.category || "Fasilitas";
                    const specsList = Array.isArray(fac.specs) 
                      ? fac.specs 
                      : typeof (fac as any).features === 'string'
                        ? [(fac as any).features]
                        : [];

                    return (
                      <div
                        key={fac.id}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-48 bg-slate-100 overflow-hidden">
                            <img
                              src={getOptimizedImageUrl(fac.imageUrl, "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80")}
                              alt={title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80";
                              }}
                            />
                            <span className="absolute top-3 left-3 bg-emerald-950/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
                              {categoryLabel}
                            </span>
                            {fac.capacity && (
                              <span className="absolute bottom-3 right-3 bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                                {fac.capacity}
                              </span>
                            )}
                          </div>

                          <div className="p-5 space-y-2">
                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                              {title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                              {fac.description}
                            </p>
                          </div>
                        </div>

                        {/* Specs & Features List */}
                        <div className="p-5 pt-0 space-y-2">
                          {specsList.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 space-y-1.5">
                              {specsList.slice(0, 3).map((spec, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-emerald-900">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">{spec}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* SECTION: EKOSISTEM BELAJAR HIJAU & RAMAH ANAK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              {settings.fasilitasEcoBadge || "STANDAR KESELAMATAN & KENYAMANAN"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              {settings.fasilitasEcoTitle || "Ekosistem Belajar Hijau, Aman, dan Ramah Anak di Playen"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {settings.fasilitasEcoSubtitle || settings.fasilitasEcoDesc || "Kenyamanan lingkungan fisik secara langsung mempengaruhi daya serap ingatan hafalan Al-Qur'an santri dan ketenangan orang tua selama ananda beraktivitas di sekolah."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {((settings.fasilitasEcoItems && settings.fasilitasEcoItems.length > 0)
              ? settings.fasilitasEcoItems
              : [
                  {
                    id: "eco-1",
                    title: "CCTV 24 Jam & One Gate",
                    description: "Pintu gerbang terpusat dengan pos sekuriti siaga, buku tamu digital, serta kamera pemantau di setiap sudut strategis."
                  },
                  {
                    id: "eco-2",
                    title: "Air Minum Higienis Gratis",
                    description: "Stasiun air minum filtrasi Reverse Osmosis (RO) siap minum bagi seluruh santri, mengurangi sampah botol plastik sekali pakai."
                  },
                  {
                    id: "eco-3",
                    title: "Sanitasi & Toilet Bersih",
                    description: "Kloset duduk ramah anak, wastafel cuci tangan dengan sabun cair antiseptik di setiap lorong, serta pembersihan berkala per 2 jam."
                  },
                  {
                    id: "eco-4",
                    title: "Ruang Terbuka Hijau & Asri",
                    description: "Kawasan 100% bebas asap rokok dan polusi kendaraan, dikelilingi pepohonan rindang khas Gunungkidul yang menyejukkan."
                  }
                ]
            ).map((item, idx) => {
              const icons = [
                <ShieldCheck key="1" className="w-5 h-5" />,
                <Droplets key="2" className="w-5 h-5" />,
                <Sparkles key="3" className="w-5 h-5" />,
                <TreePine key="4" className="w-5 h-5" />
              ];
              const colors = [
                "bg-emerald-100 text-emerald-800",
                "bg-teal-100 text-teal-800",
                "bg-amber-100 text-amber-800",
                "bg-green-100 text-green-800"
              ];
              return (
                <div key={item.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className={`w-10 h-10 rounded-xl ${colors[idx % colors.length]} flex items-center justify-center`}>
                    {icons[idx % icons.length]}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
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
