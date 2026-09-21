import React from 'react';
import { ActivePage, SchoolSettings } from '../types';
import { BookOpen, MapPin, Mail, Clock, Globe, Instagram, Youtube, MessageCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, settings }) => {
  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-7 pb-4 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 pb-5 border-b border-slate-100 items-start">
          
          {/* Kolom 1: Identitas Sekolah (Logo, nama, deskripsi ringkas, medsos) */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center gap-2.5">
              {settings.logoUrl ? (
                <img
                  src={getOptimizedImageUrl(settings.logoUrl)}
                  alt={`Logo ${settings.schoolName}`}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-xl object-contain shadow-2xs bg-white border border-slate-100 p-0.5"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=120&q=80';
                  }}
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shadow-2xs">
                  <BookOpen className="w-4 h-4" strokeWidth={2.2} />
                </div>
              )}
              <div>
                <div className="font-extrabold text-sm sm:text-base text-emerald-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
                  {settings.schoolName}
                </div>
                <div className="text-[9px] font-bold tracking-wider text-emerald-700 uppercase">
                  SEKOLAH DASAR QUR'AN UNGGULAN
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              {settings.subTagline || "Mencetak generasi penghafal Al-Qur'an yang mutqin, berakhlak mulia, berintelektual sains unggul, dan berwawasan lingkungan asri di Playen, Gunungkidul."}
            </p>

            {/* Medsos */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <a
                href="#beranda"
                onClick={(e) => { e.preventDefault(); handleNav('beranda'); }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900 flex items-center justify-center transition-colors"
                title="Website Utama"
                aria-label="Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900 flex items-center justify-center transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900 flex items-center justify-center transition-colors"
                title="YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappSpmb}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900 flex items-center justify-center transition-colors"
                title="WhatsApp Layanan"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div className="lg:col-span-2 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tautan Cepat</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => handleNav('beranda')}
                  className="hover:text-emerald-800 hover:underline transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('profil')}
                  className="hover:text-emerald-800 hover:underline transition-colors"
                >
                  Profil Sekolah
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('kegiatan')}
                  className="hover:text-emerald-800 hover:underline transition-colors"
                >
                  Kegiatan Santri
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('fasilitas')}
                  className="hover:text-emerald-800 hover:underline transition-colors"
                >
                  Fasilitas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('infaq')}
                  className="hover:text-emerald-800 hover:underline transition-colors"
                >
                  Infaq &amp; Wakaf
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('spmb')}
                  className="hover:text-emerald-800 hover:underline transition-colors font-bold text-amber-700"
                >
                  Portal SPMB
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Alamat */}
          <div className="lg:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Kontak &amp; Layanan</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-700">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                <a href={`https://wa.me/${settings.whatsappSpmb}`} target="_blank" rel="noreferrer" className="hover:text-emerald-800 font-medium">
                  WA: {settings.phoneSpmb || settings.whatsappSpmb}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-emerald-800">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-500 pt-0.5 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                <span>Sen–Kam: {settings.hoursWeekday} • Jum: {settings.hoursFriday}</span>
              </div>
            </div>
          </div>

          {/* Kolom 4: Peta Lokasi Google Maps */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                <span>Peta Lokasi</span>
              </h4>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || "SDQU Al I'tisham Playen Gunungkidul")}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 hover:underline"
                title="Buka rute navigasi di Google Maps"
              >
                <span>Buka Rute</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs bg-slate-100">
              <iframe
                title="Peta Lokasi SDQU Al I'tisham"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address || "SDQU Al I'tisham Playen Gunungkidul")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[10px] text-slate-500 leading-tight truncate">
              {settings.address || "Playen, Playen, Gunungkidul, D.I. Yogyakarta"}
            </p>
          </div>

        </div>

        {/* Bagian Bawah: Copyright tipis satu baris + Link Admin CMS di pojok kanan */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-slate-500">
          <div>
            © {currentYear} {settings.schoolName || "SD Qur'an Unggulan Al I'tisham Playen"}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('admin')}
              className="text-slate-400 hover:text-emerald-900 transition-colors flex items-center gap-1 text-[11px]"
              title="Panel Kelola Konten Sekolah"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Login Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
