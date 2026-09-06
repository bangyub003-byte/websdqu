import React, { useState } from 'react';
import { ActivePage, SchoolSettings } from '../types';
import { BookOpen, Menu, X, ArrowRight, ShieldCheck, Phone, MapPin } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  settings: SchoolSettings;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  settings,
  isAdminLoggedIn = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil' },
    { id: 'kegiatan', label: 'Kegiatan' },
    { id: 'fasilitas', label: 'Fasilitas' },
    { id: 'infaq', label: 'Infaq' },
    { id: 'spmb', label: 'SPMB' }
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label={`Kembali ke Beranda ${settings.schoolName}`}
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo Sekolah"
                className="w-11 h-11 rounded-xl object-contain shadow-md bg-white border border-slate-100 p-1 group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  // If broken image, hide img and fallback
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-6 h-6" strokeWidth={2.2} />
              </div>
            )}
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight text-emerald-950 font-['Plus_Jakarta_Sans',sans-serif] line-clamp-1">
                {settings.schoolName}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-700 uppercase">
                PLAYEN • GUNUNGKIDUL
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-normal transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('spmb')}
              className="inline-flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Daftar SPMB Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Admin CMS Access Icon */}
            <button
              onClick={() => handleNavClick('admin')}
              title={isAdminLoggedIn ? 'Dashboard Admin (Aktif)' : 'Login Admin CMS'}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                activePage === 'admin'
                  ? 'bg-emerald-900 text-white'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => handleNavClick('spmb')}
              className="bg-[#d97706] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs flex items-center gap-1"
            >
              <span>SPMB</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-950" /> : <Menu className="w-6 h-6 text-emerald-950" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-2.5 px-4 rounded-xl text-center text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('spmb')}
              className="w-full bg-[#d97706] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Daftar SPMB Online 2025/2026</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full bg-slate-100 text-slate-800 hover:bg-slate-200 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Portal Admin CMS Pengelola</span>
            </button>
          </div>

          {/* Quick Contact Footer in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">Playen, Gunungkidul, D.I. Yogyakarta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Panitia SPMB: {settings.phoneSpmb}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
