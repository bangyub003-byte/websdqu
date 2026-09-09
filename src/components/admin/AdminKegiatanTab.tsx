import React, { useState } from 'react';
import { SchoolSettings, ActivityItem, ExtracurricularItem } from '../../types';
import { ThumbnailUploader } from '../common/ThumbnailUploader';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  Check,
  Sparkles,
  Download,
  FileText
} from 'lucide-react';

interface AdminKegiatanTabProps {
  settings: SchoolSettings;
  onUpdateSettings: (newSettings: SchoolSettings) => void;
  handleFileUpload: (file: File, onLoaded: (url: string) => void, label?: string) => Promise<void>;
  requestDelete: (title: string, message: string, onConfirm: () => void) => void;
  settingsSaved: boolean;
  onSave: (e: React.FormEvent) => void;
}

export const AdminKegiatanTab: React.FC<AdminKegiatanTabProps> = ({
  settings,
  onUpdateSettings,
  handleFileUpload,
  requestDelete,
  settingsSaved,
  onSave
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'header' | 'harian' | 'berkala' | 'ekskul' | 'kalender'>('header');

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

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'header', label: '1. Judul & Tagline Header' },
          { id: 'harian', label: `2. Jadwal Harian (${settings.dailyActivities?.length || 0})` },
          { id: 'berkala', label: `3. Program Berkala (${settings.periodicPrograms?.length || 0})` },
          { id: 'ekskul', label: `4. Ekstrakurikuler (${settings.extracurriculars?.length || 0})` },
          { id: 'kalender', label: '5. Unduh Kalender' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-800" />
                  <span>Statistik Ringkas Halaman Kegiatan (Pita Angka)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  4 angka statistik yang tampil di bawah header kegiatan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const updated = [...(settings.kegiatanStats || []), { value: '100%', label: 'Label Statistik' }];
                  onUpdateSettings({ ...settings, kegiatanStats: updated });
                }}
                className="text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Stat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(settings.kegiatanStats || []).map((st, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">Stat #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = settings.kegiatanStats?.filter((_, i) => i !== idx);
                        onUpdateSettings({ ...settings, kegiatanStats: updated });
                      }}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Angka / Nilai</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={e => {
                        const updated = [...(settings.kegiatanStats || [])];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        onUpdateSettings({ ...settings, kegiatanStats: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Label Keterangan</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={e => {
                        const updated = [...(settings.kegiatanStats || [])];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        onUpdateSettings({ ...settings, kegiatanStats: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
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

      {/* SUBTAB 5: KALENDER */}
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
