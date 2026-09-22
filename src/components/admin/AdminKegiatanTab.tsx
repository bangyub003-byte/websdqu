import React, { useState } from 'react';
import { SchoolSettings, ActivityItem, ExtracurricularItem, EventItem } from '../../types';
import { ThumbnailUploader } from '../common/ThumbnailUploader';
import { IconPicker } from '../common/IconPicker';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  Check,
  Sparkles,
  Download,
  FileText,
  Edit2,
  MapPin,
  Tag,
  X
} from 'lucide-react';

interface AdminKegiatanTabProps {
  settings: SchoolSettings;
  onUpdateSettings: (newSettings: SchoolSettings) => void;
  handleFileUpload: (file: File, onLoaded: (url: string) => void, label?: string) => Promise<void>;
  requestDelete: (title: string, message: string, onConfirm: () => void) => void;
  settingsSaved: boolean;
  onSave: (e: React.FormEvent) => void;
  events?: EventItem[];
  onAddEvent?: (item: Omit<EventItem, 'id'>) => void;
  onUpdateEvent?: (id: string, updated: Partial<EventItem>) => void;
  onDeleteEvent?: (id: string, title: string) => void;
}

export const AdminKegiatanTab: React.FC<AdminKegiatanTabProps> = ({
  settings,
  onUpdateSettings,
  handleFileUpload,
  requestDelete,
  settingsSaved,
  onSave,
  events = [],
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'header' | 'harian' | 'berkala' | 'ekskul' | 'agenda' | 'kalender'>('header');

  // State untuk CRUD Agenda Kegiatan
  const [agendaMode, setAgendaMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventMonth, setEventMonth] = useState('');
  const [eventDateRange, setEventDateRange] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('Tahfidz');
  const [eventDescription, setEventDescription] = useState('');

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventTitle('');
    setEventMonth('');
    setEventDateRange('');
    setEventLocation('');
    setEventCategory('Tahfidz');
    setEventDescription('');
    setAgendaMode('list');
  };

  const startAddEvent = () => {
    setEditingEventId(null);
    setEventTitle('');
    setEventMonth('MARET 2025');
    setEventDateRange('');
    setEventLocation("Aula Utama Kampus 1 SDQU Al I'tisham Playen");
    setEventCategory('Tahfidz');
    setEventDescription('');
    setAgendaMode('add');
  };

  const startEditEvent = (ev: EventItem) => {
    setEditingEventId(ev.id);
    setEventTitle(ev.title || '');
    setEventMonth(ev.month || '');
    setEventDateRange(ev.dateRange || '');
    setEventLocation(ev.location || '');
    setEventCategory(ev.category || 'Tahfidz');
    setEventDescription(ev.description || '');
    setAgendaMode('edit');
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (agendaMode === 'edit' && editingEventId) {
      if (onUpdateEvent) {
        onUpdateEvent(editingEventId, {
          title: eventTitle.trim(),
          month: eventMonth.trim(),
          dateRange: eventDateRange.trim(),
          location: eventLocation.trim(),
          category: eventCategory,
          description: eventDescription.trim()
        });
      }
    } else if (agendaMode === 'add') {
      if (onAddEvent) {
        onAddEvent({
          title: eventTitle.trim(),
          month: eventMonth.trim(),
          dateRange: eventDateRange.trim(),
          location: eventLocation.trim(),
          category: eventCategory,
          description: eventDescription.trim()
        });
      }
    }
    resetEventForm();
  };

  return (
    <form onSubmit={onSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="text-base font-bold text-slate-900">
              Kelola Halaman Kegiatan &amp; Ekstrakurikuler
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Edit judul, tagline, foto thumbnail, jadwal harian, pembiasaan berkala, hingga unduhan kalender akademik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {settingsSaved && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Tersimpan!</span>
            </span>
          )}
          <button
            type="submit"
            className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Container Layout: Sidebar Kiri + Konten Kanan */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Navigasi Sub-Bab Kiri */}
        <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
            Sub-Bab Kegiatan
          </div>
          {[
            { id: 'header', label: '1. Judul & Header', desc: 'Tagline, judul & 4 angka statistik' },
            { id: 'harian', label: `2. Jadwal Harian (${settings.dailyActivities?.length || 0})`, desc: 'Rutinitas jam masuk hingga pulang' },
            { id: 'berkala', label: `3. Program Berkala (${settings.periodicPrograms?.length || 0})`, desc: 'Pekan, bulanan & semester' },
            { id: 'ekskul', label: `4. Ekstrakurikuler (${settings.extracurriculars?.length || 0})`, desc: 'Bakat santri, olahraga & seni' },
            { id: 'agenda', label: `5. Agenda Kegiatan (${events?.length || 0})`, desc: 'Kelola agenda semester berjalan (CRUD)' },
            { id: 'kalender', label: '6. Unduh Kalender', desc: 'Tautan file kalender akademik' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col ${
                activeSubTab === tab.id
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-normal mt-0.5 ${activeSubTab === tab.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Panel Konten Kanan */}
        <div className="flex-1 min-w-0 w-full space-y-6">

      {/* SUBTAB 1: HEADER & STATISTIK KEGIATAN */}
      {activeSubTab === 'header' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-800" />
              <span>Header Utama Halaman Kegiatan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tagline / Badge Header</label>
                <input
                  type="text"
                  value={settings.kegiatanHeaderTagline || ''}
                  onChange={e => onUpdateSettings({ ...settings, kegiatanHeaderTagline: e.target.value })}
                  placeholder="AGENDA &amp; RUTINITAS SANTRI"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Utama Halaman Kegiatan</label>
                <input
                  type="text"
                  value={settings.kegiatanHeaderTitle || ''}
                  onChange={e => onUpdateSettings({ ...settings, kegiatanHeaderTitle: e.target.value })}
                  placeholder="Membentuk Karakter Qur'ani Melalui Pembiasaan Mulia"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Deskripsi Pengantar Header</label>
              <textarea
                rows={2}
                value={settings.kegiatanHeaderDesc || ''}
                onChange={e => onUpdateSettings({ ...settings, kegiatanHeaderDesc: e.target.value })}
                placeholder="Deskripsi kegiatan santri..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          {/* 4 Statistik Kegiatan */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div>
              <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span>Statistik Ringkas Halaman Kegiatan (4 Pita Angka)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Edit 4 kartu statistik tetap di bawah header halaman Kegiatan publik ("07.00 Mulai Halaqah Pagi", "30 Juz Bimbingan Tajwid Sanad", "100% Praktik Lapangan Sunnah", "24/7 Pendampingan Karakter").
              </p>
            </div>

            {(() => {
              const currentRibbon = {
                stat1Val: settings.kegiatanStatsRibbon?.stat1Val || (settings as any).kegiatanStats?.stat1Val || "07.00",
                stat1Label: settings.kegiatanStatsRibbon?.stat1Label || (settings as any).kegiatanStats?.stat1Label || "Mulai Halaqah Pagi",
                stat1Icon: settings.kegiatanStatsRibbon?.stat1Icon || "clock",
                stat2Val: settings.kegiatanStatsRibbon?.stat2Val || (settings as any).kegiatanStats?.stat2Val || "30 Juz",
                stat2Label: settings.kegiatanStatsRibbon?.stat2Label || (settings as any).kegiatanStats?.stat2Label || "Bimbingan Tajwid Sanad",
                stat2Icon: settings.kegiatanStatsRibbon?.stat2Icon || "book-open",
                stat3Val: settings.kegiatanStatsRibbon?.stat3Val || (settings as any).kegiatanStats?.stat3Val || "100%",
                stat3Label: settings.kegiatanStatsRibbon?.stat3Label || (settings as any).kegiatanStats?.stat3Label || "Praktik Lapangan Sunnah",
                stat3Icon: settings.kegiatanStatsRibbon?.stat3Icon || "heart-handshake",
                stat4Val: settings.kegiatanStatsRibbon?.stat4Val || (settings as any).kegiatanStats?.stat4Val || "24/7",
                stat4Label: settings.kegiatanStatsRibbon?.stat4Label || (settings as any).kegiatanStats?.stat4Label || "Pendampingan Karakter",
                stat4Icon: settings.kegiatanStatsRibbon?.stat4Icon || "shield-check",
              };

              const updateSlot = (field: string, val: string) => {
                const updated = {
                  ...currentRibbon,
                  [field]: val
                };
                onUpdateSettings({
                  ...settings,
                  kegiatanStatsRibbon: updated,
                  kegiatanStats: updated as any
                });
              };

              const slots = [
                {
                  num: 1,
                  valKey: 'stat1Val',
                  labelKey: 'stat1Label',
                  iconKey: 'stat1Icon',
                  val: currentRibbon.stat1Val,
                  label: currentRibbon.stat1Label,
                  icon: currentRibbon.stat1Icon,
                  defaultIcon: 'clock',
                  placeholderVal: '07.00',
                  placeholderLabel: 'Mulai Halaqah Pagi',
                  desc: 'Slot 1: Waktu Mulai Halaqah'
                },
                {
                  num: 2,
                  valKey: 'stat2Val',
                  labelKey: 'stat2Label',
                  iconKey: 'stat2Icon',
                  val: currentRibbon.stat2Val,
                  label: currentRibbon.stat2Label,
                  icon: currentRibbon.stat2Icon,
                  defaultIcon: 'book-open',
                  placeholderVal: '30 Juz',
                  placeholderLabel: 'Bimbingan Tajwid Sanad',
                  desc: 'Slot 2: Target Bimbingan Tajwid'
                },
                {
                  num: 3,
                  valKey: 'stat3Val',
                  labelKey: 'stat3Label',
                  iconKey: 'stat3Icon',
                  val: currentRibbon.stat3Val,
                  label: currentRibbon.stat3Label,
                  icon: currentRibbon.stat3Icon,
                  defaultIcon: 'heart-handshake',
                  placeholderVal: '100%',
                  placeholderLabel: 'Praktik Lapangan Sunnah',
                  desc: 'Slot 3: Praktik Lapangan Sunnah'
                },
                {
                  num: 4,
                  valKey: 'stat4Val',
                  labelKey: 'stat4Label',
                  iconKey: 'stat4Icon',
                  val: currentRibbon.stat4Val,
                  label: currentRibbon.stat4Label,
                  icon: currentRibbon.stat4Icon,
                  defaultIcon: 'shield-check',
                  placeholderVal: '24/7',
                  placeholderLabel: 'Pendampingan Karakter',
                  desc: 'Slot 4: Pembiasaan Karakter'
                }
              ];

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {slots.map(s => (
                    <div key={s.num} className="p-3.5 rounded-xl bg-white border border-slate-200/90 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wider">
                          Kartu Statistik #{s.num}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Slot Tetap
                        </span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">
                          Angka / Nilai *
                        </label>
                        <input
                          type="text"
                          value={s.val}
                          onChange={e => updateSlot(s.valKey, e.target.value)}
                          placeholder={s.placeholderVal}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-extrabold text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">
                          Label Keterangan *
                        </label>
                        <input
                          type="text"
                          value={s.label}
                          onChange={e => updateSlot(s.labelKey, e.target.value)}
                          placeholder={s.placeholderLabel}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-800"
                        />
                      </div>

                      <div className="pt-0.5">
                        <IconPicker
                          label="Pilihan Ikon Kartu"
                          value={s.icon}
                          onChange={newIcon => updateSlot(s.iconKey, newIcon)}
                          fallbackId={s.defaultIcon}
                          compact
                        />
                      </div>

                      <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                        {s.desc}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SUBTAB 2: JADWAL HARIAN */}
      {activeSubTab === 'harian' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Daftar Jadwal Harian &amp; Mingguan Santri
              </h4>
              <p className="text-xs text-slate-500">
                Tambahkan foto thumbnail, jam kegiatan, badge, dan keterangan setiap aktivitas santri.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newItem: ActivityItem = {
                  id: 'act-' + Date.now(),
                  title: 'Kegiatan Baru',
                  time: '07.00 - 08.00 WIB',
                  desc: 'Penjelasan kegiatan santri di sekolah.',
                  badge: 'PAGI',
                  day: 'Senin - Jumat',
                  imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
                };
                onUpdateSettings({
                  ...settings,
                  dailyActivities: [...(settings.dailyActivities || []), newItem]
                });
              }}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jadwal Harian</span>
            </button>
          </div>

          <div className="space-y-4">
            {(settings.dailyActivities || []).map((act, idx) => (
              <div key={act.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-900 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{act.title || 'Kegiatan Tanpa Judul'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      requestDelete('Hapus Kegiatan Harian', `Hapus "${act.title}" dari jadwal harian?`, () => {
                        const updated = settings.dailyActivities?.filter((_, i) => i !== idx);
                        onUpdateSettings({ ...settings, dailyActivities: updated });
                      });
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nama / Judul Kegiatan *</label>
                    <input
                      type="text"
                      value={act.title}
                      onChange={e => {
                        const updated = [...(settings.dailyActivities || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        onUpdateSettings({ ...settings, dailyActivities: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Waktu / Jam Pelaksanaan</label>
                    <input
                      type="text"
                      value={act.time || ''}
                      onChange={e => {
                        const updated = [...(settings.dailyActivities || [])];
                        updated[idx] = { ...updated[idx], time: e.target.value };
                        onUpdateSettings({ ...settings, dailyActivities: updated });
                      }}
                      placeholder="07.15 - 08.00 WIB"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Label Badge / Kategori</label>
                    <input
                      type="text"
                      value={act.badge || ''}
                      onChange={e => {
                        const updated = [...(settings.dailyActivities || [])];
                        updated[idx] = { ...updated[idx], badge: e.target.value };
                        onUpdateSettings({ ...settings, dailyActivities: updated });
                      }}
                      placeholder="PAGI / HARIAN"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white uppercase font-bold text-emerald-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Lengkap Kegiatan</label>
                  <textarea
                    rows={2}
                    value={act.desc}
                    onChange={e => {
                      const updated = [...(settings.dailyActivities || [])];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      onUpdateSettings({ ...settings, dailyActivities: updated });
                    }}
                    placeholder="Uraian kegiatan yang dilakukan santri..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                {/* Upload Thumbnail Foto Kegiatan */}
                <div>
                  <ThumbnailUploader
                    label={`Foto Thumbnail untuk ${act.title || 'Kegiatan'}`}
                    value={act.imageUrl || ''}
                    onChange={url => {
                      const updated = [...(settings.dailyActivities || [])];
                      updated[idx] = { ...updated[idx], imageUrl: url };
                      onUpdateSettings({ ...settings, dailyActivities: updated });
                    }}
                    onUploadFile={(file, label) =>
                      handleFileUpload(file, url => {
                        const updated = [...(settings.dailyActivities || [])];
                        updated[idx] = { ...updated[idx], imageUrl: url };
                        onUpdateSettings({ ...settings, dailyActivities: updated });
                      }, label)
                    }
                    aspectRatio="video"
                    fit="cover"
                    helperText="Pilih foto dokumentasi kegiatan dari HP atau komputer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PROGRAM BERKALA */}
      {activeSubTab === 'berkala' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Daftar Program Berkala &amp; Pembiasaan Karakter
              </h4>
              <p className="text-xs text-slate-500">
                Kelola program pekanan, bulanan, dan semesteran (Market Day, Mukhayyam, Outbound, dll).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newItem: ActivityItem = {
                  id: 'per-' + Date.now(),
                  title: 'Program Berkala Baru',
                  schedule: 'Setiap Pekan / Bulan',
                  desc: 'Penjelasan program pembiasaan berkala santri.',
                  badge: 'BULANAN',
                  imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'
                };
                onUpdateSettings({
                  ...settings,
                  periodicPrograms: [...(settings.periodicPrograms || []), newItem]
                });
              }}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Program Berkala</span>
            </button>
          </div>

          <div className="space-y-4">
            {(settings.periodicPrograms || []).map((prog, idx) => (
              <div key={prog.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-800 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{prog.title || 'Program Tanpa Judul'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      requestDelete('Hapus Program Berkala', `Hapus "${prog.title}" dari program berkala?`, () => {
                        const updated = settings.periodicPrograms?.filter((_, i) => i !== idx);
                        onUpdateSettings({ ...settings, periodicPrograms: updated });
                      });
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nama / Judul Program *</label>
                    <input
                      type="text"
                      value={prog.title}
                      onChange={e => {
                        const updated = [...(settings.periodicPrograms || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        onUpdateSettings({ ...settings, periodicPrograms: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Jadwal / Frekuensi</label>
                    <input
                      type="text"
                      value={prog.schedule || ''}
                      onChange={e => {
                        const updated = [...(settings.periodicPrograms || [])];
                        updated[idx] = { ...updated[idx], schedule: e.target.value };
                        onUpdateSettings({ ...settings, periodicPrograms: updated });
                      }}
                      placeholder="Jumat Pertama Setiap Bulan"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Label Badge</label>
                    <input
                      type="text"
                      value={prog.badge || ''}
                      onChange={e => {
                        const updated = [...(settings.periodicPrograms || [])];
                        updated[idx] = { ...updated[idx], badge: e.target.value };
                        onUpdateSettings({ ...settings, periodicPrograms: updated });
                      }}
                      placeholder="PEKANAN / BULANAN"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white uppercase font-bold text-teal-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Lengkap Program</label>
                  <textarea
                    rows={2}
                    value={prog.desc}
                    onChange={e => {
                      const updated = [...(settings.periodicPrograms || [])];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      onUpdateSettings({ ...settings, periodicPrograms: updated });
                    }}
                    placeholder="Uraian manfaat dan pelaksanaan program..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                {/* Upload Thumbnail Foto Program */}
                <div>
                  <ThumbnailUploader
                    label={`Foto Thumbnail untuk ${prog.title || 'Program'}`}
                    value={prog.imageUrl || ''}
                    onChange={url => {
                      const updated = [...(settings.periodicPrograms || [])];
                      updated[idx] = { ...updated[idx], imageUrl: url };
                      onUpdateSettings({ ...settings, periodicPrograms: updated });
                    }}
                    onUploadFile={(file, label) =>
                      handleFileUpload(file, url => {
                        const updated = [...(settings.periodicPrograms || [])];
                        updated[idx] = { ...updated[idx], imageUrl: url };
                        onUpdateSettings({ ...settings, periodicPrograms: updated });
                      }, label)
                    }
                    aspectRatio="video"
                    fit="cover"
                    helperText="Pilih foto dokumentasi program berkala dari HP atau komputer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: EKSTRAKURIKULER */}
      {activeSubTab === 'ekskul' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Daftar Ekstrakurikuler Pilihan Santri
              </h4>
              <p className="text-xs text-slate-500">
                Kelola nama ekskul, kategori, jadwal latihan, foto thumbnail, dan deskripsi pembinaan bakat.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newItem: ExtracurricularItem = {
                  id: 'ekskul-' + Date.now(),
                  name: 'Ekskul Baru',
                  category: 'Olahraga Sunnah',
                  schedule: 'Sabtu, 08.00 - 10.00 WIB',
                  desc: 'Deskripsi pembinaan bakat dan minat santri.',
                  imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
                };
                onUpdateSettings({
                  ...settings,
                  extracurriculars: [...(settings.extracurriculars || []), newItem]
                });
              }}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Ekstrakurikuler</span>
            </button>
          </div>

          <div className="space-y-4">
            {(settings.extracurriculars || []).map((ekskul, idx) => (
              <div key={ekskul.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-900 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{ekskul.name || 'Ekskul Baru'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      requestDelete('Hapus Ekstrakurikuler', `Hapus "${ekskul.name}" dari daftar ekskul?`, () => {
                        const updated = settings.extracurriculars?.filter((_, i) => i !== idx);
                        onUpdateSettings({ ...settings, extracurriculars: updated });
                      });
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nama Ekstrakurikuler *</label>
                    <input
                      type="text"
                      value={ekskul.name}
                      onChange={e => {
                        const updated = [...(settings.extracurriculars || [])];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        onUpdateSettings({ ...settings, extracurriculars: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Kategori Ekskul</label>
                    <input
                      type="text"
                      value={ekskul.category || ''}
                      onChange={e => {
                        const updated = [...(settings.extracurriculars || [])];
                        updated[idx] = { ...updated[idx], category: e.target.value };
                        onUpdateSettings({ ...settings, extracurriculars: updated });
                      }}
                      placeholder="Olahraga Sunnah / Seni Islami"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Jadwal Latihan</label>
                    <input
                      type="text"
                      value={ekskul.schedule || ''}
                      onChange={e => {
                        const updated = [...(settings.extracurriculars || [])];
                        updated[idx] = { ...updated[idx], schedule: e.target.value };
                        onUpdateSettings({ ...settings, extracurriculars: updated });
                      }}
                      placeholder="Sabtu, 08.00 - 10.00 WIB"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Ekstrakurikuler</label>
                  <textarea
                    rows={2}
                    value={ekskul.desc}
                    onChange={e => {
                      const updated = [...(settings.extracurriculars || [])];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      onUpdateSettings({ ...settings, extracurriculars: updated });
                    }}
                    placeholder="Tujuan dan gambaran kegiatan ekskul..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                {/* Upload Thumbnail Foto Ekskul */}
                <div>
                  <ThumbnailUploader
                    label={`Foto Thumbnail untuk ${ekskul.name || 'Ekskul'}`}
                    value={ekskul.imageUrl || ''}
                    onChange={url => {
                      const updated = [...(settings.extracurriculars || [])];
                      updated[idx] = { ...updated[idx], imageUrl: url };
                      onUpdateSettings({ ...settings, extracurriculars: updated });
                    }}
                    onUploadFile={(file, label) =>
                      handleFileUpload(file, url => {
                        const updated = [...(settings.extracurriculars || [])];
                        updated[idx] = { ...updated[idx], imageUrl: url };
                        onUpdateSettings({ ...settings, extracurriculars: updated });
                      }, label)
                    }
                    aspectRatio="video"
                    fit="cover"
                    helperText="Pilih foto dokumentasi kegiatan ekskul dari galeri HP atau laptop"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: AGENDA KEGIATAN (CRUD) */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                  Agenda Kegiatan Semester Berjalan ({events.length} Terdaftar)
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kelola jadwal tasmi', mukhayyam, ujian, parenting, dan agenda penting sekolah.
              </p>
            </div>

            {agendaMode === 'list' && (
              <button
                type="button"
                onClick={startAddEvent}
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Agenda Baru</span>
              </button>
            )}
          </div>

          {/* Form Tambah / Edit Agenda */}
          {(agendaMode === 'add' || agendaMode === 'edit') && (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-600/30 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <div className="flex items-center gap-2">
                  {agendaMode === 'add' ? (
                    <Plus className="w-4 h-4 text-emerald-800" />
                  ) : (
                    <Edit2 className="w-4 h-4 text-emerald-800" />
                  )}
                  <h5 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                    {agendaMode === 'add' ? 'Form Tambah Agenda Baru' : 'Form Edit Agenda Kegiatan'}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Agenda / Judul Kegiatan *</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                    placeholder="Contoh: Mukhayyam Al-Qur'an 3 Hari Wanagama"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Bulan / Label Waktu</label>
                  <input
                    type="text"
                    value={eventMonth}
                    onChange={e => setEventMonth(e.target.value)}
                    placeholder="Contoh: MARET 2025"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white uppercase font-bold text-emerald-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tanggal / Rentang Hari</label>
                  <input
                    type="text"
                    value={eventDateRange}
                    onChange={e => setEventDateRange(e.target.value)}
                    placeholder="Contoh: 15 - 16 Maret 2025"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori Kegiatan</label>
                  <select
                    value={eventCategory}
                    onChange={e => setEventCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option value="Tahfidz">Tahfidz &amp; Al-Qur'an</option>
                    <option value="Akademik">Akademik &amp; Sains</option>
                    <option value="Parenting">Parenting &amp; Kajian</option>
                    <option value="Dakwah">Dakwah &amp; Syiar</option>
                    <option value="Kepanduan">Kepanduan &amp; HW</option>
                    <option value="Wisuda">Wisuda &amp; Tasmi'</option>
                    <option value="Sosial">Sosial &amp; Ramadhan</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lokasi / Tempat</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={e => setEventLocation(e.target.value)}
                    placeholder="Contoh: Aula Utama Kampus SDQU Playen"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Deskripsi / Catatan Agenda</label>
                  <textarea
                    rows={2}
                    value={eventDescription}
                    onChange={e => setEventDescription(e.target.value)}
                    placeholder="Keterangan singkat mengenai agenda santri ini..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200/60">
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvent}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{agendaMode === 'add' ? 'Simpan Agenda Baru' : 'Simpan Perubahan Agenda'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Daftar Agenda Cards */}
          {agendaMode === 'list' && (
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Belum ada agenda kegiatan yang terdaftar.</p>
                  <button
                    type="button"
                    onClick={startAddEvent}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah agenda pertama</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {events.map((ev, idx) => (
                    <div
                      key={ev.id || idx}
                      className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {ev.category || 'Tahfidz'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {ev.month || '2025'}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900 leading-snug">
                          {ev.title}
                        </h5>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {ev.description || 'Tidak ada keterangan tambahan.'}
                        </p>

                        <div className="space-y-1 pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span className="font-medium text-slate-700">{ev.dateRange || '-'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span className="truncate">{ev.location || "SDQU Al I'tisham Playen"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => startEditEvent(ev)}
                          className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Edit agenda"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onDeleteEvent) {
                              onDeleteEvent(ev.id, ev.title);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Hapus agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 6: KALENDER */}
      {activeSubTab === 'kalender' && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-800" />
            <span>Pita Banner Unduh Kalender Akademik</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Judul Banner Kalender</label>
              <input
                type="text"
                value={settings.kegiatanCalendarTitle || ''}
                onChange={e => onUpdateSettings({ ...settings, kegiatanCalendarTitle: e.target.value })}
                placeholder="Unduh Kalender Akademik Resmi"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Teks Tombol Unduh</label>
              <input
                type="text"
                value={settings.kegiatanCalendarBtnText || ''}
                onChange={e => onUpdateSettings({ ...settings, kegiatanCalendarBtnText: e.target.value })}
                placeholder="Unduh Kalender PDF"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Deskripsi Kalender</label>
            <textarea
              rows={2}
              value={settings.kegiatanCalendarDesc || ''}
              onChange={e => onUpdateSettings({ ...settings, kegiatanCalendarDesc: e.target.value })}
              placeholder="Dapatkan jadwal lengkap tahun ajaran aktif..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">URL Berkas PDF Kalender</label>
            <input
              type="text"
              value={settings.kegiatanCalendarFileUrl || ''}
              onChange={e => onUpdateSettings({ ...settings, kegiatanCalendarFileUrl: e.target.value })}
              placeholder="https://... atau #kalender"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
            />
          </div>
        </div>
      )}

        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-[11px] text-slate-500">
          *Pastikan untuk menekan tombol "Simpan Perubahan" setelah mengedit data.
        </span>

        <button
          type="submit"
          className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Halaman Kegiatan</span>
        </button>
      </div>

    </form>
  );
};
