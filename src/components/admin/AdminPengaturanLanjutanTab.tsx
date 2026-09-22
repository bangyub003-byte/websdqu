import React, { useState } from 'react';
import { SchoolSettings } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Database,
  KeyRound,
  Sliders,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Copy
} from 'lucide-react';

interface AdminPengaturanLanjutanTabProps {
  settings: SchoolSettings;
  dataService: typeof dataService;
  spreadsheetIdInput: string;
  setSpreadsheetIdInput: (val: string) => void;
  driveFolderIdInput: string;
  setDriveFolderIdInput: (val: string) => void;
  appsScriptUrlInput: string;
  setAppsScriptUrlInput: (val: string) => void;
  handleSaveGoogleSettings: (e: React.FormEvent) => void;
  appsScriptSaved: boolean;
  handleSyncGoogle: () => void;
  isSyncing: boolean;
  syncFeedback: { success: boolean; message: string } | null;
  handleFormatSheets: () => void;
  isFormattingSheets: boolean;
  handleTestConnection: () => void;
  isTestingConnection: boolean;
  testConnectionFeedback: { success: boolean; message: string; details?: any } | null;
  copiedCode: boolean;
  setCopiedCode: (val: boolean) => void;
  handleExportDatabase: () => void;
  handleImportDatabase: (file: File) => void;
  backupFeedback: { success: boolean; message: string } | null;
  setBackupFeedback: (val: { success: boolean; message: string } | null) => void;
  requestDelete: (title: string, message: string, onConfirm: () => void) => void;
  activeSubTab?: 'database' | 'security' | 'google';
  onChangeSubTab?: (sub: 'database' | 'security' | 'google') => void;
}

