import React, { useState, useEffect } from 'react';
import { ActivePage, SchoolState } from './types';
import { dataService } from './services/dataService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BerandaView } from './components/pages/BerandaView';
import { ProfilView } from './components/pages/ProfilView';
import { KegiatanView } from './components/pages/KegiatanView';
import { FasilitasView } from './components/pages/FasilitasView';
import { InfaqView } from './components/pages/InfaqView';
import { SPMBView } from './components/pages/SPMBView';
import { AdminCMSView } from './components/pages/AdminCMSView';
import { MessageCircle, ArrowUp } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<SchoolState>(dataService.getState());
  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [kegiatanTab, setKegiatanTab] = useState<'semua' | 'harian' | 'berkala' | 'ekskul'>('semua');
  const [fasilitasCategory, setFasilitasCategory] = useState<'semua' | 'ibadah' | 'belajar' | 'olahraga'>('semua');

  // Subscribe to reactive data store
  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setData(dataService.getState());
    });
    return () => unsubscribe();
  }, []);

  // Support URL Hash routing (e.g. #admin, #spmb, #profil)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase() as ActivePage;
      const validPages: ActivePage[] = ['beranda', 'profil', 'kegiatan', 'fasilitas', 'infaq', 'spmb', 'admin'];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync hash when activePage changes
  const handlePageChange = (page: ActivePage) => {
    setActivePage(page);
    window.location.hash = page;
  };

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminDashboardActive = activePage === 'admin' && isAdminLoggedIn;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfb] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Header Navigation: Ditampilkan di semua halaman publik, disembunyikan saat admin aktif di dashboard CMS */}
      {!isAdminDashboardActive && (
        <Navbar
          activePage={activePage}
          setActivePage={handlePageChange}
          settings={data.settings}
          isAdminLoggedIn={isAdminLoggedIn}
          onSelectKegiatanTab={setKegiatanTab}
          onSelectFasilitasCategory={setFasilitasCategory}
        />
      )}

      {/* Main Content Area with Dynamic Page View */}
      <main className="flex-grow">
        {activePage === 'beranda' && (
          <BerandaView
            setActivePage={handlePageChange}
            settings={data.settings}
            announcements={data.announcements}
            news={data.news}
          />
        )}

        {activePage === 'profil' && (
          <ProfilView
            setActivePage={handlePageChange}
            settings={data.settings}
            teachers={data.teachers}
          />
        )}

        {activePage === 'kegiatan' && (
          <KegiatanView
            setActivePage={handlePageChange}
            settings={data.settings}
            events={data.events}
            selectedTab={kegiatanTab}
            onTabChange={setKegiatanTab}
          />
        )}

        {activePage === 'fasilitas' && (
          <FasilitasView
            setActivePage={handlePageChange}
            settings={data.settings}
            facilities={data.facilities}
            selectedCategory={fasilitasCategory}
            onCategoryChange={setFasilitasCategory}
          />
        )}

        {activePage === 'infaq' && (
          <InfaqView
            setActivePage={handlePageChange}
            settings={data.settings}
            infaqRecords={data.infaqRecords}
          />
        )}

        {activePage === 'spmb' && (
          <SPMBView
            setActivePage={handlePageChange}
            settings={data.settings}
          />
        )}

        {activePage === 'admin' && (
          <AdminCMSView
            setActivePage={handlePageChange}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            announcements={data.announcements}
            news={data.news}
            events={data.events}
            facilities={data.facilities}
            teachers={data.teachers}
            settings={data.settings}
            students={data.students}
            infaqRecords={data.infaqRecords}
          />
        )}
      </main>

      {/* Persistent Footer */}
      <Footer
        setActivePage={handlePageChange}
        settings={data.settings}
      />

      {/* Floating Action Buttons: WhatsApp Help + Scroll to Top */}
      <aside className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-none" aria-label="Aksi Cepat Kontak">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white text-slate-700 hover:text-emerald-900 border border-slate-200 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 pointer-events-auto"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <a
          href={`https://wa.me/${data.settings.whatsappSpmb}?text=Assalamu'alaikum%20Warahmatullahi%20Wabarakatuh,%20saya%20ingin%20konsultasi%20mengenai%20SDQU%20Al%20I'tisham%20Playen.`}
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 py-3 rounded-full shadow-xl flex items-center gap-2.5 transition-all duration-200 hover:scale-105 pointer-events-auto group border-2 border-white"
          aria-label="Chat WhatsApp Panitia SPMB"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-emerald-100 font-semibold leading-none">Ada Pertanyaan?</div>
            <div className="text-xs font-bold leading-tight">Chat Panitia SPMB</div>
          </div>
        </a>
      </aside>

    </div>
  );
}
