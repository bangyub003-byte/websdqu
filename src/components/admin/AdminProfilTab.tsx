import React, { useState } from 'react';
import { SchoolSettings, TeacherItem, AchievementItem, CoreValueItem, LegalitasItem } from '../../types';
import { ThumbnailUploader } from '../common/ThumbnailUploader';
import {
  Save,
  Check,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Award,
  Users,
  FileText,
  Sparkles,
  Trophy,
  History,
  Target,
  X
} from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

interface AdminProfilTabProps {
  settings: SchoolSettings;
  onUpdateSettings: (newSettings: SchoolSettings) => void;
  teachers: TeacherItem[];
  onAddTeacher: (teacher: Omit<TeacherItem, 'id'>) => void;
  onUpdateTeacher: (id: string, teacher: Partial<TeacherItem>) => void;
  onDeleteTeacher: (id: string) => void;
  handleFileUpload: (file: File, onLoaded: (url: string) => void, label?: string) => Promise<void>;
  requestDelete: (title: string, message: string, onConfirm: () => void) => void;
  settingsSaved: boolean;
  onSave: (e: React.FormEvent) => void;
}

export const AdminProfilTab: React.FC<AdminProfilTabProps> = ({
  settings,
  onUpdateSettings,
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  handleFileUpload,
  requestDelete,
  settingsSaved,
  onSave
}) => {
  // 6 Sub-Tabs aligned exactly with Public Website's "Profil" dropdown order
  const [activeSubTab, setActiveSubTab] = useState<
    'sejarah' | 'visi_misi' | 'program_unggulan' | 'prestasi' | 'dewan_guru' | 'legalitas'
  >('sejarah');

  // Local state for Teachers sub-view
  const [teachersSubView, setTeachersSubView] = useState<'list' | 'add'>('list');
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherRole, setEditTeacherRole] = useState('');
  const [editTeacherSpecialty, setEditTeacherSpecialty] = useState('');
  const [editTeacherEducation, setEditTeacherEducation] = useState('');
  const [editTeacherImage, setEditTeacherImage] = useState('');

  // Form state for new teacher
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherRole, setNewTeacherRole] = useState('');
  const [newTeacherSpecialty, setNewTeacherSpecialty] = useState('');
  const [newTeacherEducation, setNewTeacherEducation] = useState('S.Pd.');
  const [newTeacherImage, setNewTeacherImage] = useState(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
  );

  const handleStartEditTeacher = (t: TeacherItem) => {
    setEditingTeacherId(t.id);
    setEditTeacherName(t.name);
    setEditTeacherRole(t.role);
    setEditTeacherSpecialty(t.specialty);
    setEditTeacherEducation(t.education);
    setEditTeacherImage(t.imageUrl);
  };

  const handleSaveEditTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacherId || !editTeacherName.trim()) return;
    onUpdateTeacher(editingTeacherId, {
      name: editTeacherName.trim(),
      role: editTeacherRole.trim() || 'Guru Pembina',
      specialty: editTeacherSpecialty.trim() || 'Tahfidz Al-Qur\'an',
      education: editTeacherEducation.trim() || 'S.Pd.',
      imageUrl: editTeacherImage
    });
    setEditingTeacherId(null);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;
    onAddTeacher({
      name: newTeacherName.trim(),
      role: newTeacherRole.trim() || 'Guru Pembina',
      specialty: newTeacherSpecialty.trim() || 'Tahfidz Al-Qur\'an',
      education: newTeacherEducation.trim() || 'S.Pd.',
      imageUrl: newTeacherImage,
      order: teachers.length + 1
    });
    setNewTeacherName('');
    setNewTeacherRole('');
    setNewTeacherSpecialty('');
    setNewTeacherEducation('S.Pd.');
    setTeachersSubView('list');
  };

  return (
    <form onSubmit={onSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="text-base font-bold text-slate-900">
              Kelola Halaman Profil Sekolah Terpadu
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Navigasi sub-bab di bawah ini disusun sama persis dengan urutan menu dropdown halaman publik Profil.
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

      {/* Sub-Bab Layout: Sidebar Kiri + Konten Kanan */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Sub-Navigasi Kiri */}
        <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
            Sub-Bab Menu Profil
          </div>
          {[
            {
              id: 'sejarah',
              label: '1. Sejarah',
              desc: 'Latar belakang & 3 paragraf sejarah',
              icon: History
            },
            {
              id: 'visi_misi',
              label: '2. Visi & Misi',
              desc: 'Visi, misi & 4 core values',
              icon: Target
            },
            {
              id: 'program_unggulan',
              label: `3. 7 Program Unggulan (${settings.featuredPrograms?.length || 0})`,
              desc: 'Pilar program keunggulan',
              icon: Sparkles
            },
            {
              id: 'prestasi',
              label: `4. Prestasi Sekolah & Siswa (${settings.achievements?.length || 0})`,
              desc: 'Capaian ASPD, MTQ, O2SN',
              icon: Trophy
            },
            {
              id: 'dewan_guru',
              label: `5. Dewan Guru & Asatidz (${teachers.length})`,
              desc: 'Profil asatidz & dewan guru',
              icon: Users
            },
            {
              id: 'legalitas',
              label: `6. Legalitas & Akreditasi (${settings.legalitas?.length || 0})`,
              desc: 'NPSN, SK & izin operasional',
              icon: FileText
            }
          ].map(sub => {
            const Icon = sub.icon;
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-start gap-2.5 ${
                  isActive
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{sub.label}</span>
                  <span className={`text-[10px] font-normal mt-0.5 truncate ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {sub.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Panel Konten Kanan */}
        <div className="flex-1 min-w-0 w-full space-y-6">

          {/* ========================================================================= */}
          {/* 1. SEJARAH */}
          {/* ========================================================================= */}
          {activeSubTab === 'sejarah' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-800" />
                  <span>Latar Belakang &amp; Sejarah Berdirinya Sekolah</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Teks ini tampil pada bagian atas halaman Profil sekolah di bawah judul utama.
                </p>
              </div>

              {/* Banner Foto Profil */}
              <div>
                <ThumbnailUploader
                  label="Foto Banner Utama Halaman Profil"
                  value={settings.profileBannerImageUrl || ''}
                  onChange={url => onUpdateSettings({ ...settings, profileBannerImageUrl: url })}
                  onUploadFile={(file, label) =>
                    handleFileUpload(file, url => onUpdateSettings({ ...settings, profileBannerImageUrl: url }), label)
                  }
                  aspectRatio="video"
                  fit="cover"
                  helperText="Rekomendasi foto lanskap bangunan atau lingkungan asri sekolah SDQU Al I'tisham Playen"
                />
              </div>

              {/* Ringkasan Profil Singkat */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ringkasan Profil Singkat (Tampil di Bawah Judul Utama)</label>
                <textarea
                  rows={2}
                  value={settings.shortProfile || ''}
                  onChange={e => onUpdateSettings({ ...settings, shortProfile: e.target.value })}
                  placeholder="Ringkasan dedikasi SDQU Al I'tisham Playen..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              {/* 2 Foto Sejarah (Tampil berdampingan di sisi kiri teks sejarah halaman Profil) */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>2 Foto Dokumentasi Latar Belakang &amp; Sejarah</span>
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kedua foto ini tampil berdampingan di sisi kiri seksi "Latar Belakang &amp; Sejarah" pada halaman Profil publik.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <ThumbnailUploader
                      label="Foto Sejarah 1 (Atas / Kiri)"
                      value={settings.historyImageUrl1 || ''}
                      onChange={url => onUpdateSettings({ ...settings, historyImageUrl1: url })}
                      onUploadFile={(file, label) =>
                        handleFileUpload(file, url => onUpdateSettings({ ...settings, historyImageUrl1: url }), label)
                      }
                      aspectRatio="video"
                      fit="cover"
                      defaultFallback="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
                      helperText="Dokumentasi awal pendirian, kelas, atau kegiatan santri masa lampau"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <ThumbnailUploader
                      label="Foto Sejarah 2 (Bawah / Kanan)"
                      value={settings.historyImageUrl2 || ''}
                      onChange={url => onUpdateSettings({ ...settings, historyImageUrl2: url })}
                      onUploadFile={(file, label) =>
                        handleFileUpload(file, url => onUpdateSettings({ ...settings, historyImageUrl2: url }), label)
                      }
                      aspectRatio="video"
                      fit="cover"
                      defaultFallback="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                      helperText="Dokumentasi halaqah Al-Qur'an, asatidz, atau santri berprestasi"
                    />
                  </div>
                </div>
              </div>

              {/* Paragraf 1 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sejarah Paragraf 1 (Awal Mula &amp; Pendirian)</label>
                <textarea
                  rows={3}
                  value={settings.historyPart1 || ''}
                  onChange={e => onUpdateSettings({ ...settings, historyPart1: e.target.value })}
                  placeholder="Kisah pendirian sekolah..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              {/* Paragraf 2 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sejarah Paragraf 2 (Perkembangan Kurikulum &amp; Prestasi)</label>
                <textarea
                  rows={3}
                  value={settings.historyPart2 || ''}
                  onChange={e => onUpdateSettings({ ...settings, historyPart2: e.target.value })}
                  placeholder="Perkembangan metode tahfidz dan sains..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              {/* Paragraf 3 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sejarah Paragraf 3 (Visi Masa Depan &amp; Komitmen - Opsional)</label>
                <textarea
                  rows={3}
                  value={settings.historyPart3 || ''}
                  onChange={e => onUpdateSettings({ ...settings, historyPart3: e.target.value })}
                  placeholder="Komitmen berkelanjutan sekolah..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. VISI & MISI */}
          {/* ========================================================================= */}
          {activeSubTab === 'visi_misi' && (
            <div className="space-y-8">
              {/* Visi */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Visi Utama Lembaga
                </label>
                <textarea
                  rows={2}
                  value={settings.vision || ''}
                  onChange={e => onUpdateSettings({ ...settings, vision: e.target.value })}
                  placeholder="Tuliskan visi utama sekolah..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              {/* Misi */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                      Misi Strategis Lembaga ({settings.missions?.length || 0} Butir)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Butir-butir misi yang tampil pada kartu misi di halaman Profil.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(settings.missions || []), 'Misi strategis baru...'];
                      onUpdateSettings({ ...settings, missions: updated });
                    }}
                    className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Misi</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(settings.missions || []).map((misi, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={misi}
                        onChange={e => {
                          const updated = [...(settings.missions || [])];
                          updated[idx] = e.target.value;
                          onUpdateSettings({ ...settings, missions: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 bg-white"
                        placeholder={`Misi butir #${idx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          requestDelete('Hapus Butir Misi', `Apakah Anda yakin ingin menghapus misi butir #${idx + 1}?`, () => {
                            const updated = settings.missions?.filter((_, i) => i !== idx);
                            onUpdateSettings({ ...settings, missions: updated });
                          });
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                        title="Hapus Misi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Nilai Utama Sekolah (Core Values) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-800" />
                      <span>Karakter &amp; Core Values Sekolah</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pilar nilai karakter santri yang ditampilkan dalam kartu nilai di halaman Profil.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...(settings.coreValues || []),
                        {
                          id: 'val-' + Date.now(),
                          title: 'Nilai Baru',
                          desc: 'Penjelasan karakter dan budaya santri...'
                        }
                      ];
                      onUpdateSettings({ ...settings, coreValues: updated });
                    }}
                    className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Pilar Nilai</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Tagline Bagian</label>
                    <input
                      type="text"
                      value={settings.coreValuesHeaderTagline || ''}
                      onChange={e => onUpdateSettings({ ...settings, coreValuesHeaderTagline: e.target.value })}
                      placeholder="NILAI &amp; BUDAYA SEKOLAH"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Judul Bagian</label>
                    <input
                      type="text"
                      value={settings.coreValuesHeaderTitle || ''}
                      onChange={e => onUpdateSettings({ ...settings, coreValuesHeaderTitle: e.target.value })}
                      placeholder="Empat Pilar Karakter Lulusan"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(settings.coreValues || []).map((cv, idx) => (
                    <div key={cv.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                          Pilar #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            requestDelete(
                              'Hapus Pilar Nilai',
                              `Hapus pilar karakter "${cv.title || `Pilar #${idx + 1}`}" dari daftar?`,
                              () => {
                                const updated = settings.coreValues?.filter((_, i) => i !== idx);
                                onUpdateSettings({ ...settings, coreValues: updated });
                              }
                            );
                          }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Judul Nilai</label>
                        <input
                          type="text"
                          value={cv.title}
                          onChange={e => {
                            const updated = [...(settings.coreValues || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            onUpdateSettings({ ...settings, coreValues: updated });
                          }}
                          placeholder="Contoh: Al-I'tisham (Keteguhan)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Penjelasan Karakter</label>
                        <textarea
                          rows={2}
                          value={cv.desc || (cv as any).description || ''}
                          onChange={e => {
                            const updated = [...(settings.coreValues || [])];
                            updated[idx] = {
                              ...updated[idx],
                              desc: e.target.value,
                              description: e.target.value
                            };
                            onUpdateSettings({ ...settings, coreValues: updated });
                          }}
                          placeholder="Penjelasan pilar nilai karakter..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. 7 PROGRAM UNGGULAN */}
          {/* ========================================================================= */}
          {activeSubTab === 'program_unggulan' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-800" />
                    <span>7 Program Unggulan Sekolah</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Program keunggulan yang ditampilkan pada Beranda dan Profil sekolah.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(settings.featuredPrograms || []), 'Program Unggulan Baru'];
                    onUpdateSettings({ ...settings, featuredPrograms: updated });
                  }}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Program</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(settings.featuredPrograms || []).map((prog, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={prog}
                      onChange={e => {
                        const updated = [...(settings.featuredPrograms || [])];
                        updated[idx] = e.target.value;
                        onUpdateSettings({ ...settings, featuredPrograms: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 bg-white font-medium"
                      placeholder="Nama Program Unggulan"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        requestDelete(
                          'Hapus Program Unggulan',
                          `Hapus "${prog || `Program #${idx + 1}`}" dari daftar?`,
                          () => {
                            const updated = settings.featuredPrograms?.filter((_, i) => i !== idx);
                            onUpdateSettings({ ...settings, featuredPrograms: updated });
                          }
                        );
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                      title="Hapus Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. PRESTASI SEKOLAH & SISWA */}
          {/* ========================================================================= */}
          {activeSubTab === 'prestasi' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-800" />
                    <span>Rekam Jejak Prestasi Sekolah &amp; Siswa</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data capaian ASPD, MTQ, O2SN, FLS2N serta upload foto dokumentasi piala/piagam kejuaraan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: AchievementItem = {
                      id: 'ach-' + Date.now(),
                      category: 'ASPD',
                      year: new Date().getFullYear().toString(),
                      kapanewon: 'Peringkat 1',
                      kabupaten: 'Peringkat Unggul',
                      description: 'Keterangan capaian prestasi santri atau sekolah...',
                      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'
                    };
                    onUpdateSettings({
                      ...settings,
                      achievements: [...(settings.achievements || []), newItem]
                    });
                  }}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Prestasi</span>
                </button>
              </div>

              {/* Header Teks Bagian Prestasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Tagline Bagian Prestasi</label>
                  <input
                    type="text"
                    value={settings.prestasiHeaderTagline || ''}
                    onChange={e => onUpdateSettings({ ...settings, prestasiHeaderTagline: e.target.value })}
                    placeholder="JEJAK KEUNGGULAN &amp; PRESTASI"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Judul Bagian Prestasi</label>
                  <input
                    type="text"
                    value={settings.prestasiHeaderTitle || ''}
                    onChange={e => onUpdateSettings({ ...settings, prestasiHeaderTitle: e.target.value })}
                    placeholder="Capaian Membanggakan Santri &amp; Sekolah"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Bagian Prestasi</label>
                  <textarea
                    rows={2}
                    value={settings.prestasiHeaderDesc || ''}
                    onChange={e => onUpdateSettings({ ...settings, prestasiHeaderDesc: e.target.value })}
                    placeholder="Deskripsi pengantar capaian prestasi santri..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Daftar Kartu Prestasi dengan Full CRUD */}
              <div className="space-y-4">
                {(settings.achievements || []).map((ach, idx) => (
                  <div key={ach.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-950">
                          Prestasi #{idx + 1} ({ach.category} {ach.year})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          requestDelete(
                            'Hapus Rekam Prestasi',
                            `Hapus data prestasi ${ach.category} tahun ${ach.year}?`,
                            () => {
                              const updated = settings.achievements?.filter((_, i) => i !== idx);
                              onUpdateSettings({ ...settings, achievements: updated });
                            }
                          );
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Kategori</label>
                        <select
                          value={ach.category}
                          onChange={e => {
                            const updated = [...(settings.achievements || [])];
                            updated[idx].category = e.target.value as any;
                            onUpdateSettings({ ...settings, achievements: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        >
                          <option value="ASPD">ASPD</option>
                          <option value="MTQ">MTQ</option>
                          <option value="O2SN">O2SN</option>
                          <option value="FLS2N">FLS2N</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Tahun</label>
                        <input
                          type="text"
                          value={ach.year}
                          onChange={e => {
                            const updated = [...(settings.achievements || [])];
                            updated[idx].year = e.target.value;
                            onUpdateSettings({ ...settings, achievements: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Capaian Kapanewon</label>
                        <input
                          type="text"
                          value={ach.kapanewon || ''}
                          onChange={e => {
                            const updated = [...(settings.achievements || [])];
                            updated[idx].kapanewon = e.target.value;
                            onUpdateSettings({ ...settings, achievements: updated });
                          }}
                          placeholder="Contoh: Juara 1"
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Capaian Kabupaten</label>
                        <input
                          type="text"
                          value={ach.kabupaten || ''}
                          onChange={e => {
                            const updated = [...(settings.achievements || [])];
                            updated[idx].kabupaten = e.target.value;
                            onUpdateSettings({ ...settings, achievements: updated });
                          }}
                          placeholder="Contoh: Peringkat 2"
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">Deskripsi Prestasi</label>
                      <textarea
                        rows={2}
                        value={ach.description}
                        onChange={e => {
                          const updated = [...(settings.achievements || [])];
                          updated[idx].description = e.target.value;
                          onUpdateSettings({ ...settings, achievements: updated });
                        }}
                        placeholder="Uraian prestasi yang diraih santri..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    {/* Thumbnail Uploader for Achievement */}
                    <div>
                      <ThumbnailUploader
                        label={`Foto Dokumentasi Prestasi (${ach.category} - ${ach.year})`}
                        value={ach.imageUrl || ''}
                        onChange={url => {
                          const updated = [...(settings.achievements || [])];
                          updated[idx].imageUrl = url;
                          onUpdateSettings({ ...settings, achievements: updated });
                        }}
                        onUploadFile={(file, label) =>
                          handleFileUpload(file, url => {
                            const updated = [...(settings.achievements || [])];
                            updated[idx].imageUrl = url;
                            onUpdateSettings({ ...settings, achievements: updated });
                          }, label)
                        }
                        aspectRatio="video"
                        fit="cover"
                        helperText="Pilih foto piala, piagam penghargaan, atau foto santri berprestasi"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. DEWAN GURU & ASATIDZ */}
          {/* ========================================================================= */}
          {activeSubTab === 'dewan_guru' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-800" />
                    <span>Dewan Guru &amp; Asatidz ({teachers.length} Asatidz)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola nama, gelar, jabatan, spesialisasi dan foto dewan pengajar sekolah.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTeacherId(null);
                      setTeachersSubView(teachersSubView === 'list' ? 'add' : 'list');
                    }}
                    className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{teachersSubView === 'list' ? 'Tambah Guru Baru' : 'Lihat Daftar Asatidz'}</span>
                  </button>
                </div>
              </div>

              {/* Header Teks Bagian Asatidz */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Tagline Bagian Guru &amp; Asatidz</label>
                  <input
                    type="text"
                    value={settings.teachersHeaderTagline || ''}
                    onChange={e => onUpdateSettings({ ...settings, teachersHeaderTagline: e.target.value })}
                    placeholder="TENAGA PENDIDIK &amp; ASATIDZ"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Judul Bagian Guru &amp; Asatidz</label>
                  <input
                    type="text"
                    value={settings.teachersHeaderTitle || ''}
                    onChange={e => onUpdateSettings({ ...settings, teachersHeaderTitle: e.target.value })}
                    placeholder="Dibina oleh Asatidz Berpengalaman &amp; Berijazah Sanad"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Bagian Guru &amp; Asatidz</label>
                  <textarea
                    rows={2}
                    value={settings.teachersHeaderDesc || ''}
                    onChange={e => onUpdateSettings({ ...settings, teachersHeaderDesc: e.target.value })}
                    placeholder="Dewan asatidz yang mengampu di SD Qur'an Unggulan Al I'tisham..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Form Tambah Guru Baru */}
              {teachersSubView === 'add' && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900">Formulir Pendidik Baru:</span>
                    <button
                      type="button"
                      onClick={() => setTeachersSubView('list')}
                      className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tutup</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Nama Lengkap &amp; Gelar *</label>
                      <input
                        type="text"
                        value={newTeacherName}
                        onChange={e => setNewTeacherName(e.target.value)}
                        placeholder="Contoh: Ustadzah Maryam, S.Pd.I."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Jabatan / Amanah</label>
                      <input
                        type="text"
                        value={newTeacherRole}
                        onChange={e => setNewTeacherRole(e.target.value)}
                        placeholder="Contoh: Guru Kelas 1 / Koordinator Al-Qur'an"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Spesialisasi Pengajaran</label>
                      <input
                        type="text"
                        value={newTeacherSpecialty}
                        onChange={e => setNewTeacherSpecialty(e.target.value)}
                        placeholder="Contoh: Tahfidz Mutqin &amp; Bahasa Arab"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Pendidikan Terakhir</label>
                      <input
                        type="text"
                        value={newTeacherEducation}
                        onChange={e => setNewTeacherEducation(e.target.value)}
                        placeholder="Contoh: S.Pd.I. / Al-Azhar Kairo"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <ThumbnailUploader
                      label="Foto Formal Asatidz (Rasio Persegi/Potret)"
                      value={newTeacherImage}
                      onChange={setNewTeacherImage}
                      onUploadFile={(file, label) => handleFileUpload(file, setNewTeacherImage, label)}
                      aspectRatio="square"
                      fit="cover"
                      helperText="Unggah foto santun berbusana muslim/muslimah rapi"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setTeachersSubView('list')}
                      className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateTeacher}
                      className="px-5 py-2 text-xs bg-emerald-900 text-white font-bold rounded-xl hover:bg-emerald-800"
                    >
                      Simpan Guru Baru
                    </button>
                  </div>
                </div>
              )}

              {/* Form Edit Guru (Bila Aktif) */}
              {editingTeacherId && (
                <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Edit Data Pendidik: {editTeacherName}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingTeacherId(null)}
                      className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Batal Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Nama Lengkap &amp; Gelar *</label>
                      <input
                        type="text"
                        value={editTeacherName}
                        onChange={e => setEditTeacherName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Jabatan / Amanah</label>
                      <input
                        type="text"
                        value={editTeacherRole}
                        onChange={e => setEditTeacherRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Spesialisasi</label>
                      <input
                        type="text"
                        value={editTeacherSpecialty}
                        onChange={e => setEditTeacherSpecialty(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Pendidikan Terakhir</label>
                      <input
                        type="text"
                        value={editTeacherEducation}
                        onChange={e => setEditTeacherEducation(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <ThumbnailUploader
                      label="Foto Asatidz"
                      value={editTeacherImage}
                      onChange={setEditTeacherImage}
                      onUploadFile={(file, label) => handleFileUpload(file, setEditTeacherImage, label)}
                      aspectRatio="square"
                      fit="cover"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingTeacherId(null)}
                      className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEditTeacher}
                      className="px-5 py-2 text-xs bg-emerald-900 text-white font-bold rounded-xl hover:bg-emerald-800 flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Guru</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Daftar Asatidz Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map(tc => (
                  <div
                    key={tc.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={getOptimizedImageUrl(tc.imageUrl, "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80")}
                        alt={tc.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                        onError={e => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{tc.name}</h5>
                        <p className="text-[11px] font-semibold text-emerald-800 truncate">{tc.role}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{tc.specialty}</p>
                        <span className="inline-block mt-1 bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {tc.education}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleStartEditTeacher(tc)}
                        className="text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          requestDelete('Hapus Data Asatidz', `Hapus data ustadz/ustadzah "${tc.name}"?`, () => {
                            onDeleteTeacher(tc.id);
                          });
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. LEGALITAS & AKREDITASI */}
          {/* ========================================================================= */}
          {activeSubTab === 'legalitas' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-800" />
                    <span>Legalitas &amp; Akreditasi Sekolah</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data NPSN, akreditasi BAN S/M, yayasan, dan daftar dokumen izin operasional resmi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: LegalitasItem = {
                      id: 'leg-' + Date.now(),
                      title: 'Surat Izin Operasional',
                      nomor: 'SK-Nomor-...',
                      instansi: 'Kementerian Agama / Kemendikbud',
                      tanggal: 'Tahun ...'
                    };
                    onUpdateSettings({
                      ...settings,
                      legalitas: [...(settings.legalitas || []), newItem]
                    });
                  }}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Dokumen</span>
                </button>
              </div>

              {/* Data Pokok Akreditasi */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  Identitas Legalitas Pokok
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">NPSN</label>
                    <input
                      type="text"
                      value={settings.npsn || ''}
                      onChange={e => onUpdateSettings({ ...settings, npsn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Akreditasi BAN S/M</label>
                    <input
                      type="text"
                      value={settings.accreditation || ''}
                      onChange={e => onUpdateSettings({ ...settings, accreditation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold text-emerald-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">SK Akreditasi</label>
                    <input
                      type="text"
                      value={settings.skAkreditasi || ''}
                      onChange={e => onUpdateSettings({ ...settings, skAkreditasi: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Yayasan Penyelenggara</label>
                    <input
                      type="text"
                      value={settings.foundation || ''}
                      onChange={e => onUpdateSettings({ ...settings, foundation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline & Judul Section Legalitas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Tagline Bagian Legalitas</label>
                  <input
                    type="text"
                    value={settings.legalitasHeaderTagline || ''}
                    onChange={e => onUpdateSettings({ ...settings, legalitasHeaderTagline: e.target.value })}
                    placeholder="PAYUNG HUKUM &amp; KELAYAKAN"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Judul Bagian Legalitas</label>
                  <input
                    type="text"
                    value={settings.legalitasHeaderTitle || ''}
                    onChange={e => onUpdateSettings({ ...settings, legalitasHeaderTitle: e.target.value })}
                    placeholder="Legalitas Resmi &amp; Akreditasi Lembaga"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  />
                </div>
              </div>

              {/* Daftar Dokumen Izin & SK dengan Full CRUD */}
              <div className="space-y-3">
                {(settings.legalitas || []).map((leg, idx) => (
                  <div key={leg.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{leg.title || `Dokumen #${idx + 1}`}</span>
                      <button
                        type="button"
                        onClick={() => {
                          requestDelete(
                            'Hapus Dokumen Legalitas',
                            `Hapus dokumen izin/legalitas "${leg.title || `Dokumen #${idx + 1}`}"?`,
                            () => {
                              const updated = settings.legalitas?.filter((_, i) => i !== idx);
                              onUpdateSettings({ ...settings, legalitas: updated });
                            }
                          );
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Nama Dokumen</label>
                        <input
                          type="text"
                          value={leg.title}
                          onChange={e => {
                            const updated = [...(settings.legalitas || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            onUpdateSettings({ ...settings, legalitas: updated });
                          }}
                          placeholder="Nama Dokumen"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Nomor SK / Izin</label>
                        <input
                          type="text"
                          value={leg.nomor || ''}
                          onChange={e => {
                            const updated = [...(settings.legalitas || [])];
                            updated[idx] = { ...updated[idx], nomor: e.target.value };
                            onUpdateSettings({ ...settings, legalitas: updated });
                          }}
                          placeholder="Nomor SK / Izin"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block">Penerbit SK / Instansi</label>
                        <input
                          type="text"
                          value={leg.instansi || ''}
                          onChange={e => {
                            const updated = [...(settings.legalitas || [])];
                            updated[idx] = { ...updated[idx], instansi: e.target.value };
                            onUpdateSettings({ ...settings, legalitas: updated });
                          }}
                          placeholder="Penerbit SK"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </form>
  );
};
