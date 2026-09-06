import React from 'react';
import { ActivePage, SchoolSettings } from '../types';
import { BookOpen, MapPin, Mail, Phone, Clock, Globe, Instagram, Youtube, MessageCircle, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, settings }) => {
  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          
          {/* Col 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo Sekolah"
                  className="w-11 h-11 rounded-xl object-contain shadow-md bg-white border border-slate-100 p-1"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shadow-md">
                  <BookOpen className="w-6 h-6" strokeWidth={2.2} />
                </div>
              )}
              <div>
                <div className="font-extrabold text-lg text-emerald-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  {settings.schoolName}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">
                  SEKOLAH DASAR QUR'AN UNGGULAN
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {settings.subTagline}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="#beranda"
                onClick={(e) => { e.preventDefault(); handleNav('beranda'); }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 flex items-center justify-center transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappSpmb}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigasi Halaman (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">Navigasi Halaman</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => handleNav('beranda')}
                  className="hover:text-emerald-800 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-700">➔</span> Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('profil')}
                  className="hover:text-emerald-800 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-700">➔</span> Profil & Visi Misi
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('kegiatan')}
                  className="hover:text-emerald-800 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-700">➔</span> Kegiatan & Ekstrakurikuler
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('fasilitas')}
                  className="hover:text-emerald-800 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-700">➔</span> Sarana & Fasilitas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('infaq')}
                  className="hover:text-emerald-800 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-700">➔</span> Infaq & Wakaf Peduli
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('spmb')}
                  className="hover:text-emerald-800 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-700">➔</span> Portal SPMB 2025/2026
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kontak & Lokasi (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">Kontak & Lokasi</h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-800 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-emerald-800">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{settings.phoneTu} (Tata Usaha)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{settings.phoneSpmb} (Panitia SPMB)</span>
              </div>
            </div>
          </div>

          {/* Col 4: Jam Layanan (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">Jam Layanan</h4>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-950 font-bold uppercase tracking-wider text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-800" />
                <span>Kantor Sekolah</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div>
                  <span className="font-semibold block text-slate-800">Senin – Kamis</span>
                  <span>{settings.hoursWeekday}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-800">Jumat</span>
                  <span>{settings.hoursFriday}</span>
                </div>
                <div className="pt-1 text-red-600 font-medium">
                  {settings.hoursWeekend}
                </div>
              </div>
            </div>

            {/* Quick Admin link in footer */}
            <button
              onClick={() => handleNav('admin')}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-emerald-900 transition-colors pt-2"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin CMS Log In</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2025 SD Qur'an Unggulan Al I'tisham Playen. Seluruh Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Akreditasi & Berwawasan Qur'ani</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
