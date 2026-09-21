import React, { useState } from 'react';
import { ActivePage, SchoolSettings, Announcement, NewsItem } from '../../types';
import { INITIAL_TESTIMONIALS } from '../../data/initialData';
import {
  ArrowRight,
  Play,
  Award,
  Users,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Sparkles,
  MessageCircle,
  Star,
  Quote,
  Megaphone,
  Calendar,
  X
} from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

interface BerandaViewProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
  announcements: Announcement[];
  news: NewsItem[];
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  setActivePage,
  settings,
  announcements,
  news
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const activeAnnouncements = announcements.filter(a => a.isActive);

  // FITUR 1: Array heroImages untuk Slideshow Otomatis dengan fallback heroImageUrl
  const heroImagesList: string[] = React.useMemo(() => {
    if (settings.heroImages && Array.isArray(settings.heroImages) && settings.heroImages.length > 0) {
      const valid = settings.heroImages.filter(img => typeof img === 'string' && img.trim().length > 0);
      if (valid.length > 0) return valid;
    }
    if (settings.heroImageUrl && settings.heroImageUrl.trim().length > 0) {
      return [settings.heroImageUrl];
    }
    return ["https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80"];
  }, [settings.heroImages, settings.heroImageUrl]);

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Otomatis berganti tiap 5 detik dengan transisi fade halus
  React.useEffect(() => {
    if (heroImagesList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroImagesList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImagesList.length]);

  // FITUR 2: Teks Berjalan (Running Text / Marquee)
  const displayRunningText = settings.runningText || (activeAnnouncements.length > 0 ? activeAnnouncements[0].title : "Penerimaan Santri Baru (PSB) Tahun Ajaran 2025/2026 Telah Dibuka! Segera amankan kuota ananda di SD Quran Unggulan Al-I'tisham Playen • Info Layanan SPMB: 0878-9012-3456");
  const isRunningTextVisible = settings.runningTextEnabled !== false && displayRunningText.trim().length > 0;

  return (
    <div className="space-y-6 sm:space-y-10 pb-10">
      {/* FITUR 2: Running Text (Marquee) Bar - Sticky di Bawah Navbar saat Scroll */}
      {isRunningTextVisible && (
        <div className="sticky top-16 sm:top-20 z-40 bg-emerald-950/95 backdrop-blur-md text-emerald-100 py-2 sm:py-2.5 px-3 sm:px-4 text-xs font-medium border-b border-emerald-800/80 shadow-md transition-all">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-500 text-emerald-950 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] tracking-wide shrink-0 shadow-xs">
              <Megaphone className="w-3 h-3" />
              <span>INFO TERKINI</span>
            </div>
            
            <div className="overflow-hidden relative w-full group pause-on-hover">
              <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-xs text-emerald-100">
                <span className="flex items-center gap-3">
                  <span>{displayRunningText}</span>
                  <span className="text-amber-400 font-bold">•</span>
                </span>
                <span className="flex items-center gap-3">
                  <span>{displayRunningText}</span>
                  <span className="text-amber-400 font-bold">•</span>
                </span>
                <span className="flex items-center gap-3">
                  <span>{displayRunningText}</span>
                  <span className="text-amber-400 font-bold">•</span>
                </span>
                <span className="flex items-center gap-3">
                  <span>{displayRunningText}</span>
                  <span className="text-amber-400 font-bold">•</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setActivePage('spmb')}
              className="text-amber-400 hover:text-amber-300 font-bold shrink-0 flex items-center gap-1 text-xs pl-2 border-l border-emerald-800"
            >
              <span>Pelajari</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION - Presisi & Ringkas Vertikal */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white min-h-[320px] sm:min-h-[360px] lg:min-h-[390px] flex items-center p-4 sm:p-6 lg:py-7 lg:px-8 shadow-xl">
          {/* Background images cross-fade slideshow - Foto tetap full-width & lebih jelas terlihat */}
          {heroImagesList.map((imgUrl, idx) => {
            const isActive = idx === currentHeroIndex;
            return (
              <img
                key={`${imgUrl}-${idx}`}
                src={getOptimizedImageUrl(imgUrl, "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80")}
                alt={`Hero Slide ${idx + 1}`}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-40' : 'opacity-0'
                }`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80";
                }}
              />
            );
          })}

          {/* Indikator Slide Foto (jika lebih dari 1 foto) */}
          {heroImagesList.length > 1 && (
            <div className="absolute bottom-3 right-5 z-20 hidden sm:flex items-center gap-1.5 bg-emerald-950/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
              <span className="text-[9px] text-emerald-200 font-bold mr-0.5">Slide</span>
              {heroImagesList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentHeroIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentHeroIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Gradien Overlay Presisi (Foto tetap jelas di kanan, teks tajam kontras di kiri) */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-emerald-950/95 via-emerald-950/75 to-emerald-950/30 pointer-events-none" />

          {/* Hero Content Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center w-full">
            
            {/* Left Headline (7 cols) - Ringkas 1-2 baris */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-3.5">
              {/* Badge Kecil */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-800/80 border border-emerald-600/50 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-emerald-200 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>{settings.heroBadge}</span>
              </div>

              {/* Title - Headline 1-2 baris presisi */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold tracking-tight text-white leading-snug font-['Plus_Jakarta_Sans',sans-serif] break-words">
                {settings.heroHeadline || (
                  <>
                    Mencetak Generasi <span className="text-amber-400">Qur'ani</span>, Berakhlak Mulia &amp; <span className="text-emerald-300">Unggul Prestasi</span>.
                  </>
                )}
              </h1>

              {/* Subtitle - 1 paragraf pendek */}
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl font-normal line-clamp-2 break-words">
                {settings.heroSubtitle}
              </p>

              {/* CTA Buttons - Lebih Ringkas */}
              <div className="pt-0.5 flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setActivePage('spmb')}
                  className="bg-[#d97706] hover:bg-[#b45309] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 transform hover:-translate-y-0.5"
                >
                  <span>Daftar SPMB Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowVideoModal(true)}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/25 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>{settings.heroSecondaryBtnText || "Kenali Selayang Pandang"}</span>
                </button>
              </div>

              {/* Bottom Social Proof Badge - Responsive on mobile */}
              {settings.heroAlumniStat && settings.heroAlumniStat.trim().length > 0 && (
                <div className="pt-1 flex flex-row items-center gap-2 text-[10px] sm:text-xs text-slate-300">
                  <div className="flex -space-x-1 shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-700 border-2 border-emerald-950 flex items-center justify-center font-extrabold text-[7px] sm:text-[8px] text-white shadow-xs" title="Target 30 Juz">
                      30J
                    </div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-600 border-2 border-emerald-950 flex items-center justify-center font-extrabold text-[7px] sm:text-[8px] text-white shadow-xs" title="Akreditasi A Unggul">
                      ★A
                    </div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-600 border-2 border-emerald-950 flex items-center justify-center font-extrabold text-[7px] sm:text-[8px] text-white shadow-xs" title="Rasio 1:12">
                      1:12
                    </div>
                  </div>
                  <span className="font-medium text-emerald-100/90 leading-tight text-[10px] sm:text-xs">
                    {settings.heroAlumniStat}
                  </span>
                </div>
              )}

              {/* Mobile Compact Accreditation Badge */}
              <div className="lg:hidden w-full pt-1">
                <div className="bg-emerald-900/80 border border-emerald-700/60 rounded-xl p-2.5 backdrop-blur-md flex items-center justify-between gap-2.5 text-white shadow-md">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-extrabold text-xs shadow-xs">
                      {settings.heroCardStatNumber || "15+"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                        <span>{settings.heroCardBadge || "AKREDITASI A UNGGUL"}</span>
                        <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded">
                          ★ {settings.heroCardRating || "4.9/5.0"}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-200/90 truncate">
                        {settings.heroCardCurriculumSubtitle || "Kemendikbud • Kemenag • Pesantren"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePage('profil')}
                    className="shrink-0 text-[10px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-colors"
                  >
                    <span>Profil</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Floating Card (5 cols) - Sleek & Compact on Desktop */}
            <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end w-full">
              <div className="bg-white/95 backdrop-blur-sm text-slate-900 rounded-2xl p-4 sm:p-5 shadow-xl border border-white/20 max-w-sm w-full space-y-3 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                
                {/* Accreditation Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-[10px] font-bold tracking-wider text-emerald-900 uppercase">
                      {settings.heroCardBadge || "AKREDITASI A UNGGUL"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-extrabold bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{settings.heroCardRating || "4.9 / 5.0"}</span>
                  </div>
                </div>

                {/* Big Number */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
                      {settings.heroCardStatNumber || "15+"}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-700">
                      {settings.heroCardStatLabel || "Tahun Pengabdian"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {settings.heroCardDescription || "Membangun peradaban mulia dari Playen, menyemaikan tahfidz & hafizhah mutqin berintelektual sains modern sejak tahun 2010."}
                  </p>
                </div>

                {/* Curriculums Integrated Box */}
                <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-emerald-950 truncate">
                      {settings.heroCardCurriculumTitle || "Kurikulum Terintegrasi"}
                    </div>
                    <div className="text-[10px] text-emerald-800 font-medium truncate">
                      {settings.heroCardCurriculumSubtitle || "Kemendikbud • Kemenag • Pesantren"}
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <button
                  onClick={() => setActivePage('profil')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{settings.heroCardButtonText || "Kenali Lebih Dekat Sekolah Kami"}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-800" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS RIBBON (Dark Forest Green #064e3b) */}
      {(() => {
        const stats = [
          {
            icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
            val: settings.heroStatsRibbon?.stat1Val !== undefined ? settings.heroStatsRibbon.stat1Val : "1.200+",
            label: settings.heroStatsRibbon?.stat1Label !== undefined ? settings.heroStatsRibbon.stat1Label : "Santri Aktif & Alumni"
          },
          {
            icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
            val: settings.heroStatsRibbon?.stat2Val !== undefined ? settings.heroStatsRibbon.stat2Val : "100%",
            label: settings.heroStatsRibbon?.stat2Label !== undefined ? settings.heroStatsRibbon.stat2Label : "Target Tahfidz Mutqin"
          },
          {
            icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
            val: settings.heroStatsRibbon?.stat3Val !== undefined ? settings.heroStatsRibbon.stat3Val : "45+",
            label: settings.heroStatsRibbon?.stat3Label !== undefined ? settings.heroStatsRibbon.stat3Label : "Asatidz Bersanad"
          },
          {
            icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
            val: settings.heroStatsRibbon?.stat4Val !== undefined ? settings.heroStatsRibbon.stat4Val : "25+",
            label: settings.heroStatsRibbon?.stat4Label !== undefined ? settings.heroStatsRibbon.stat4Label : "Prestasi Tingkat DIY & Nas"
          }
        ].filter(s => s.val.trim() !== '' || s.label.trim() !== '');

        if (stats.length === 0) return null;

        const gridCols = stats.length === 1 
          ? 'grid-cols-1' 
          : stats.length === 2 
            ? 'grid-cols-2' 
            : stats.length === 3 
              ? 'grid-cols-1 sm:grid-cols-3' 
              : 'grid-cols-2 lg:grid-cols-4';

        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-emerald-950 rounded-2xl sm:rounded-3xl text-white p-6 sm:p-8 shadow-xl">
              <div className={`grid ${gridCols} gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-emerald-900/80`}>
                {stats.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 sm:gap-4 pt-4 first:pt-0 lg:pt-0 lg:px-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-700/50">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                        {item.val}
                      </div>
                      <div className="text-[11px] sm:text-xs text-emerald-300 font-medium">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* WHY CHOOSE US (MENGAPA MEMPERCAYAKAN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Photo & Badges (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img
                src={getOptimizedImageUrl(settings.berandaWhyUsImageUrl, "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80")}
                alt="Pendampingan Santri SDQU Al I'tisham"
                referrerPolicy="no-referrer"
                className="w-full h-[440px] sm:h-[480px] object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80";
                }}
              />
              
              {/* Floating Top Badge */}
              <div className="absolute top-4 right-4 bg-amber-600 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider">
                100% Pendampingan Personal
              </div>

              {/* Floating Bottom Pill */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-emerald-950">
                    Kampus Asri &amp; Hijau
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Playen, Kabupaten Gunungkidul
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Text & 4 Checkpoints (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-700 tracking-wider uppercase">
                NILAI OTENTIK PENDIDIKAN KAMI
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {settings.berandaFeaturesTitle || "Mengapa Ayah & Bunda Mempercayakan Putra–Putrinya di SDQU Al I'tisham?"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {settings.berandaFeaturesSubtitle || "Kami memandang setiap anak sebagai amanah mulia yang memiliki keunikan fitrah. Lingkungan belajar dirancang agar ananda merasa aman, disayangi, dan bersemangat menuntut ilmu."}
              </p>
            </div>

            {/* Feature Points - Editable by Admin */}
            <div className="space-y-3.5 pt-2">
              {(settings.berandaFeatures && settings.berandaFeatures.length > 0 ? settings.berandaFeatures : [
                {
                  id: "feat-1",
                  title: "Guru Tahfidz Bersanad & Berpengalaman",
                  description: "Asatidz telah melalui sertifikasi talaqqi sanad Al-Qur'an dan pelatihan pedagogik anak usia sekolah dasar."
                },
                {
                  id: "feat-2",
                  title: "Mutaba'ah Digital Santri Terkoneksi Real–time",
                  description: "Orang tua dapat memantau capaian hafalan harian, adab, kehadiran, dan kesehatan santri secara transparan via aplikasi wali."
                },
                {
                  id: "feat-3",
                  title: "Rasio Ideal 1:12 untuk Perhatian Optimal",
                  description: "Setiap halaqah tahfidz dan kelas tematik memiliki kuota terbatas agar perkembangan akademis dan karakter terpantau intensif."
                },
                {
                  id: "feat-4",
                  title: "Lingkungan Ramah Anak, Nyaman & Sehat",
                  description: "Terletak di kawasan Playen yang sejuk, jauh dari polusi bising kota, dengan fasilitas lapangan terbuka hijau dan masjid makmur."
                }
              ]).map((feat) => (
                <div key={feat.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-amber-700 tracking-wider uppercase">
            AMANAH &amp; KESAN ORANG TUA
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            {settings.testimonialsTitle || "Apa Kata Para Wali Santri SDQU Al I'tisham"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {settings.testimonialsSubtitle || "Bukti nyata transformasi adab, kecintaan pada Al-Qur'an, dan prestasi akademik yang membanggakan keluarga."}
          </p>
        </div>

        {/* FITUR 2: Testimoni Auto-Scroll Carousel dengan Pause saat Hover */}
        <div className="relative overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 group pause-on-hover">
          {/* Gradient Masks di sisi kiri & kanan */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 animate-carousel w-max">
            {([...(settings.testimonials && settings.testimonials.length > 0 ? settings.testimonials : INITIAL_TESTIMONIALS), ...(settings.testimonials && settings.testimonials.length > 0 ? settings.testimonials : INITIAL_TESTIMONIALS), ...(settings.testimonials && settings.testimonials.length > 0 ? settings.testimonials : INITIAL_TESTIMONIALS)]).map((item, idx) => {
              const displayQuote = item.quote || item.content;
              const displayImg = item.imageUrl || item.avatar;
              const isHttpImg = displayImg && (displayImg.startsWith('http') || displayImg.startsWith('/'));

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-[300px] sm:w-[380px] lg:w-[420px] shrink-0 bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 select-none"
                >
                  <div className="space-y-4">
                    {/* 5 Stars & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-slate-300" />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic line-clamp-4">
                      "{displayQuote}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    {isHttpImg ? (
                      <img
                        src={getOptimizedImageUrl(displayImg, "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80")}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80";
                        }}
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${item.avatarColor || 'bg-emerald-700'} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                        {item.avatar || (item.name ? item.name.substring(0, 2).toUpperCase() : 'WS')}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.role} {item.studentInfo ? `• ${item.studentInfo}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center pt-2 italic">
          *Arahkan kursor atau sentuh kartu testimoni untuk menjeda pergerakan otomatis.
        </p>
      </section>

      {/* CALL TO ACTION BANNER (Dark Green Box) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden border border-emerald-800">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-900 border border-emerald-700 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>{settings.ctaBannerBadge || "GELOMBANG 1 DITUTUP SEGERA"}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {settings.ctaBannerTitle || "Mari Bergabung Bersama Keluarga Besar SDQU Al I'tisham Playen"}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
                {settings.ctaBannerDesc || "Kuota penerimaan santri baru dibatasi demi menjaga rasio pembinaan halaqah yang optimal. Daftarkan putra-putri tercinta hari ini dan amankan kursi belajar mereka."}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => setActivePage('spmb')}
                className="bg-[#d97706] hover:bg-[#b45309] text-white py-3.5 px-6 rounded-full text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{settings.ctaBannerBtnText || "Daftar SPMB Online 2025/2026"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${settings.whatsappSpmb}?text=Assalamu'alaikum%20Panitia%20SPMB%20SDQU%20Al%20I'tisham,%20saya%20ingin%20konsultasi%20pendaftaran.`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-700/80 py-3.5 px-6 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Konsultasi WhatsApp Panitia</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Selayang Pandang / Video Modal Popup */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 max-w-2xl w-full text-white space-y-5 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {settings.heroSecondaryBtnModalTitle || "Selayang Pandang & Profil Singkat SDQU Al I'tisham"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dusun Banaran, Playen, Gunungkidul, DI Yogyakarta
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {settings.heroVideoUrl && settings.heroVideoUrl.trim() !== '' ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center relative">
                <iframe
                  className="w-full h-full"
                  src={settings.heroVideoUrl}
                  title="Profil SDQU Al I'tisham Playen"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-100">
                  <p>
                    {settings.heroSecondaryBtnModalDesc || "SD Quran Unggulan Al-Itisham Playen membina generasi dengan pendidikan akhlak agama Islam, tahfidzul Qur'an, kurikulum terpadu, guru berpengalaman, dan lingkungan belajar kondusif di Banaran, Playen."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <div className="text-amber-400 font-bold text-xs mb-1">Tahfidz Bersanad</div>
                    <div className="text-[11px] text-slate-300">Talaqqi intensif rasio 1:12 dengan target mutqin 3–5 juz.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <div className="text-amber-400 font-bold text-xs mb-1">Karakter Adab</div>
                    <div className="text-[11px] text-slate-300">Pembiasaan sholat Dhuha, birrul walidain, dan budaya santun.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <div className="text-amber-400 font-bold text-xs mb-1">Terakreditasi BAN</div>
                    <div className="text-[11px] text-slate-300">Kurikulum terpadu Kemendikbud &amp; Pesantren yang unggul.</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setActivePage('profil');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowVideoModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
