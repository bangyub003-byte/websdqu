import React from 'react';
import { ActivePage, SchoolSettings, TeacherItem } from '../../types';
import {
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Sparkles,
  Compass,
  Heart,
  Scale,
  Target,
  ArrowRight,
  MessageCircle,
  FileCheck2,
  Building,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

interface ProfilViewProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
  teachers: TeacherItem[];
}

export const ProfilView: React.FC<ProfilViewProps> = ({
  setActivePage,
  settings,
  teachers
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            <BookOpen className="w-3.5 h-3.5" />
            <span>PROFIL LEMBAGA • {settings.schoolName}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] font-['Plus_Jakarta_Sans',sans-serif]">
            Mendidik Generasi Qur'ani Berkarakter Shahabat di Jantung Playen
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {settings.shortProfile || settings.subTagline}
          </p>
        </div>

        {/* HERO IMAGE BANNER */}
        <div className="mt-8 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
          <img
            src={getOptimizedImageUrl(settings.profileBannerImageUrl, "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80")}
            alt={`Kampus ${settings.schoolName}`}
            referrerPolicy="no-referrer"
            className="w-full h-[320px] sm:h-[460px] object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold text-emerald-950 shadow-lg">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>Tahfidzul Qur'an &amp; Pembiasaan Adab</span>
            </div>

            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold text-emerald-950 shadow-lg">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Akreditasi: {settings.accreditation} • NPSN: {settings.npsn}</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS RIBBON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 rounded-2xl sm:rounded-3xl text-white p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-emerald-900/80">
            
            <div className="flex items-center gap-4 pt-4 first:pt-0 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">380+</div>
                <div className="text-xs text-emerald-300">Santri Aktif Terdaftar</div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-emerald-300">Pembinaan Akhlak &amp; Ibadah</div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{teachers.length || 28}+</div>
                <div className="text-xs text-emerald-300">Asatidz &amp; Pendidik Berpengalaman</div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{settings.achievements?.length || 9}+</div>
                <div className="text-xs text-emerald-300">Capaian Prestasi ASPD, MTQ, O2SN</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEJARAH & LATAR BELAKANG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Photos Grid (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
                alt="Kegiatan Pembelajaran"
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 mt-6">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                alt="Halaqah Al-Qur'an"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>

          {/* History Text (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              LATAR BELAKANG &amp; SEJARAH
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Sejarah {settings.schoolName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {settings.historyPart1}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {settings.historyPart2}
            </p>
            {settings.historyPart3 && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {settings.historyPart3}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold text-emerald-950">Lingkungan Belajar Asri</div>
                <div className="text-[11px] text-slate-500 mt-1">Jauh dari kebisingan kota, mendukung kekhusyukan halaqah santri.</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold text-emerald-950">Kurikulum Pendidikan Terpadu</div>
                <div className="text-[11px] text-slate-500 mt-1">Mengintegrasikan kurikulum nasional dan nilai-nilai Al-Qur'an serta As-Sunnah.</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VISI & MISI SEKOLAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              ARAH PERJUANGAN PENDIDIKAN
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Visi &amp; Misi Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Pijakan kokoh dalam setiap kurikulum, keteladanan pendidik, serta pembiasaan harian santri di lingkungan madrasah.
            </p>
          </div>

          {/* Visi Highlight Banner (Emerald) */}
          <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden border border-emerald-800 text-center space-y-3">
            <span className="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase bg-emerald-900/80 px-4 py-1.5 rounded-full border border-emerald-700 inline-block">
              VISI UTAMA LEMBAGA
            </span>
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white max-w-3xl mx-auto leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
              "{settings.vision}"
            </blockquote>
          </div>

          {/* Misi Strategis */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">
              {settings.missions?.length || 4} Misi Strategis Lembaga:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.missions?.map((misi, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-emerald-800 font-extrabold text-xs bg-emerald-100 px-2.5 py-1 rounded-md">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {misi}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 7 PROGRAM UNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 border border-emerald-800 shadow-xl space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              KEUNGGULAN MADRASAH
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              7 Program Unggulan {settings.schoolName}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              Fokus pendidikan terpadu yang dirancang untuk membangun pondasi keimanan, kecerdasan nalar, dan keteladanan akhlak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.featuredPrograms?.map((program, idx) => (
              <div key={idx} className="bg-emerald-900/60 border border-emerald-800 p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 font-extrabold text-xs flex items-center justify-center">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {program}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESTASI SEKOLAH & SISWA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-amber-700 tracking-wider uppercase">
            REKAM JEJAK KEBERHASILAN
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Prestasi Sekolah &amp; Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Bukti nyata ikhtiar dan dedikasi santri bersama para asatidz di tingkat Kapanewon hingga Kabupaten.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.achievements?.map((ach) => (
            <div key={ach.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between overflow-hidden">
              <div className="space-y-3">
                {/* Optional Thumbnail Image */}
                {ach.imageUrl && (
                  <div className="w-full h-44 -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={ach.imageUrl}
                      alt={ach.category}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    ach.category === 'ASPD' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                    ach.category === 'MTQ' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    ach.category === 'O2SN' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {ach.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Tahun {ach.year}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {ach.category} {ach.year}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                {ach.kapanewon && (
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span className="text-slate-500">Kapanewon Playen:</span>
                    <span className="text-emerald-800 font-bold">{ach.kapanewon}</span>
                  </div>
                )}
                {ach.kabupaten && (
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span className="text-slate-500">Kab. Gunungkidul:</span>
                    <span className="text-amber-700 font-bold">{ach.kabupaten}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 NILAI POKOK (CORE VALUES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-amber-700 tracking-wider uppercase">
            LANDASAN NILAI KARAKTER
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            {settings.coreValuesTitle || "4 Nilai Pokok (Core Values)"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {settings.coreValuesSubtitle || "Membimbing setiap tindak tanduk peserta didik, pengajar, dan tenaga kependidikan dalam keseharian madrasah."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(settings.coreValues && settings.coreValues.length > 0 ? settings.coreValues : [
            {
              id: "val-1",
              number: "NILAI 01",
              title: "Al-I'tisham (Keteguhan)",
              description: "Berpegang teguh pada syariat agama Allah (Al-Qur'an & Sunnah) dalam segala kondisi zaman dengan penuh keyakinan dan kemantapan hati.",
              color: "emerald"
            },
            {
              id: "val-2",
              number: "NILAI 02",
              title: "Al-Itqan (Profesionalisme)",
              description: "Menyelesaikan setiap tugas dan hafalan dengan tuntas, rapi, presisi, dan berusaha memberikan hasil karya terbaik di setiap kesempatan.",
              color: "amber"
            },
            {
              id: "val-3",
              number: "NILAI 03",
              title: "Al-Amanah (Integritas)",
              description: "Kejujuran dan tanggung jawab mutlak dalam menjaga titipan ilmu, nama baik keluarga, inisiatif, serta semangat persaudaraan sesama muslim.",
              color: "teal"
            },
            {
              id: "val-4",
              number: "NILAI 04",
              title: "Al-Ihsan (Kebaikan Hati)",
              description: "Senantiasa berbuat kebajikan, berempati sosial tinggi, bertutur kata santun, serta beribadah seolah-olah melihat Allah Ta'ala.",
              color: "rose"
            }
          ]).map((val, idx) => (
            <div key={val.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                val.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                val.color === 'amber' ? 'bg-amber-100 text-amber-800' :
                val.color === 'rose' ? 'bg-rose-100 text-rose-800' :
                'bg-teal-100 text-teal-800'
              }`}>
                {idx === 0 ? <Compass className="w-5 h-5" /> :
                 idx === 1 ? <Target className="w-5 h-5" /> :
                 idx === 2 ? <Scale className="w-5 h-5" /> :
                 <Heart className="w-5 h-5" />}
              </div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                {val.number || `NILAI 0${idx + 1}`}
              </span>
              <h4 className="text-base font-bold text-slate-900">{val.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DEWAN PENDIDIK & ASATIDZ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-10">
          <div className="lg:col-span-8 space-y-2">
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              TENAGA PENDIDIK BERPENGALAMAN
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Dewan Guru &amp; Asatidz
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Para asatidz dan ustazah yang kompeten, mencintai anak-anak, serta membimbing santri dengan keteladanan akhlak nabawiyah.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 px-4 py-2 rounded-2xl border border-emerald-200 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{teachers.length} Asatidz &amp; Pengajar</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map(teacher => (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={getOptimizedImageUrl(teacher.imageUrl, "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80")}
                    alt={teacher.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <span className="absolute bottom-2 left-2 bg-emerald-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                    {teacher.education}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {teacher.name}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {teacher.role}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Bidang:</span> {teacher.specialty}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEGALITAS & AKREDITASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(settings.legalitasList && settings.legalitasList.length > 0 ? settings.legalitasList : [
            {
              id: "leg-1",
              tag: "AKREDITASI BAN S/M",
              title: `Terakreditasi "${settings.accreditation}"`,
              description: "Memenuhi seluruh standar nasional pendidikan (SNP) dengan nilai capaian memuaskan dari Badan Akreditasi Nasional.",
              badge: settings.skAkreditasi,
              color: "emerald"
            },
            {
              id: "leg-2",
              tag: "IZIN OPERASIONAL",
              title: "Kemendikbudristek & Dinas",
              description: "Lembaga resmi terdaftar di Dinas Pendidikan Kabupaten Gunungkidul dan terdata aktif dalam sistem Dapodik Kemendikbudristek.",
              badge: `NPSN: ${settings.npsn}`,
              color: "amber"
            },
            {
              id: "leg-3",
              tag: "YAYASAN PENYELENGGARA",
              title: settings.foundation,
              description: "Badan hukum nirlaba yang berfokus pada dakwah pendidikan Al-Qur'an dan kemaslahatan umat di Playen, Gunungkidul.",
              badge: "Playen, Gunungkidul, D.I. Yogyakarta",
              color: "teal"
            }
          ]).map((leg, idx) => (
            <div key={leg.id} className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                leg.color === 'amber' ? 'bg-amber-50 text-amber-800' :
                leg.color === 'teal' ? 'bg-teal-50 text-teal-800' :
                'bg-emerald-50 text-emerald-800'
              }`}>
                {idx === 0 ? <Award className="w-6 h-6" /> :
                 idx === 1 ? <FileCheck2 className="w-6 h-6" /> :
                 <Building className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">{leg.tag}</span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{leg.title}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {leg.description}
                </p>
                <div className={`mt-4 inline-block text-xs font-bold px-3 py-1.5 rounded-lg border ${
                  leg.color === 'amber' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                  leg.color === 'teal' ? 'bg-teal-50 text-teal-900 border-teal-200' :
                  'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}>
                  {leg.badge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              PENERIMAAN SANTRI BARU (PSB) ONLINE
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Percayakan Pendidikan Buah Hati Bersama {settings.schoolName}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
              Kuota santri terbatas setiap kelas demi menjaga kualitas halaqah Al-Qur'an dan intensitas pendampingan personal santri. Daftarkan putra-putri tercinta sekarang.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setActivePage('spmb')}
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-6 py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Daftar PSB Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${settings.whatsappSpmb}`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700 px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Hubungi Panitia PSB</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