export const AdminPengaturanLanjutanTab: React.FC<AdminPengaturanLanjutanTabProps> = ({
  settings,
  dataService,
  spreadsheetIdInput,
  setSpreadsheetIdInput,
  driveFolderIdInput,
  setDriveFolderIdInput,
  appsScriptUrlInput,
  setAppsScriptUrlInput,
  handleSaveGoogleSettings,
  appsScriptSaved,
  handleSyncGoogle,
  isSyncing,
  syncFeedback,
  handleFormatSheets,
  isFormattingSheets,
  handleTestConnection,
  isTestingConnection,
  testConnectionFeedback,
  copiedCode,
  setCopiedCode,
  handleExportDatabase,
  handleImportDatabase,
  backupFeedback,
  setBackupFeedback,
  requestDelete,
  activeSubTab: externalSubTab,
  onChangeSubTab
}) => {
  // Local active sub-tab state (can also be controlled externally)
  const [internalSubTab, setInternalSubTab] = useState<'database' | 'security' | 'google'>('database');
  const activeSubTab = externalSubTab || internalSubTab;
  const setSubTab = (tab: 'database' | 'security' | 'google') => {
    setInternalSubTab(tab);
    if (onChangeSubTab) {
      onChangeSubTab(tab);
    }
  };

  // Sub-tab inner navigation state
  const [publishSubTab, setPublishSubTab] = useState<'backup' | 'guide'>('backup');
  const [securitySubTab, setSecuritySubTab] = useState<'password' | 'tips'>('password');
  const [googleSubTab, setGoogleSubTab] = useState<'config' | 'actions'>('config');

  // Password change local state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setPwdFeedback({ success: false, message: 'Semua kolom kata sandi wajib diisi.' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPwdFeedback({ success: false, message: 'Konfirmasi kata sandi baru tidak sesuai.' });
      return;
    }
    if (newPasswordInput.length < 6) {
      setPwdFeedback({ success: false, message: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }

    const ok = dataService.updatePassword(currentPasswordInput, newPasswordInput);
    if (ok) {
      setPwdFeedback({ success: true, message: 'Kata sandi admin berhasil diperbarui!' });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setTimeout(() => setPwdFeedback(null), 4000);
    } else {
      setPwdFeedback({ success: false, message: 'Kata sandi lama yang Anda masukkan salah.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-800" />
                <span>Pengaturan Lanjutan &amp; Pemeliharaan Sistem</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pusat kendali teknis madrasah: cadangan &amp; pemulihan database, keamanan sandi admin, dan sinkronisasi Google Spreadsheet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Menu Khusus Teknisi / Admin TU
            </span>
          </div>
        </div>

        {/* Pola Sidebar Kiri + Konten Kanan */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Sidebar Navigasi Kiri */}
          <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
              Sub-Bab Pengaturan Lanjutan
            </div>

            {[
              {
                id: 'database',
                label: '1. Cadangan & Database',
                desc: 'Sinkronisasi, ekspor/impor JSON, reset default',
                icon: Database
              },
              {
                id: 'security',
                label: '2. Keamanan Sandi',
                desc: 'Ubah sandi admin & tips keamanan TU',
                icon: KeyRound
              },
              {
                id: 'google',
                label: '3. Integrasi Apps Script',
                desc: 'ID Spreadsheet & Google Drive',
                icon: Sparkles
              }
            ].map(sub => {
              const Icon = sub.icon;
              const isActive = activeSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSubTab(sub.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <div className="flex flex-col">
                    <span>{sub.label}</span>
                    <span className={`text-[10px] font-normal mt-0.5 leading-snug ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {sub.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Panel Konten Kanan */}
          <div className="flex-1 min-w-0 w-full space-y-6">

            {/* SUB-BAB 1: CADANGAN & DATABASE */}
            {activeSubTab === 'database' && (
              <div className="space-y-6">
                {/* Secondary Pill Toggle inside Database */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setPublishSubTab('backup')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      publishSubTab === 'backup'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Cadangan &amp; Pemulihan Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishSubTab('guide')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      publishSubTab === 'guide'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Panduan Go-Live / Hosting</span>
                  </button>
                </div>

                {publishSubTab === 'backup' && (
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                            Sinkronisasi Realtime Aktif
                          </span>
                          <span className="text-xs text-slate-400">• Cross-tab &amp; Instant State</span>
                        </div>
                        <h4 className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                          Pusat Kendali Database &amp; Cadangan Realtime
                        </h4>
                        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                          Setiap perubahan teks, foto, guru, fasilitas, dan berita yang Anda simpan di panel admin ini langsung muncul seketika secara <strong>realtime</strong> di seluruh tab peramban tanpa perlu memuat ulang halaman.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleExportDatabase}
                          className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Unduh Cadangan (.JSON)</span>
                        </button>
                      </div>
                    </div>

                    {backupFeedback && (
                      <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
                        backupFeedback.success
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}>
                        {backupFeedback.success ? <Check className="w-4 h-4 text-emerald-700 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />}
                        <span>{backupFeedback.message}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Pulihkan / Impor Database Sekolah</span>
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Unggah berkas cadangan JSON yang pernah Anda unduh untuk mengembalikan seluruh konten, berita, fasilitas, dan pengaturan secara instan.
                        </p>
                        <label className="cursor-pointer bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Pilih File Backup (.json)</span>
                          <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files?.[0]) {
                                handleImportDatabase(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                        <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 text-amber-800" />
                          <span>Reset Data ke Standar Pabrik</span>
                        </h5>
                        <p className="text-xs text-amber-900/80 leading-relaxed">
                          Kembalikan seluruh teks, statistik, dan struktur halaman ke data resmi awal SDQU Al I'tisham Playen.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            requestDelete(
                              'Kembalikan ke Pengaturan Awal',
                              'Apakah Anda yakin ingin mereset seluruh data website ke pengaturan bawaan resmi? Data kustom Anda akan digantikan dengan data baku.',
                              () => {
                                dataService.resetToDefaults();
                                setBackupFeedback({ success: true, message: 'Data berhasil dikembalikan ke standar awal!' });
                                setTimeout(() => setBackupFeedback(null), 4000);
                              }
                            );
                          }}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset Konten Default</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {publishSubTab === 'guide' && (
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                        PANDUAN LENGKAP GO-LIVE
                      </span>
                      <h4 className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-2">
                        Panduan Mempublish Website Resmi SDQU Al I'tisham
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Ikuti langkah-langkah praktis di bawah ini untuk menghubungkan website ke domain resmi madrasah (.sch.id) dan hosting berkinerja tinggi.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Langkah 1 */}
                      <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                          1
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="text-sm font-bold text-slate-900">
                            Ekspor Kode Sumber (Export to ZIP / GitHub)
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Pada menu Google AI Studio di pojok kanan atas, klik tombol <strong>Settings / Export</strong>, lalu pilih <strong>Export to GitHub</strong> atau <strong>Download ZIP</strong>. Seluruh kode aplikasi React Vite &amp; Tailwind CSS siap digunakan secara mandiri.
                          </p>
                        </div>
                      </div>

                      {/* Langkah 2 */}
                      <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                          2
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="text-sm font-bold text-slate-900">
                            Deploy Cepat Gratis di Netlify atau Vercel
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Website ini dibuat menggunakan standar modern Vite SPA, sehingga dapat di-hosting gratis dan sangat cepat di Netlify (sama seperti portal PSB Anda) atau Vercel:
                          </p>
                          <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                            <li>Buka <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-emerald-800 font-bold underline">Netlify.com</a> atau <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-800 font-bold underline">Vercel.com</a>.</li>
                            <li>Pilih <strong>"Add new site"</strong> &gt; <strong>"Import an existing project"</strong> dari akun GitHub Anda.</li>
                            <li>Pengaturan Build: <code>Build command: npm run build</code> dan <code>Publish directory: dist</code>.</li>
                            <li>Klik <strong>Deploy</strong>. Dalam waktu 1 menit website Anda sudah aktif di internet!</li>
                          </ol>
                        </div>
                      </div>

                      {/* Langkah 3 */}
                      <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                          3
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="text-sm font-bold text-slate-900">
                            Menghubungkan Domain Resmi Madrasah (.sch.id)
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Untuk menjadikannya website resmi madrasah dengan kredibilitas tinggi, gunakan domain berakhiran <strong>.sch.id</strong> (contoh: <code>sdqu-alitisham.sch.id</code>):
                          </p>
                          <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                            <li>Daftarkan domain di registrar resmi (seperti Niagahoster, Idwebhost, Rumahweb, atau DomaiNesia).</li>
                            <li>Pada dashboard registrar, buka menu <strong>DNS Management</strong>.</li>
                            <li>Tambahkan <strong>CNAME Record</strong>: Host <code>www</code> mengarah ke alamat Netlify/Vercel Anda.</li>
                            <li>Tambahkan <strong>A Record</strong> atau Apex Alias mengarah ke IP Server hosting.</li>
                            <li>Sertifikat keamanan <strong>SSL (HTTPS Hijau)</strong> terbit otomatis dalam 10 menit tanpa biaya tambahan.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Langkah 4 */}
                      <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                          4
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="text-sm font-bold text-slate-900">
                            Integrasi Sempurna dengan Portal PSB Netlify
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Website ini telah dikonfigurasi langsung menampilkan formulir pendaftaran interaktif dari <code>https://psb-sdqu-alitisham.netlify.app</code> melalui iframe responsif pada halaman <strong>PSB Online</strong>. Wali santri dapat mendaftar langsung tanpa kendala tampilan di smartphone maupun laptop.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-BAB 2: KEAMANAN SANDI */}
            {activeSubTab === 'security' && (
              <div className="space-y-6">
                {/* Secondary Pill Toggle inside Security */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setSecuritySubTab('password')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      securitySubTab === 'password'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Kata Sandi Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecuritySubTab('tips')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      securitySubTab === 'tips'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Panduan Keamanan TU</span>
                  </button>
                </div>

                {securitySubTab === 'password' && (
                  <form onSubmit={handleChangePassword} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-6 max-w-xl">
                    <div className="space-y-1 border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-bold text-slate-900">Perbarui Kata Sandi Admin</h4>
                      <p className="text-xs text-slate-500">
                        Sandi tersimpan secara aman di peramban Anda dan tidak pernah diperlihatkan kepada pengunjung website.
                      </p>
                    </div>

                    {pwdFeedback && (
                      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 font-semibold ${
                        pwdFeedback.success
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {pwdFeedback.success ? <Check className="w-4 h-4 text-emerald-700 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />}
                        <span>{pwdFeedback.message}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Kata Sandi Saat Ini</label>
                        <input
                          type="password"
                          required
                          value={currentPasswordInput}
                          onChange={e => setCurrentPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Kata Sandi Baru (Minimal 6 karakter)</label>
                        <input
                          type="password"
                          required
                          value={newPasswordInput}
                          onChange={e => setNewPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi Baru</label>
                        <input
                          type="password"
                          required
                          value={confirmPasswordInput}
                          onChange={e => setConfirmPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Simpan Kata Sandi Baru</span>
                      </button>
                    </div>
                  </form>
                )}

                {securitySubTab === 'tips' && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 max-w-xl">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-800" />
                      <span>Panduan Keamanan Akun Staf TU</span>
                    </h4>
                    <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                      <p>
                        <strong>1. Rahasiakan Kata Sandi:</strong> Jangan pernah membagikan kata sandi admin ke pihak di luar pengurus yayasan atau staf tata usaha sekolah.
                      </p>
                      <p>
                        <strong>2. Buat Cadangan Berkala:</strong> Unduh file cadangan database JSON secara rutin di sub-bab <em>Cadangan &amp; Database</em> untuk mengantisipasi insiden peramban atau pergantian laptop staf.
                      </p>
                      <p>
                        <strong>3. Gunakan Sandi Kuat:</strong> Kombinasikan huruf besar, huruf kecil, dan angka dengan panjang minimal 8 karakter.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-BAB 3: INTEGRASI GOOGLE APPS SCRIPT */}
            {activeSubTab === 'google' && (
              <div className="space-y-6">
                {/* Secondary Pill Toggle inside Google */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setGoogleSubTab('config')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      googleSubTab === 'config'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Parameter &amp; Koneksi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoogleSubTab('actions')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      googleSubTab === 'actions'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Panduan Format Sheet</span>
                  </button>
                </div>

                {googleSubTab === 'config' && (
                  <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/60 shadow-lg space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-emerald-100 border border-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Integrasi Cloud Google Aktif
                          </span>
                        </div>
                        <h4 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white">
                          Koneksi Google Spreadsheet &amp; Google Drive
                        </h4>
                        <p className="text-xs text-emerald-200/80 leading-relaxed max-w-2xl">
                          Kelola ID Spreadsheet, ID Folder Drive, dan URL Web App Apps Script agar seluruh perubahan data &amp; unggahan foto otomatis tersinkron ke semua perangkat.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleFormatSheets}
                          disabled={isFormattingSheets || isSyncing || isTestingConnection}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow transition-colors disabled:opacity-50 border border-emerald-600"
                          title="Format dan isi lembar Spreadsheet agar mudah dibaca manusia"
                        >
                          <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isFormattingSheets ? 'animate-spin' : ''}`} />
                          <span>{isFormattingSheets ? 'Memformat Lembar...' : 'Format & Isi Lembar Spreadsheet'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSyncGoogle}
                          disabled={isSyncing || isFormattingSheets || isTestingConnection}
                          className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow transition-colors disabled:opacity-50"
                          title="Tarik data terbaru yang diedit di Spreadsheet"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Menyinkronkan...' : 'Tarik Data dari Spreadsheet'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Sync Feedback Message */}
                    {syncFeedback && (
                      <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${syncFeedback.success ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-700' : 'bg-rose-900/80 text-rose-100 border border-rose-700'}`}>
                        {syncFeedback.success ? <Check className="w-4 h-4 text-emerald-300 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
                        <span className="leading-relaxed">{syncFeedback.message}</span>
                      </div>
                    )}

                    {/* Form Input ID Spreadsheet, ID Drive, & URL Web App */}
                    <form onSubmit={handleSaveGoogleSettings} className="space-y-4 bg-emerald-900/40 p-5 rounded-2xl border border-emerald-800/60">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/50 pb-3">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                          Parameter Integrasi Google (Spreadsheet, Drive &amp; Apps Script)
                        </span>
                        {appsScriptSaved && (
                          <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 bg-emerald-800/80 px-2.5 py-1 rounded-lg">
                            <Check className="w-3.5 h-3.5" />
                            <span>Semua ID &amp; URL Berhasil Disimpan!</span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-emerald-100 flex items-center justify-between">
                            <span>ID Google Spreadsheet:</span>
                            <span className="text-[10px] text-emerald-300/80 font-normal">Dari URL docs.google.com/spreadsheets/d/<b>ID</b>/edit</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={spreadsheetIdInput}
                            onChange={e => setSpreadsheetIdInput(e.target.value)}
                            placeholder="Contoh: 1A2b3C4d5E6F7g8H9i0J..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-700 text-xs font-mono text-emerald-200 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-emerald-100 flex items-center justify-between">
                            <span>ID Folder Google Drive (Upload Foto):</span>
                            <span className="text-[10px] text-emerald-300/80 font-normal">Folder tempat menyimpan foto yang diupload</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={driveFolderIdInput}
                            onChange={e => setDriveFolderIdInput(e.target.value)}
                            placeholder="Contoh: 1XYZabc123456789..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-700 text-xs font-mono text-emerald-200 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-emerald-100 flex items-center justify-between">
                          <span>URL Web App Google Apps Script (Deployment URL):</span>
                          <span className="text-[10px] text-amber-300 font-bold">Harus berakhiran /exec</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={appsScriptUrlInput}
                          onChange={e => setAppsScriptUrlInput(e.target.value)}
                          placeholder="https://script.google.com/macros/s/.../exec"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-700 text-xs font-mono text-emerald-200 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleTestConnection}
                            disabled={isTestingConnection || !appsScriptUrlInput.trim()}
                            className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                          >
                            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isTestingConnection ? 'animate-spin' : ''}`} />
                            <span>{isTestingConnection ? 'Menguji Koneksi...' : 'Uji Koneksi Web App'}</span>
                          </button>
                        </div>

                        <button
                          type="submit"
                          className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-6 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Simpan Semua ID &amp; URL</span>
                        </button>
                      </div>

                      {/* Test Connection Output */}
                      {testConnectionFeedback && (
                        <div className={`p-4 rounded-xl text-xs space-y-1 border ${testConnectionFeedback.success ? 'bg-emerald-900/90 text-emerald-100 border-emerald-600' : 'bg-rose-950/90 text-rose-200 border-rose-700'}`}>
                          <div className="font-bold flex items-center gap-1.5">
                            {testConnectionFeedback.success ? <Check className="w-4 h-4 text-emerald-300" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                            <span>{testConnectionFeedback.message}</span>
                          </div>
                          {testConnectionFeedback.details && (
                            <p className="text-[11px] font-mono opacity-80 pl-5">
                              Status: {JSON.stringify(testConnectionFeedback.details)}
                            </p>
                          )}
                        </div>
                      )}
                    </form>

                    {/* Kunci: Mengapa Otomatis Berubah di Semua HP */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>Bagaimana Website Otomatis Berubah di Semua HP Pengunjung?</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        Website ini dirancang secara <strong>real-time dinamis</strong>. Setiap kali wali santri atau pengunjung membuka website dari smartphone atau laptop, sistem langsung memanggil data terbaru dari Google Spreadsheet Anda melalui endpoint Web App Apps Script. Anda tidak perlu menyentuh Vercel atau melakukan deploy ulang setiap kali ada pergantian teks atau foto!
                      </p>
                    </div>
                  </div>
                )}

                {googleSubTab === 'actions' && (
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-bold text-slate-900">
                        Panduan Struktur Lembar Kerja (Sheets) di Google Spreadsheet
                      </h4>
                      <p className="text-xs text-slate-500">
                        Data sekolah Anda tersusun dalam 6 tab lembar kerja yang rapi dan mudah dibaca oleh staf tata usaha.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {[
                        { title: '1. Profil_Sekolah', desc: 'Nama madrasah, alamat, nomor telepon, logo URL, dan link PSB.' },
                        { title: '2. Pengumuman', desc: 'Daftar pengumuman, tanggal terbit, isi ringkas, dan status aktif.' },
                        { title: '3. Berita_Artikel', desc: 'Kumpulan berita kegiatan madrasah, foto thumbnail, dan artikel.' },
                        { title: '4. Agenda_Sekolah', desc: 'Jadwal kalender akademik, waktu pelaksanaan, dan lokasi acara.' },
                        { title: '5. Fasilitas_Sekolah', desc: 'Daftar gedung, laboratorium, ruang kelas, sarana, dan spesifikasinya.' },
                        { title: '6. Dewan_Guru', desc: 'Daftar asatidz, jabatan, bidang keahlian, dan foto profil asatidz.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-mono font-bold text-xs text-emerald-900">{item.title}</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                      <p className="text-xs text-amber-900">
                        Klik tombol di bawah ini jika lembar kerja di Spreadsheet Anda belum memiliki header kolom yang rapi:
                      </p>
                      <button
                        type="button"
                        onClick={handleFormatSheets}
                        disabled={isFormattingSheets}
                        className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50"
                      >
                        {isFormattingSheets ? 'Memformat...' : 'Format Ulang Sheets'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
