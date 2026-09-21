import React, { useState } from 'react';
import { ActivePage, EventItem, SchoolSettings } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Users,
  Compass,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

interface KegiatanViewProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
  events: EventItem[];
  selectedTab?: 'semua' | 'harian' | 'berkala' | 'ekskul';
  onTabChange?: (tab: 'semua' | 'harian' | 'berkala' | 'ekskul') => void;
}

export const KegiatanView: React.FC<KegiatanViewProps> = ({
  setActivePage,
  settings,
  events,
  selectedTab,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<'semua' | 'harian' | 'berkala' | 'ekskul'>(selectedTab || 'semua');

  React.useEffect(() => {
    if (selectedTab) {
      setActiveTab(selectedTab);
    }
  }, [selectedTab]);

  const handleTabClick = (tab: 'semua' | 'harian' | 'berkala' | 'ekskul') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [showAllAgenda, setShowAllAgenda] = useState(false);

  const uniqueEvents = React.useMemo(() => {
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const result: EventItem[] = [];

    (events || []).forEach((ev, idx) => {
      const id = ev.id || `event-${idx}`;
      const normalizedTitle = (ev.title || '').trim().toLowerCase();

      // Filter duplicate IDs and duplicate titles
      if (!seenIds.has(id) && (!normalizedTitle || !seenTitles.has(normalizedTitle))) {
        seenIds.add(id);
        if (normalizedTitle) seenTitles.add(normalizedTitle);
        result.push({ ...ev, id });
      }
    });

    return result;
  }, [events]);

  const displayedEvents = showAllAgenda ? uniqueEvents : uniqueEvents.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.kegiatanHeaderTagline || "KURIKULUM BERKARAKTER & DINAMIS"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] font-['Plus_Jakarta_Sans',sans-serif]">
              {settings.kegiatanHeaderTitle || "Kegiatan & Eksplorasi Santri Unggulan"}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {settings.kegiatanHeaderDesc || "Menghidupkan adab Qur'ani, kecakapan intelektual, ketahanan fisik, dan kreativitas mandiri melalui pembiasaan harian terpadu dan ragam ekstrakurikuler aplikatif di Playen."}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                12+
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Klub Bakat &amp; Minat</div>
                <div className="text-slate-500">Pilihan Ekskul Santri</div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                100%
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Integrasi Adab</div>
                <div className="text-slate-500">Dipandu Asatidz</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div id="kegiatan-filter-nav" className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t border-slate-200">
          <button
            onClick={() => handleTabClick('semua')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'semua'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua Kegiatan
          </button>
          <button
            onClick={() => handleTabClick('harian')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'harian'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Harian &amp; Mingguan
          </button>
          <button
            onClick={() => handleTabClick('berkala')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'berkala'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Program Unggulan Berkala
          </button>
          <button
            onClick={() => handleTabClick('ekskul')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'ekskul'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Ekstrakurikuler Pilihan
          </button>
        </div>
      </section>

      {/* QUICK STATS RIBBON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 rounded-2xl sm:rounded-3xl text-white p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-emerald-900/80">
            <div className="flex items-center gap-4 pt-4 first:pt-0 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {settings.kegiatanStatsRibbon?.stat1Val || (settings as any).kegiatanStats?.stat1Val || "07.00"}
                </div>
                <div className="text-xs text-emerald-300">
                  {settings.kegiatanStatsRibbon?.stat1Label || (settings as any).kegiatanStats?.stat1Label || "Mulai Halaqah Pagi"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {settings.kegiatanStatsRibbon?.stat2Val || (settings as any).kegiatanStats?.stat2Val || "30 Juz"}
                </div>
                <div className="text-xs text-emerald-300">
                  {settings.kegiatanStatsRibbon?.stat2Label || (settings as any).kegiatanStats?.stat2Label || "Bimbingan Tajwid Sanad"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {settings.kegiatanStatsRibbon?.stat3Val || (settings as any).kegiatanStats?.stat3Val || "100%"}
                </div>
                <div className="text-xs text-emerald-300">
                  {settings.kegiatanStatsRibbon?.stat3Label || (settings as any).kegiatanStats?.stat3Label || "Praktik Lapangan Sunnah"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {settings.kegiatanStatsRibbon?.stat4Val || (settings as any).kegiatanStats?.stat4Val || "24/7"}
                </div>
                <div className="text-xs text-emerald-300">
                  {settings.kegiatanStatsRibbon?.stat4Label || (settings as any).kegiatanStats?.stat4Label || "Pendampingan Karakter"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: KEGIATAN HARIAN & MINGGUAN */}
      {(activeTab === 'semua' || activeTab === 'harian') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 bg-emerald-800 rounded-full"></span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Kegiatan Harian &amp; Mingguan Santri
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Rutinitas pembentukan kedisiplinan, ibadah wajib &amp; sunnah, dan tahfidz berkelanjutan.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Rutin Sekolah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {((settings.dailyActivities && settings.dailyActivities.length > 0)
              ? settings.dailyActivities
              : (settings.kegiatanHarianList && settings.kegiatanHarianList.length > 0
                ? settings.kegiatanHarianList
                : [
                  {
                    id: "harian-1",
                    title: "Sholat Dhuha & Berjamaah Terbimbing",
                    desc: "Pembiasaan shalat sunnah Dhuha setiap pagi serta shalat Dzuhur & Ashar berjamaah dengan adab masjid lengkap.",
                    badge: "IBADAH",
                    time: "Setiap Hari (07.15 & Dzuhur)",
                    imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=600&q=80"
                  },
                  {
                    id: "harian-2",
                    title: "Halaqah Tahfidz & Talaqqi Pagi",
                    desc: "Metode setoran hafalan baru (ziyadah) dengan rasio 1 ustadz mendampingi maksimal 10–12 santri secara intensif.",
                    badge: "TAHFIDZ",
                    time: "Senin – Jumat (07.30 – 08.45)",
                    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                  },
                  {
                    id: "harian-3",
                    title: "Kultum Dhuha & Muroja'ah Akbar",
                    desc: "Latihan public speaking santri bergiliran membawakan nasihat hadits singkat, dilanjutkan muroja'ah bersama satu juz.",
                    badge: "KARAKTER",
                    time: "Jumat Pagi (07.15 – 08.15)",
                    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
                  }
                ])
            ).map((item: any) => {
              const displayImg = getOptimizedImageUrl(item.imageUrl, "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80");
              const displayTime = item.time || item.timeSchedule;
              const displayDesc = item.desc || item.description;
              const displayBadge = item.badge || item.category || "KEGIATAN";

              return (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={displayImg}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                      {displayBadge}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <h4 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {displayDesc}
                    </p>
                    {displayTime && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-emerald-800" />
                        <span>{displayTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: PROGRAM UNGGULAN BERKALA */}
      {(activeTab === 'semua' || activeTab === 'berkala') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 bg-amber-600 rounded-full"></span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Program Unggulan Berkala
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Pengalaman transformatif luar kelas untuk melatih kemandirian, ukhuwah, dan eksplorasi alam.
              </p>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Agenda Spesial
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {((settings.periodicPrograms && settings.periodicPrograms.length > 0)
              ? settings.periodicPrograms
              : (settings.kegiatanBerkalaList && settings.kegiatanBerkalaList.length > 0
                ? settings.kegiatanBerkalaList
                : [
                  {
                    id: "berkala-1",
                    title: "Mukhayyam Al-Qur'an",
                    desc: "Karantina intensif 3 hari di alam terbuka Playen untuk akselerasi kelancaran mutqin.",
                    badge: "TAHFIDZ CAMP",
                    time: "1x Tiap Semester",
                    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80"
                  },
                  {
                    id: "berkala-2",
                    title: "Market Day Entrepreneur",
                    desc: "Praktik muamalah Islami, kejujuran timbangan, literasi keuangan dasar, dan sedekah.",
                    badge: "WIRAUSAHA",
                    time: "Tengah Semester",
                    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=500&q=80"
                  },
                  {
                    id: "berkala-3",
                    title: "Outing Class & Tadabbur Alam",
                    desc: "Kunjungan edukasi riset ke kawasan geopark, hutan Wanagama, serta sentra sains.",
                    badge: "RISET ALAM",
                    time: "Setiap Akhir Tema",
                    imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=500&q=80"
                  },
                  {
                    id: "berkala-4",
                    title: "Peringatan PHBI & Baksos",
                    desc: "Penyembelihan qurban santri, festival Muharram, pembagian sembako dhuafa sekitar Playen.",
                    badge: "SOSIAL",
                    time: "Kalender Hijriah",
                    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80"
                  }
                ])
            ).map((item: any) => {
              const displayImg = getOptimizedImageUrl(item.imageUrl, "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80");
              const displayTime = item.time || item.timeSchedule;
              const displayDesc = item.desc || item.description;
              const displayBadge = item.badge || item.category || "AGENDA";

              return (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <img
                      src={displayImg}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80";
                      }}
                    />
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                        {displayBadge}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>
                  </div>
                  {displayTime && (
                    <div className="p-5 pt-0 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                      <span>{displayTime}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: EKSTRAKURIKULER PILIHAN BAKAT & MINAT */}
      {(activeTab === 'semua' || activeTab === 'ekskul') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 bg-teal-800 rounded-full"></span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Ekstrakurikuler Pilihan Bakat &amp; Minat
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Mewadahi ketangkasan jasmani sunnah, logika teknologi abad 21, seni Islam, dan bahasa asing.
              </p>
            </div>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Peminatan Santri
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {((settings.extracurriculars && settings.extracurriculars.length > 0)
              ? settings.extracurriculars
              : (settings.kegiatanEkskulList && settings.kegiatanEkskulList.length > 0
                ? settings.kegiatanEkskulList
                : [
                  {
                    id: "ekskul-1",
                    title: "Panahan Tradisional & Horsebow",
                    desc: "Olahraga sunnah melatih fokus, kekuatan lengan, ketenangan napas, dan adab ksatria muslim.",
                    badge: "OLAHRAGA SUNNAH",
                    time: "Sabtu Pagi (08.00 - 10.00)",
                    imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=500&q=80"
                  },
                  {
                    id: "ekskul-2",
                    title: "Pencak Silat Tapak Suci",
                    desc: "Bela diri prestasi dan pembinaan fisik mental dengan akhlak mulia serta ketahanan santri.",
                    badge: "BELA DIRI",
                    time: "Kamis Sore (15.30 - 17.00)",
                    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80"
                  },
                  {
                    id: "ekskul-3",
                    title: "Khat & Kaligrafi Al-Qur'an",
                    desc: "Seni menulis indah mushaf khat Naskhi dan Riq'ah bersama khattat berpengalaman.",
                    badge: "SENI ISLAM",
                    time: "Rabu Sore (15.30 - 16.45)",
                    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=500&q=80"
                  }
                ])
            ).map((ekskul: any) => {
              const displayImg = getOptimizedImageUrl(ekskul.imageUrl, "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=500&q=80");
              const displayTitle = ekskul.title || ekskul.name;
              const displayDesc = ekskul.desc || ekskul.description;
              const displayBadge = ekskul.badge || ekskul.category || "EKSKUL";
              const displaySchedule = ekskul.time || ekskul.schedule || ekskul.timeSchedule;

              return (
                <div key={ekskul.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-100">
                      <img
                        src={displayImg}
                        alt={displayTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-emerald-900/90 text-amber-300 text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                        {displayBadge}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {displayTitle}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{displaySchedule || "Program Ekstrakurikuler Pilihan"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 4: AGENDA KEGIATAN SEMESTER BERJALAN (KALENDER AKADEMIK) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              KALENDER AKADEMIK 2025
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {settings.kegiatanDownloadTitle || "Agenda Kegiatan Semester Berjalan"}
            </h3>
            <p className="text-xs text-slate-500">
              {settings.kegiatanDownloadDesc || "Jadwal kegiatan penting santri SDQU Al I'tisham Playen semester genap."}
            </p>
          </div>

          <a
            href={settings.kegiatanDownloadFileUrl || "#unduh"}
            target={settings.kegiatanDownloadFileUrl ? "_blank" : undefined}
            rel="noreferrer"
            onClick={(e) => {
              if (!settings.kegiatanDownloadFileUrl) {
                e.preventDefault();
                alert('Mengunduh Jadwal Kalender Akademik SDQU Al I\'tisham TA 2024/2025...');
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-900 hover:text-emerald-700 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-full shadow-xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{settings.kegiatanDownloadBtnText || "Unduh Kalender Format PDF"}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedEvents.map((event, idx) => (
            <div
              key={`${event.id}-${idx}`}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-800/40 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {event.month}
                  </span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {event.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span>{event.dateRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {uniqueEvents.length > 4 && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowAllAgenda(!showAllAgenda)}
              className="px-6 py-2.5 rounded-full border border-emerald-800/80 hover:bg-emerald-900 hover:text-white text-emerald-900 text-xs font-bold transition-all shadow-xs flex items-center gap-2 bg-white"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{showAllAgenda ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Agenda (${uniqueEvents.length})`}</span>
            </button>
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              KOLABORASI ORANG TUA &amp; SEKOLAH
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ingin Mengetahui Jadwal Khusus atau Kunjungan Ekstrakurikuler?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
              Ayah dan Bunda dipersilakan mengamati langsung jalannya halaqah Al-Qur'an dan latihan ekskul pada sesi Open Class hari Sabtu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setActivePage('spmb')}
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-6 py-3 rounded-full text-xs font-bold shadow-md transition-all"
            >
              Daftar SPMB Online
            </button>
            <a
              href={`https://wa.me/${settings.whatsappSpmb}`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700 px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Tanya Koordinator Ekskul</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
