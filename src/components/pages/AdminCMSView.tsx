import React, { useState } from 'react';
import {
  ActivePage,
  Announcement,
  EventItem,
  FacilityItem,
  InfaqRecord,
  NewsItem,
  SchoolSettings,
  TeacherItem,
  AchievementItem,
  ExtracurricularItem
} from '../../types';
import { dataService } from '../../services/dataService';
import { GOOGLE_CONFIG, APPS_SCRIPT_CODE } from '../../config/googleConfig';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Megaphone,
  Newspaper,
  Calendar,
  Building,
  Users,
  Settings,
  HeartHandshake,
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  Copy,
  ExternalLink,
  Save,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  Upload,
  Download,
  Trophy,
  BookOpen,
  Sparkles,
  KeyRound,
  FileText
} from 'lucide-react';

interface AdminCMSViewProps {
  setActivePage: (page: ActivePage) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  announcements: Announcement[];
  news: NewsItem[];
  events: EventItem[];
  facilities: FacilityItem[];
  teachers: TeacherItem[];
  settings: SchoolSettings;
  infaqRecords: InfaqRecord[];
}

export const AdminCMSView: React.FC<AdminCMSViewProps> = ({
  setActivePage,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  announcements,
  news,
  events,
  facilities,
  teachers,
  settings,
  infaqRecords
}) => {
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Section
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'general_branding'
    | 'vision_missions'
    | 'programs_achievements'
    | 'facilities'
    | 'teachers'
    | 'announcements'
    | 'news'
    | 'events'
    | 'infaq'
    | 'security'
    | 'google'
    | 'publish_tutorial'
  >('overview');

  // Edit Settings State
  const [editSettings, setEditSettings] = useState<SchoolSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync settings whenever updated from dataService
  React.useEffect(() => {
    setEditSettings({ ...settings });
  }, [settings]);

  // Safe In-App Delete Confirmation Modal (never blocked by iframe security)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionLabel?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const requestDelete = (title: string, message: string, onConfirm: () => void) => {
    setDeleteModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setDeleteModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // New Announcement Modal / State
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Akademik' | 'PSB' | 'Umum'>('PSB');

  // New News Modal / State
  const [showAddNews, setShowAddNews] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'Prestasi' | 'Kegiatan' | 'Kajian' | 'Akademik'>('Kegiatan');
  const [newNewsExcerpt, setNewNewsExcerpt] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newNewsImage, setNewNewsImage] = useState('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80');
  const [newNewsAuthor, setNewNewsAuthor] = useState("Humas SDQU Al I'tisham");

  // New Event Modal / State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDateRange, setNewEventDateRange] = useState('');
  const [newEventLocation, setNewEventLocation] = useState("Kompleks SDQU Al I'tisham Playen");
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Akademik' | 'Tahfidz' | 'Parenting' | 'Sosial'>('Tahfidz');

  // Database Backup / Restore State
  const [backupFeedback, setBackupFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // New Teacher State
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherRole, setNewTeacherRole] = useState('');
  const [newTeacherSpecialty, setNewTeacherSpecialty] = useState('');
  const [newTeacherEducation, setNewTeacherEducation] = useState('');
  const [newTeacherImage, setNewTeacherImage] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80');

  // New Facility State
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [newFacName, setNewFacName] = useState('');
  const [newFacDesc, setNewFacDesc] = useState('');
  const [newFacSpecs, setNewFacSpecs] = useState('');
  const [newFacImage, setNewFacImage] = useState('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80');
  const [newFacCategory, setNewFacCategory] = useState<any>('kelas');

  // Edit Facility State
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [editFacName, setEditFacName] = useState('');
  const [editFacDesc, setEditFacDesc] = useState('');
  const [editFacSpecs, setEditFacSpecs] = useState('');
  const [editFacImage, setEditFacImage] = useState('');

  // Password Change State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Copy Code State
  const [copiedCode, setCopiedCode] = useState(false);

  // Google Apps Script Integration State
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState(dataService.getAppsScriptUrl());
  const [appsScriptSaved, setAppsScriptSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Status unggah gambar ke Google Drive & sinkronisasi cloud
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [cloudSyncMsg, setCloudSyncMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  // Helper cerdas: mengompresi gambar dan mengunggahnya ke Google Drive sekolah
  // sehingga gambar memiliki tautan publik permanen yang aktif di semua perangkat
  const handleFileUpload = async (file: File, onLoaded: (url: string) => void, label = 'Foto') => {
    setUploadingImage(`Mengompresi & mengunggah ${label} ke Google Drive sekolah...`);
    try {
      const res = await dataService.uploadImage(file, label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_'));
      if (res.url) {
        onLoaded(res.url);
        setCloudSyncMsg({ text: res.message, isError: !res.success });
        setTimeout(() => setCloudSyncMsg(null), 5000);
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) onLoaded(e.target.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (dataService.verifyAdminPassword(username, password)) {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Username atau kata sandi tidak cocok. Silakan periksa kembali.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateSettings(editSettings);
    setSettingsSaved(true);
    setCloudSyncMsg({ text: 'Menyimpan perubahan & menyinkronkan ke Google Cloud...' });
    const cloudRes = await dataService.pushToCloud();
    setCloudSyncMsg({ text: cloudRes.message, isError: !cloudRes.success });
    setTimeout(() => {
      setSettingsSaved(false);
      setCloudSyncMsg(null);
    }, 5000);
  };

  const handlePushToCloud = async () => {
    setIsSyncing(true);
    setCloudSyncMsg({ text: 'Mengunggah seluruh data CMS ke Google Spreadsheet...' });
    const res = await dataService.pushToCloud();
    setIsSyncing(false);
    setCloudSyncMsg({ text: res.message, isError: !res.success });
    setTimeout(() => setCloudSyncMsg(null), 5000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdFeedback(null);
    if (!dataService.verifyAdminPassword('admin', currentPasswordInput)) {
      setPwdFeedback({ success: false, message: 'Kata sandi saat ini tidak cocok!' });
      return;
    }
    if (newPasswordInput.length < 6) {
      setPwdFeedback({ success: false, message: 'Kata sandi baru minimal 6 karakter!' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPwdFeedback({ success: false, message: 'Konfirmasi kata sandi baru tidak sama!' });
      return;
    }
    dataService.updateAdminPassword(newPasswordInput);
    setPwdFeedback({ success: true, message: 'Kata sandi admin berhasil diperbarui!' });
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => setPwdFeedback(null), 5000);
  };

  const handleSaveAppsScriptUrl = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.setAppsScriptUrl(appsScriptUrlInput);
    setAppsScriptSaved(true);
    setTimeout(() => setAppsScriptSaved(false), 3000);
  };

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await dataService.syncFromGoogle();
    setIsSyncing(false);
    setSyncFeedback(res);
    setTimeout(() => setSyncFeedback(null), 6000);
  };

  const handleToggleAnnouncement = (id: string, current: boolean) => {
    dataService.toggleAnnouncement(id, !current);
  };

  const handleDeleteAnnouncement = (id: string) => {
    requestDelete('Hapus Pengumuman', 'Apakah Anda yakin ingin menghapus pengumuman ini?', () => {
      dataService.deleteAnnouncement(id);
    });
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle) return;

    dataService.addAnnouncement({
      title: newAnnTitle,
      content: newAnnContent,
      category: newAnnCategory,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      isActive: true
    });

    setNewAnnTitle('');
    setNewAnnContent('');
    setShowAddAnnouncement(false);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName) return;

    dataService.addTeacher({
      name: newTeacherName,
      role: newTeacherRole || 'Guru Mata Pelajaran',
      specialty: newTeacherSpecialty || 'Tahfidz Al-Qur\'an',
      education: newTeacherEducation || 'S.Pd.',
      imageUrl: newTeacherImage,
      order: teachers.length + 1
    });

    setNewTeacherName('');
    setNewTeacherRole('');
    setNewTeacherSpecialty('');
    setNewTeacherEducation('');
    setShowAddTeacher(false);
  };

  const handleDeleteTeacher = (id: string) => {
    requestDelete('Hapus Data Asatidz', 'Hapus data pengajar/asatidz ini dari sistem?', () => {
      dataService.deleteTeacher(id);
    });
  };

  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName) return;

    dataService.addFacility({
      name: newFacName,
      category: newFacCategory,
      categoryLabel: newFacCategory.toUpperCase(),
      description: newFacDesc,
      imageUrl: newFacImage,
      specs: newFacSpecs ? newFacSpecs.split(',').map(s => s.trim()).filter(Boolean) : ['Standar Mutu Sekolah']
    });

    setNewFacName('');
    setNewFacDesc('');
    setNewFacSpecs('');
    setShowAddFacility(false);
  };

  const startEditFacility = (fac: FacilityItem) => {
    setEditingFacilityId(fac.id);
    setEditFacName(fac.name);
    setEditFacDesc(fac.description);
    setEditFacSpecs(fac.specs?.join(', ') || '');
    setEditFacImage(fac.imageUrl);
  };

  const handleSaveEditFacility = (id: string) => {
    dataService.updateFacility(id, {
      name: editFacName,
      description: editFacDesc,
      imageUrl: editFacImage,
      specs: editFacSpecs ? editFacSpecs.split(',').map(s => s.trim()).filter(Boolean) : []
    });
    setEditingFacilityId(null);
  };

  const handleDeleteFacility = (id: string) => {
    requestDelete('Hapus Fasilitas', 'Hapus data fasilitas kampus ini dari sistem?', () => {
      dataService.deleteFacility(id);
    });
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle) return;

    dataService.addNews({
      title: newNewsTitle,
      category: newNewsCategory,
      excerpt: newNewsExcerpt || newNewsTitle,
      content: newNewsContent || newNewsExcerpt || newNewsTitle,
      imageUrl: newNewsImage,
      author: newNewsAuthor || "Humas SDQU Al I'tisham",
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    });

    setNewNewsTitle('');
    setNewNewsExcerpt('');
    setNewNewsContent('');
    setShowAddNews(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    dataService.addEvent({
      title: newEventTitle,
      dateRange: newEventDateRange || 'Segera Diumumkan',
      month: 'Bulan Ini',
      location: newEventLocation || "Kompleks SDQU Al I'tisham Playen",
      description: newEventDesc || newEventTitle,
      category: newEventCategory
    });

    setNewEventTitle('');
    setNewEventDateRange('');
    setNewEventDesc('');
    setShowAddEvent(false);
  };

  const handleExportDatabase = () => {
    const jsonStr = dataService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-sdqu-alitisham-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setBackupFeedback({ success: true, message: 'Cadangan database (.json) berhasil diunduh!' });
    setTimeout(() => setBackupFeedback(null), 4000);
  };

  const handleImportDatabase = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const ok = dataService.importDatabaseJSON(content);
        if (ok) {
          setBackupFeedback({ success: true, message: 'Database sekolah berhasil dipulihkan secara realtime!' });
        } else {
          setBackupFeedback({ success: false, message: 'Format berkas cadangan JSON tidak cocok!' });
        }
        setTimeout(() => setBackupFeedback(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  // IF NOT LOGGED IN -> RENDER LOGIN FORM
  // Note: Public credentials display is intentionally removed per user request.
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-400 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Portal Admin CMS
          </h2>
          <p className="text-xs text-slate-500">
            Masuk untuk mengelola seluruh konten, teks, logo, foto, fasilitas, dan pengaturan SDQU Al I'tisham Playen.
          </p>
        </div>

        {loginError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Username Admin</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Masuk ke Dashboard CMS</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setActivePage('beranda')}
            className="text-xs text-slate-500 hover:text-emerald-900 font-semibold"
          >
            ← Kembali ke Beranda Sekolah
          </button>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Top Bar Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              Panel Pengelola CMS • {editSettings.schoolName}
            </h1>
            <p className="text-xs text-slate-500">
              Akses penuh mengedit seluruh halaman: logo, foto, teks visi misi, program, fasilitas, dan berita.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePushToCloud}
            disabled={isSyncing}
            className="text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            title="Kirim dan sinkronkan semua perubahan ke Google Cloud agar tampil di semua perangkat"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Lintas Perangkat'}</span>
          </button>

          <button
            onClick={() => setActivePage('beranda')}
            className="text-xs font-bold text-slate-600 hover:text-emerald-900 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification for Cloud Sync & Image Uploads */}
      {(uploadingImage || cloudSyncMsg) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          {uploadingImage ? (
            <>
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-amber-300">{uploadingImage}</p>
                <p className="text-[11px] text-slate-300">File disimpan permanen ke Google Drive &amp; aktif di semua perangkat.</p>
              </div>
            </>
          ) : cloudSyncMsg ? (
            <>
              {cloudSyncMsg.isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <div className="text-xs">
                <p className="font-bold text-white">{cloudSyncMsg.text}</p>
                <p className="text-[10px] text-slate-300">Semua perangkat &amp; smartphone otomatis menampilkan data terbaru.</p>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Navigation Tabs (Responsive horizontally scrollable on mobile) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'overview', label: 'Ringkasan', icon: Database },
          { id: 'general_branding', label: 'Pengaturan & Hero Beranda', icon: Settings },
          { id: 'vision_missions', label: 'Visi, Misi & Sejarah', icon: BookOpen },
          { id: 'programs_achievements', label: 'Program & Prestasi', icon: Trophy },
          { id: 'facilities', label: `Fasilitas (${facilities.length})`, icon: Building },
          { id: 'teachers', label: `Guru & Asatidz (${teachers.length})`, icon: Users },
          { id: 'announcements', label: `Pengumuman (${announcements.length})`, icon: Megaphone },
          { id: 'news', label: `Berita (${news.length})`, icon: Newspaper },
          { id: 'events', label: `Agenda (${events.length})`, icon: Calendar },
          { id: 'infaq', label: `Infaq & QRIS (${infaqRecords.length})`, icon: HeartHandshake },
          { id: 'publish_tutorial', label: 'Publikasi Web & Database', icon: Sparkles },
          { id: 'security', label: 'Keamanan Sandi', icon: KeyRound },
          { id: 'google', label: 'Integrasi Google Apps Script', icon: Database }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* PSB Online Netlify Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs text-slate-500 font-semibold">Portal PSB Online</div>
              <div className="text-sm font-extrabold text-emerald-900 flex items-center gap-1 truncate">
                <span>Netlify Iframe</span>
              </div>
              <a
                href={editSettings.psbIframeUrl || "https://psb-sdqu-alitisham.netlify.app"}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 pt-1"
              >
                <span>Buka Portal PSB</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs text-slate-500 font-semibold">Pengumuman Aktif</div>
              <div className="text-3xl font-extrabold text-amber-700">
                {announcements.filter(a => a.isActive).length}
              </div>
              <div className="text-[11px] text-slate-500">Dari total {announcements.length} pengumuman</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs text-slate-500 font-semibold">Dewan Asatidz</div>
              <div className="text-3xl font-extrabold text-teal-900">{teachers.length} Asatidz</div>
              <div className="text-[11px] text-teal-800 font-bold">100% Terdaftar Aktif</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="text-xs text-slate-500 font-semibold">Fasilitas Kampus</div>
              <div className="text-3xl font-extrabold text-indigo-950">{facilities.length} Sarana</div>
              <div className="text-[11px] text-indigo-800 font-bold">Ruang Kelas, Lab, Masjid dll.</div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  STATUS SISTEM WEB &amp; DATABASE
                </span>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  AKTIF &amp; TERHUBUNG
                </span>
              </div>
              <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1 flex-wrap">
                <span>URL PSB Online:</span>
                <code className="font-mono bg-white px-2 py-0.5 rounded text-[11px] max-w-sm truncate inline-block align-middle">{editSettings.psbIframeUrl}</code>
              </div>
              <div className="text-xs text-emerald-800">
                Google Apps Script: <code className="font-mono bg-white px-2 py-0.5 rounded text-xs truncate max-w-sm inline-block align-middle">{appsScriptUrlInput}</code>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSyncGoogle}
                disabled={isSyncing}
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PENGATURAN UMUM & MEDIA BRANDING */}
      {activeTab === 'general_branding' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pengaturan Umum, Logo &amp; Media Gambar
              </h3>
              <p className="text-xs text-slate-500">
                Ubah logo, banner foto, identitas sekolah, kontak, dan link PSB secara langsung.
              </p>
            </div>

            {settingsSaved && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Pengaturan Berhasil Disimpan!</span>
              </span>
            )}
          </div>

          {/* Section: Logo & Media Images */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>Logo &amp; Banner Gambar Website</span>
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Logo Sekolah */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">Logo Sekolah</label>
                <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-center mx-auto overflow-hidden">
                  <img
                    src={editSettings.logoUrl || '/images/logo.png'}
                    alt="Preview Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">URL Gambar Logo:</label>
                  <input
                    type="text"
                    value={editSettings.logoUrl || ''}
                    onChange={e => setEditSettings({ ...editSettings, logoUrl: e.target.value })}
                    placeholder="/images/logo.png atau https://..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <label className="cursor-pointer bg-emerald-900 hover:bg-emerald-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Pilih File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], url => setEditSettings({ ...editSettings, logoUrl: url }));
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditSettings({ ...editSettings, logoUrl: '/images/logo.png' })}
                      className="text-[10px] text-slate-600 hover:text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded-lg"
                    >
                      Reset Bawaan
                    </button>
                  </div>
                </div>
              </div>

              {/* Banner Hero Beranda */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">Foto Banner Hero Beranda</label>
                <div className="h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={editSettings.heroImageUrl || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"}
                    alt="Preview Hero"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">URL Gambar Banner Hero:</label>
                  <input
                    type="text"
                    value={editSettings.heroImageUrl || ''}
                    onChange={e => setEditSettings({ ...editSettings, heroImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <label className="cursor-pointer bg-emerald-900 hover:bg-emerald-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Unggah File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], url => setEditSettings({ ...editSettings, heroImageUrl: url }));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Banner Halaman Profil */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">Foto Banner Profil Sekolah</label>
                <div className="h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={editSettings.profileBannerImageUrl || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80"}
                    alt="Preview Banner Profil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">URL Gambar Banner Profil:</label>
                  <input
                    type="text"
                    value={editSettings.profileBannerImageUrl || ''}
                    onChange={e => setEditSettings({ ...editSettings, profileBannerImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <label className="cursor-pointer bg-emerald-900 hover:bg-emerald-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Unggah File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], url => setEditSettings({ ...editSettings, profileBannerImageUrl: url }));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section: Identitas & Teks Header */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Identitas &amp; Teks Utama Sekolah</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Sekolah</label>
                <input
                  type="text"
                  value={editSettings.schoolName}
                  onChange={e => setEditSettings({ ...editSettings, schoolName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tagline / Motto</label>
                <input
                  type="text"
                  value={editSettings.tagline}
                  onChange={e => setEditSettings({ ...editSettings, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Sub-Tagline / Penjelasan Ringkas</label>
              <input
                type="text"
                value={editSettings.subTagline}
                onChange={e => setEditSettings({ ...editSettings, subTagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700">Badge Hero Beranda</label>
                <input
                  type="text"
                  value={editSettings.heroBadge}
                  onChange={e => setEditSettings({ ...editSettings, heroBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Headline Hero</label>
                <input
                  type="text"
                  value={editSettings.heroHeadline}
                  onChange={e => setEditSettings({ ...editSettings, heroHeadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Deskripsi Subtitle Hero Beranda</label>
              <textarea
                rows={2}
                value={editSettings.heroSubtitle}
                onChange={e => setEditSettings({ ...editSettings, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            {/* Sub-section: Teks Santri & Alumni (Editable / Can be cleared/deleted) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  <span>Teks Jumlah Santri &amp; Alumni (Pita Bawah Hero)</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditSettings({ ...editSettings, heroAlumniStat: '' })}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-800 underline"
                  >
                    Hapus / Sembunyikan Teks Ini
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setEditSettings({ ...editSettings, heroAlumniStat: '1.200+ Santri & Alumni Tersebar di berbagai jenjang unggulan DIY' })}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 underline"
                  >
                    Reset Teks
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={editSettings.heroAlumniStat || ''}
                onChange={e => setEditSettings({ ...editSettings, heroAlumniStat: e.target.value })}
                placeholder="Contoh: 1.200+ Santri & Alumni Tersebar di berbagai jenjang unggulan DIY (kosongkan jika tidak ingin ditampilkan)"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-800"
              />
              <p className="text-[11px] text-amber-900/80">
                *Teks ini muncul di sebelah avatar santri di bawah tombol PSB. Anda bebas mengedit atau menghapusnya.
              </p>
            </div>

            {/* Sub-section: Kartu Akreditasi & Pengabdian Hero (Floating Hero Card) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h5 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Kustomisasi Kartu Akreditasi &amp; Pengabdian Hero</span>
                </h5>
                <p className="text-[11px] text-slate-500">
                  Kartu mengambang di samping foto banner hero pada halaman depan. Seluruh angka dan teks dapat Anda sesuaikan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Badge Akreditasi</label>
                  <input
                    type="text"
                    value={editSettings.heroCardBadge ?? 'AKREDITASI A UNGGUL'}
                    onChange={e => setEditSettings({ ...editSettings, heroCardBadge: e.target.value })}
                    placeholder="AKREDITASI A UNGGUL"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Rating / Bintang</label>
                  <input
                    type="text"
                    value={editSettings.heroCardRating ?? '4.9 / 5.0'}
                    onChange={e => setEditSettings({ ...editSettings, heroCardRating: e.target.value })}
                    placeholder="4.9 / 5.0"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Angka Statistik</label>
                  <input
                    type="text"
                    value={editSettings.heroCardStatNumber ?? '15+'}
                    onChange={e => setEditSettings({ ...editSettings, heroCardStatNumber: e.target.value })}
                    placeholder="15+"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold text-emerald-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Label Statistik</label>
                  <input
                    type="text"
                    value={editSettings.heroCardStatLabel ?? 'Tahun Pengabdian'}
                    onChange={e => setEditSettings({ ...editSettings, heroCardStatLabel: e.target.value })}
                    placeholder="Tahun Pengabdian"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Teks Narasi / Deskripsi Kartu Hero</label>
                <textarea
                  rows={2}
                  value={editSettings.heroCardDescription ?? 'Membangun peradaban mulia dari Playen, menyemaikan tahfidz & hafizhah mutqin berintelektual sains modern sejak tahun 2010.'}
                  onChange={e => setEditSettings({ ...editSettings, heroCardDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Judul Kurikulum</label>
                  <input
                    type="text"
                    value={editSettings.heroCardCurriculumTitle ?? 'Kurikulum Terintegrasi'}
                    onChange={e => setEditSettings({ ...editSettings, heroCardCurriculumTitle: e.target.value })}
                    placeholder="Kurikulum Terintegrasi"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Subjudul Kurikulum</label>
                  <input
                    type="text"
                    value={editSettings.heroCardCurriculumSubtitle ?? 'Kemendikbud • Kemenag • Pesantren'}
                    onChange={e => setEditSettings({ ...editSettings, heroCardCurriculumSubtitle: e.target.value })}
                    placeholder="Kemendikbud • Kemenag • Pesantren"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Teks Tombol Aksi Kartu</label>
                  <input
                    type="text"
                    value={editSettings.heroCardButtonText ?? 'Kenali Lebih Dekat Sekolah Kami'}
                    onChange={e => setEditSettings({ ...editSettings, heroCardButtonText: e.target.value })}
                    placeholder="Kenali Lebih Dekat Sekolah Kami"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold text-emerald-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: URL Iframe PSB */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Link Iframe Pendaftaran PSB Online
            </h4>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">URL Iframe PSB Netlify</label>
              <input
                type="url"
                value={editSettings.psbIframeUrl}
                onChange={e => setEditSettings({ ...editSettings, psbIframeUrl: e.target.value })}
                placeholder="https://psb-sdqu-alitisham.netlify.app"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-800"
              />
              <p className="text-[11px] text-slate-500">
                Halaman PSB pada website akan menampilkan formulir dari alamat ini secara otomatis dan interaktif.
              </p>
            </div>
          </div>

          {/* Section: Kontak & Operasional */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Kontak, Jam Kerja &amp; Alamat
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">WhatsApp Panitia PSB</label>
                <input
                  type="text"
                  value={editSettings.whatsappSpmb}
                  onChange={e => setEditSettings({ ...editSettings, whatsappSpmb: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Telepon Tata Usaha</label>
                <input
                  type="text"
                  value={editSettings.phoneTu}
                  onChange={e => setEditSettings({ ...editSettings, phoneTu: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Resmi</label>
                <input
                  type="email"
                  value={editSettings.email}
                  onChange={e => setEditSettings({ ...editSettings, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jam Operasional (Senin-Kamis)</label>
                <input
                  type="text"
                  value={editSettings.hoursWeekday}
                  onChange={e => setEditSettings({ ...editSettings, hoursWeekday: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jam Operasional (Jumat)</label>
                <input
                  type="text"
                  value={editSettings.hoursFriday}
                  onChange={e => setEditSettings({ ...editSettings, hoursFriday: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jam Operasional (Akhir Pekan)</label>
                <input
                  type="text"
                  value={editSettings.hoursWeekend}
                  onChange={e => setEditSettings({ ...editSettings, hoursWeekend: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Lengkap</label>
              <textarea
                rows={2}
                value={editSettings.address}
                onChange={e => setEditSettings({ ...editSettings, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Section: Legalitas */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Legalitas &amp; Akreditasi
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">NPSN</label>
                <input
                  type="text"
                  value={editSettings.npsn}
                  onChange={e => setEditSettings({ ...editSettings, npsn: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Akreditasi BAN S/M</label>
                <input
                  type="text"
                  value={editSettings.accreditation}
                  onChange={e => setEditSettings({ ...editSettings, accreditation: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">SK Akreditasi</label>
                <input
                  type="text"
                  value={editSettings.skAkreditasi}
                  onChange={e => setEditSettings({ ...editSettings, skAkreditasi: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Yayasan Penyelenggara</label>
                <input
                  type="text"
                  value={editSettings.foundation}
                  onChange={e => setEditSettings({ ...editSettings, foundation: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Pengaturan</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: VISI, MISI & SEJARAH */}
      {activeTab === 'vision_missions' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kelola Visi, Misi &amp; Sejarah Lembaga
              </h3>
              <p className="text-xs text-slate-500">
                Teks ini tampil langsung di halaman Profil Sekolah.
              </p>
            </div>

            {settingsSaved && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Berhasil Disimpan!</span>
              </span>
            )}
          </div>

          {/* Visi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider text-emerald-900">
              Visi Utama Lembaga
            </label>
            <textarea
              rows={2}
              value={editSettings.vision}
              onChange={e => setEditSettings({ ...editSettings, vision: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          {/* Misi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider text-emerald-900">
                Misi Strategis Lembaga ({editSettings.missions?.length || 0} Poin)
              </label>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(editSettings.missions || []), ''];
                  setEditSettings({ ...editSettings, missions: updated });
                }}
                className="bg-emerald-900 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Misi</span>
              </button>
            </div>

            <div className="space-y-2">
              {editSettings.missions?.map((misi, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={misi}
                    onChange={e => {
                      const updated = [...editSettings.missions];
                      updated[idx] = e.target.value;
                      setEditSettings({ ...editSettings, missions: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = editSettings.missions.filter((_, i) => i !== idx);
                      setEditSettings({ ...editSettings, missions: updated });
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Hapus Misi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sejarah */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider text-emerald-900 block">
              Latar Belakang &amp; Sejarah Sekolah
            </label>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700">Profil Singkat:</span>
              <textarea
                rows={2}
                value={editSettings.shortProfile}
                onChange={e => setEditSettings({ ...editSettings, shortProfile: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700">Sejarah Paragraf 1:</span>
              <textarea
                rows={3}
                value={editSettings.historyPart1}
                onChange={e => setEditSettings({ ...editSettings, historyPart1: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700">Sejarah Paragraf 2:</span>
              <textarea
                rows={3}
                value={editSettings.historyPart2}
                onChange={e => setEditSettings({ ...editSettings, historyPart2: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700">Sejarah Paragraf 3 (Opsional):</span>
              <textarea
                rows={2}
                value={editSettings.historyPart3}
                onChange={e => setEditSettings({ ...editSettings, historyPart3: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Visi, Misi &amp; Sejarah</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: PROGRAM UNGGULAN, EKSKUL & PRESTASI */}
      {activeTab === 'programs_achievements' && (
        <div className="space-y-8">
          {/* 7 Program Unggulan */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  7 Program Unggulan Sekolah
                </h3>
                <p className="text-xs text-slate-500">
                  Program keunggulan yang ditampilkan pada Beranda dan Profil.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(editSettings.featuredPrograms || []), ''];
                  setEditSettings({ ...editSettings, featuredPrograms: updated });
                }}
                className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Program</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {editSettings.featuredPrograms?.map((prog, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={prog}
                    onChange={e => {
                      const updated = [...editSettings.featuredPrograms];
                      updated[idx] = e.target.value;
                      setEditSettings({ ...editSettings, featuredPrograms: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = editSettings.featuredPrograms.filter((_, i) => i !== idx);
                      setEditSettings({ ...editSettings, featuredPrograms: updated });
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Program Unggulan</span>
              </button>
            </div>
          </form>

          {/* 5 Ekstrakurikuler Pilihan */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Ekstrakurikuler Pilihan (5 Ekskul)
                </h3>
                <p className="text-xs text-slate-500">
                  Kelola nama dan deskripsi kegiatan ekskul pada halaman Kegiatan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newItem: ExtracurricularItem = {
                    id: 'ekskul-' + Date.now(),
                    name: 'Ekskul Baru',
                    desc: 'Deskripsi kegiatan ekstrakurikuler'
                  };
                  setEditSettings({
                    ...editSettings,
                    extracurriculars: [...(editSettings.extracurriculars || []), newItem]
                  });
                }}
                className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Ekskul</span>
              </button>
            </div>

            <div className="space-y-3">
              {editSettings.extracurriculars?.map((ekskul, idx) => (
                <div key={ekskul.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={ekskul.name}
                      onChange={e => {
                        const updated = [...editSettings.extracurriculars];
                        updated[idx].name = e.target.value;
                        setEditSettings({ ...editSettings, extracurriculars: updated });
                      }}
                      className="font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 w-full max-w-sm"
                      placeholder="Nama Ekskul"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editSettings.extracurriculars.filter((_, i) => i !== idx);
                        setEditSettings({ ...editSettings, extracurriculars: updated });
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={ekskul.desc}
                    onChange={e => {
                      const updated = [...editSettings.extracurriculars];
                      updated[idx].desc = e.target.value;
                      setEditSettings({ ...editSettings, extracurriculars: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    placeholder="Deskripsi ekskul..."
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Ekstrakurikuler</span>
              </button>
            </div>
          </form>

          {/* Prestasi Sekolah & Siswa */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Rekam Jejak Prestasi Sekolah &amp; Siswa
                </h3>
                <p className="text-xs text-slate-500">
                  Data capaian ASPD, MTQ, O2SN, FLS2N tingkat Kapanewon dan Kabupaten.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newItem: AchievementItem = {
                    id: 'ach-' + Date.now(),
                    category: 'ASPD',
                    year: '2024',
                    kapanewon: 'Peringkat 1',
                    kabupaten: 'Peringkat Unggul',
                    description: 'Keterangan capaian prestasi'
                  };
                  setEditSettings({
                    ...editSettings,
                    achievements: [...(editSettings.achievements || []), newItem]
                  });
                }}
                className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Prestasi</span>
              </button>
            </div>

            <div className="space-y-3">
              {editSettings.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">Kategori</label>
                      <select
                        value={ach.category}
                        onChange={e => {
                          const updated = [...editSettings.achievements];
                          updated[idx].category = e.target.value as any;
                          setEditSettings({ ...editSettings, achievements: updated });
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
                          const updated = [...editSettings.achievements];
                          updated[idx].year = e.target.value;
                          setEditSettings({ ...editSettings, achievements: updated });
                        }}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">Capaian Kapanewon</label>
                      <input
                        type="text"
                        value={ach.kapanewon || ''}
                        onChange={e => {
                          const updated = [...editSettings.achievements];
                          updated[idx].kapanewon = e.target.value;
                          setEditSettings({ ...editSettings, achievements: updated });
                        }}
                        placeholder="Contoh: Juara 1"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-full">
                        <label className="text-[10px] font-bold text-slate-600 block">Capaian Kabupaten</label>
                        <input
                          type="text"
                          value={ach.kabupaten || ''}
                          onChange={e => {
                            const updated = [...editSettings.achievements];
                            updated[idx].kabupaten = e.target.value;
                            setEditSettings({ ...editSettings, achievements: updated });
                          }}
                          placeholder="Contoh: Peringkat 2"
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editSettings.achievements.filter((_, i) => i !== idx);
                          setEditSettings({ ...editSettings, achievements: updated });
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg mt-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Deskripsi Prestasi</label>
                    <textarea
                      rows={1}
                      value={ach.description}
                      onChange={e => {
                        const updated = [...editSettings.achievements];
                        updated[idx].description = e.target.value;
                        setEditSettings({ ...editSettings, achievements: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Rekam Prestasi</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: FASILITAS (6 FASILITAS) */}
      {activeTab === 'facilities' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kelola Fasilitas Kampus ({facilities.length} Fasilitas)
              </h3>
              <p className="text-xs text-slate-500">
                Ubah foto, nama, spesifikasi, dan deskripsi fasilitas yang tampil di halaman Fasilitas.
              </p>
            </div>

            <button
              onClick={() => setShowAddFacility(!showAddFacility)}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Fasilitas</span>
            </button>
          </div>

          {/* Form Tambah Fasilitas */}
          {showAddFacility && (
            <form onSubmit={handleCreateFacility} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">Fasilitas Baru:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Nama Fasilitas *</label>
                  <input
                    type="text"
                    required
                    value={newFacName}
                    onChange={e => setNewFacName(e.target.value)}
                    placeholder="Contoh: Perpustakaan Digital &amp; Iqro'"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Kategori Fasilitas</label>
                  <select
                    value={newFacCategory}
                    onChange={e => setNewFacCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="kelas">Ruang Kelas &amp; Belajar</option>
                    <option value="ibadah">Tempat Ibadah &amp; Masjid</option>
                    <option value="olahraga">Sarana Olahraga</option>
                    <option value="perpustakaan">Perpustakaan &amp; Riset</option>
                    <option value="kesehatan">Kesehatan &amp; Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Spesifikasi (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={newFacSpecs}
                    onChange={e => setNewFacSpecs(e.target.value)}
                    placeholder="AC, Proyektor, Karpet Lembut"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">URL Gambar / Foto Fasilitas</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFacImage}
                      onChange={e => setNewFacImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                    <label className="cursor-pointer bg-emerald-900 text-white px-3 py-2 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], url => setNewFacImage(url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Deskripsi Lengkap Fasilitas</label>
                <textarea
                  rows={2}
                  value={newFacDesc}
                  onChange={e => setNewFacDesc(e.target.value)}
                  placeholder="Keterangan fasilitas sekolah..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddFacility(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-800"
                >
                  Simpan Fasilitas
                </button>
              </div>
            </form>
          )}

          {/* List Fasilitas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map(fac => {
              const isEditing = editingFacilityId === fac.id;
              return (
                <div key={fac.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Nama Fasilitas</label>
                        <input
                          type="text"
                          value={editFacName}
                          onChange={e => setEditFacName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">URL / Unggah Gambar</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editFacImage}
                            onChange={e => setEditFacImage(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                          />
                          <label className="cursor-pointer bg-emerald-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], url => setEditFacImage(url));
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Spesifikasi (Koma dipisahkan)</label>
                        <input
                          type="text"
                          value={editFacSpecs}
                          onChange={e => setEditFacSpecs(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Deskripsi</label>
                        <textarea
                          rows={2}
                          value={editFacDesc}
                          onChange={e => setEditFacDesc(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingFacilityId(null)}
                          className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEditFacility(fac.id)}
                          className="px-3 py-1 text-xs bg-emerald-900 text-white font-bold rounded-lg"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <img
                          src={fac.imageUrl}
                          alt={fac.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {fac.name}
                          </h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => startEditFacility(fac)}
                              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                              title="Edit Fasilitas"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFacility(fac.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Hapus Fasilitas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {fac.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {fac.specs?.map((spec, i) => (
                            <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: GURU & ASATIDZ */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kelola Data Asatidz &amp; Dewan Guru
              </h3>
              <p className="text-xs text-slate-500">
                Data akan tampil langsung pada halaman Profil Sekolah.
              </p>
            </div>

            <button
              onClick={() => setShowAddTeacher(!showAddTeacher)}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Guru Baru</span>
            </button>
          </div>

          {/* Form Tambah Guru */}
          {showAddTeacher && (
            <form onSubmit={handleCreateTeacher} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">Data Pendidik Baru:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Nama Lengkap &amp; Gelar *</label>
                  <input
                    type="text"
                    required
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    placeholder="Contoh: Ustadzah Maryam, S.Pd.I."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Jabatan / Amanah</label>
                  <input
                    type="text"
                    value={newTeacherRole}
                    onChange={e => setNewTeacherRole(e.target.value)}
                    placeholder="Contoh: Guru Kelas 1 / Koordinator Al-Qur'an"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Spesialisasi</label>
                  <input
                    type="text"
                    value={newTeacherSpecialty}
                    onChange={e => setNewTeacherSpecialty(e.target.value)}
                    placeholder="Sanad Hafsh 30 Juz"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={newTeacherEducation}
                    onChange={e => setNewTeacherEducation(e.target.value)}
                    placeholder="S1 Pendidikan Agama Islam"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Foto (URL / Unggah)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newTeacherImage}
                      onChange={e => setNewTeacherImage(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                    <label className="cursor-pointer bg-emerald-900 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], url => setNewTeacherImage(url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacher(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-800"
                >
                  Simpan Data Asatidz
                </button>
              </div>
            </form>
          )}

          {/* Grid Guru */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map(tc => (
              <div key={tc.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={tc.imageUrl}
                    alt={tc.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{tc.name}</h4>
                    <p className="text-[11px] text-emerald-800 font-semibold truncate">{tc.role}</p>
                    <p className="text-[10px] text-slate-500 truncate">{tc.education} • {tc.specialty}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTeacher(tc.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                  title="Hapus Data Guru"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PENGUMUMAN */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kelola Pengumuman Sekolah
              </h3>
              <p className="text-xs text-slate-500">
                Pengumuman aktif akan muncul di pita informasi atas website.
              </p>
            </div>

            <button
              onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengumuman</span>
            </button>
          </div>

          {/* Form Tambah */}
          {showAddAnnouncement && (
            <form onSubmit={handleCreateAnnouncement} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">Buat Pengumuman Baru:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Judul Pengumuman *</label>
                  <input
                    type="text"
                    required
                    value={newAnnTitle}
                    onChange={e => setNewAnnTitle(e.target.value)}
                    placeholder="Contoh: Jadwal Observasi Calon Santri Baru"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Kategori</label>
                  <select
                    value={newAnnCategory}
                    onChange={e => setNewAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="PSB">PSB</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Isi Pengumuman</label>
                <textarea
                  rows={2}
                  value={newAnnContent}
                  onChange={e => setNewAnnContent(e.target.value)}
                  placeholder="Keterangan rincian pengumuman..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncement(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-800"
                >
                  Simpan &amp; Publikasikan
                </button>
              </div>
            </form>
          )}

          {/* List Pengumuman */}
          <div className="space-y-3">
            {announcements.map(ann => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400">{ann.date}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ann.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {ann.isActive ? 'Aktif di Beranda' : 'Nonaktif'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-xs text-slate-600">{ann.content}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleAnnouncement(ann.id, ann.isActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      ann.isActive
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-emerald-900 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {ann.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>

                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BERITA */}
      {activeTab === 'news' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Berita &amp; Artikel Sekolah ({news.length})
              </h3>
              <p className="text-xs text-slate-500">
                Artikel informasi yang tampil di halaman Berita / Beranda.
              </p>
            </div>
            <button
              onClick={() => setShowAddNews(!showAddNews)}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Berita Baru</span>
            </button>
          </div>

          {/* Form Tambah Berita Baru */}
          {showAddNews && (
            <form onSubmit={handleCreateNews} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">Tulis Berita Baru:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Judul Berita *</label>
                  <input
                    type="text"
                    required
                    value={newNewsTitle}
                    onChange={e => setNewNewsTitle(e.target.value)}
                    placeholder="Contoh: Santri SDQU Al I'tisham Raih Juara 1 MTQ Tingkat DIY"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Kategori</label>
                  <select
                    value={newNewsCategory}
                    onChange={e => setNewNewsCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Prestasi">Prestasi</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Kajian">Kajian</option>
                    <option value="Akademik">Akademik</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Ringkasan Berita (Excerpt)</label>
                <input
                  type="text"
                  value={newNewsExcerpt}
                  onChange={e => setNewNewsExcerpt(e.target.value)}
                  placeholder="Ringkasan singkat yang menarik untuk kartu berita..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Isi Berita Lengkap</label>
                <textarea
                  rows={3}
                  value={newNewsContent}
                  onChange={e => setNewNewsContent(e.target.value)}
                  placeholder="Ketik konten berita atau rincian kegiatan di sini..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Foto Berita</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newNewsImage}
                      onChange={e => setNewNewsImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                    />
                    <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold px-2.5 py-2 rounded-lg inline-flex items-center gap-1 shrink-0">
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], url => setNewNewsImage(url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Penulis / Humas</label>
                  <input
                    type="text"
                    value={newNewsAuthor}
                    onChange={e => setNewNewsAuthor(e.target.value)}
                    placeholder="Humas SDQU Al I'tisham"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNews(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-800"
                >
                  Simpan &amp; Terbitkan Berita
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {news.map(item => (
              <div key={item.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.excerpt}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    requestDelete('Hapus Berita', `Apakah Anda yakin ingin menghapus berita "${item.title}"?`, () => {
                      dataService.deleteNews(item.id);
                    });
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                  title="Hapus Berita"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AGENDA */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Agenda Kegiatan Sekolah ({events.length})
              </h3>
              <p className="text-xs text-slate-500">
                Kalender jadwal akademik dan kegiatan madrasah.
              </p>
            </div>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Agenda Baru</span>
            </button>
          </div>

          {/* Form Tambah Agenda Baru */}
          {showAddEvent && (
            <form onSubmit={handleCreateEvent} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">Tambah Agenda Baru:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Nama Agenda *</label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={e => setNewEventTitle(e.target.value)}
                    placeholder="Contoh: Dauroh Tahfidz Al-Qur'an &amp; Mabit Santri"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Kategori</label>
                  <select
                    value={newEventCategory}
                    onChange={e => setNewEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Tahfidz">Tahfidz</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Parenting">Parenting</option>
                    <option value="Sosial">Sosial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Tanggal &amp; Waktu Pelaksanaan</label>
                  <input
                    type="text"
                    value={newEventDateRange}
                    onChange={e => setNewEventDateRange(e.target.value)}
                    placeholder="Contoh: 15-17 Ramadhan 1446 H / 08.00 - 15.00 WIB"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={e => setNewEventLocation(e.target.value)}
                    placeholder="Kompleks SDQU Al I'tisham Playen"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Deskripsi / Catatan Agenda</label>
                <textarea
                  rows={2}
                  value={newEventDesc}
                  onChange={e => setNewEventDesc(e.target.value)}
                  placeholder="Keterangan singkat agenda kegiatan..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-800"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {events.map(ev => (
              <div key={ev.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {ev.category}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{ev.dateRange} • {ev.location}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{ev.title}</h4>
                  <p className="text-xs text-slate-600">{ev.description}</p>
                </div>

                <button
                  onClick={() => {
                    requestDelete('Hapus Agenda Kegiatan', `Apakah Anda yakin ingin menghapus agenda "${ev.title}"?`, () => {
                      dataService.deleteEvent(ev.id);
                    });
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                  title="Hapus Agenda"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: INFAQ & DONASI */}
      {activeTab === 'infaq' && (
        <div className="space-y-6">
          {/* Rekening & QRIS Form */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Pengaturan Rekening Bank &amp; Upload QRIS Donasi
              </h3>
              <p className="text-xs text-slate-500">
                Ubah rekening BSI, BPD DIY Syariah, dan upload foto barcode QRIS resmi sekolah.
              </p>
            </div>

            {/* QRIS Upload Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Upload QRIS Standar Nasional</span>
                </span>
                {editSettings.qrisImageUrl && (
                  <button
                    type="button"
                    onClick={() => setEditSettings({ ...editSettings, qrisImageUrl: '' })}
                    className="text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    Reset Gambar QRIS
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                {/* QRIS Image Preview */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-xs">
                  {editSettings.qrisImageUrl ? (
                    <img
                      src={editSettings.qrisImageUrl}
                      alt="Preview QRIS"
                      className="max-h-40 max-w-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="py-6 text-slate-400 flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                      <span className="text-[11px] font-semibold mt-2">Belum ada gambar QRIS</span>
                      <span className="text-[10px] text-slate-400">Barcode standar otomatis aktif</span>
                    </div>
                  )}
                </div>

                {/* Upload & NMID fields */}
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Unggah File Gambar Barcode QRIS
                    </label>
                    <label className="cursor-pointer bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Pilih File QRIS (PNG / JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], url => setEditSettings({ ...editSettings, qrisImageUrl: url }));
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Atau Masukkan URL Gambar QRIS:</label>
                    <input
                      type="text"
                      value={editSettings.qrisImageUrl || ''}
                      onChange={e => setEditSettings({ ...editSettings, qrisImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Nomor NMID QRIS:</label>
                    <input
                      type="text"
                      value={editSettings.qrisId || ''}
                      onChange={e => setEditSettings({ ...editSettings, qrisId: e.target.value })}
                      placeholder="Contoh: NMID: ID1023249081721"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-teal-800 uppercase">Rekening BSI</span>
                <input
                  type="text"
                  value={editSettings.bankBsi?.accountNumber || ''}
                  onChange={e => setEditSettings({
                    ...editSettings,
                    bankBsi: { ...editSettings.bankBsi, accountNumber: e.target.value }
                  })}
                  placeholder="Nomor Rekening BSI"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold bg-white"
                />
                <input
                  type="text"
                  value={editSettings.bankBsi?.holderName || ''}
                  onChange={e => setEditSettings({
                    ...editSettings,
                    bankBsi: { ...editSettings.bankBsi, holderName: e.target.value }
                  })}
                  placeholder="Atas Nama"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-purple-900 uppercase">Rekening BPD DIY Syariah</span>
                <input
                  type="text"
                  value={editSettings.bankBpd?.accountNumber || ''}
                  onChange={e => setEditSettings({
                    ...editSettings,
                    bankBpd: { ...editSettings.bankBpd, accountNumber: e.target.value }
                  })}
                  placeholder="Nomor Rekening BPD"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold bg-white"
                />
                <input
                  type="text"
                  value={editSettings.bankBpd?.holderName || ''}
                  onChange={e => setEditSettings({
                    ...editSettings,
                    bankBpd: { ...editSettings.bankBpd, holderName: e.target.value }
                  })}
                  placeholder="Atas Nama"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Rekening &amp; QRIS</span>
              </button>
            </div>
          </form>

          {/* Tabel Riwayat Infaq */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Riwayat Konfirmasi Infaq &amp; Wakaf Masuk ({infaqRecords.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Data konfirmasi donasi yang dikirim donatur melalui formulir website.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nama Donatur</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Program</th>
                    <th className="p-3">Nominal</th>
                    <th className="p-3">Pesan &amp; Doa</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {infaqRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                        Belum ada konfirmasi infaq masuk.
                      </td>
                    </tr>
                  ) : (
                    infaqRecords.map(inf => (
                      <tr key={inf.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{inf.id}</td>
                        <td className="p-3 font-bold text-slate-900">{inf.donorName}</td>
                        <td className="p-3 text-slate-600 font-mono">{inf.phone}</td>
                        <td className="p-3 text-emerald-800 font-semibold">{inf.program}</td>
                        <td className="p-3 font-bold text-slate-900">Rp {inf.amount.toLocaleString('id-ID')}</td>
                        <td className="p-3 italic text-slate-600 max-w-xs truncate">"{inf.prayerNotes || '-'}"</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              requestDelete('Hapus Konfirmasi Infaq', `Hapus catatan infaq dari donatur ${inf.donorName} (${inf.id})?`, () => {
                                dataService.deleteInfaq(inf.id);
                              });
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Data Infaq"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: KEAMANAN SANDI ADMIN */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 max-w-xl">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-800" />
              <span>Perbarui Kata Sandi Admin</span>
            </h3>
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-800"
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

      {/* TAB CONTENT: PUBLIKASI WEB & DATABASE REALTIME */}
      {activeTab === 'publish_tutorial' && (
        <div className="space-y-8">
          {/* Realtime Database & Backup/Restore Panel */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    Sinkronisasi Realtime Aktif
                  </span>
                  <span className="text-xs text-slate-400">• Cross-tab &amp; Instant State</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Pusat Kendali Database &amp; Cadangan Realtime
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl">
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
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Pulihkan / Impor Database Sekolah</span>
                </h4>
                <p className="text-xs text-slate-600">
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
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-800" />
                  <span>Reset Data ke Standar Pabrik</span>
                </h4>
                <p className="text-xs text-amber-900/80">
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

          {/* Panduan Resmi Mempublish Web ke Internet */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                PANDUAN LENGKAP GO-LIVE
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-2">
                Panduan Mempublish Website Resmi SDQU Al I'tisham
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ikuti langkah-langkah praktis di bawah ini untuk menghubungkan website ke domain resmi madrasah (.sch.id) dan hosting berkinerja tinggi.
              </p>
            </div>

            <div className="space-y-6">
              {/* Langkah 1 */}
              <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Ekspor Kode Sumber (Export to ZIP / GitHub)
                  </h4>
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
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Deploy Cepat Gratis di Netlify atau Vercel
                  </h4>
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
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Menghubungkan Domain Resmi Madrasah (.sch.id)
                  </h4>
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
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Integrasi Sempurna dengan Portal PSB Netlify
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Website ini telah dikonfigurasi langsung menampilkan formulir pendaftaran interaktif dari <code>https://psb-sdqu-alitisham.netlify.app</code> melalui iframe responsif pada halaman <strong>PSB Online</strong>. Wali santri dapat mendaftar langsung tanpa kendala tampilan di smartphone maupun laptop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS NON-BLOCKING (Mencegah kendala confirm() di iframe) */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {deleteModal.title}
                </h3>
                <p className="text-xs text-slate-500">Konfirmasi tindakan penghapusan</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {deleteModal.message}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteModal.onConfirm();
                  setDeleteModal(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: GOOGLE APPS SCRIPT DEPLOY GUIDE */}
      {activeTab === 'google' && (
        <div className="space-y-6">
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/60 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-emerald-100 border border-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Google Apps Script Web App Terhubung
                  </span>
                </div>
                <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white">
                  Database Google Spreadsheet &amp; Drive Aktif
                </h3>
                <p className="text-xs text-emerald-200/80 leading-relaxed max-w-2xl">
                  Data konfirmasi infaq dan formulir pendukung terhubung langsung ke Google Spreadsheet resmi sekolah dan Google Drive.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncGoogle}
                  disabled={isSyncing}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data Spreadsheet'}</span>
                </button>
              </div>
            </div>

            {/* Sync Feedback Message */}
            {syncFeedback && (
              <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${syncFeedback.success ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-700' : 'bg-rose-900/80 text-rose-100 border border-rose-700'}`}>
                {syncFeedback.success ? <Check className="w-4 h-4 text-emerald-300 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
                <span>{syncFeedback.message}</span>
              </div>
            )}

            {/* Web App URL Form */}
            <form onSubmit={handleSaveAppsScriptUrl} className="space-y-3 bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-emerald-200">
                  URL Web App Google Apps Script Aktif:
                </label>
                {appsScriptSaved && (
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>URL Berhasil Diperbarui &amp; Disimpan!</span>
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={appsScriptUrlInput}
                  onChange={e => setAppsScriptUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-700/80 text-xs font-mono text-emerald-100 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan URL</span>
                </button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href={`https://docs.google.com/spreadsheets/d/${GOOGLE_CONFIG.SPREADSHEET_ID}/edit`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-100 text-xs font-semibold transition-colors"
              >
                <span className="truncate">📊 Buka Spreadsheet Sekolah</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
              </a>

              <a
                href={`https://drive.google.com/drive/folders/${GOOGLE_CONFIG.DRIVE_FOLDER_ID}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-100 text-xs font-semibold transition-colors"
              >
                <span className="truncate">📁 Buka Google Drive Berkas</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
              </a>

              <a
                href={`${appsScriptUrlInput}?action=getAll`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-100 text-xs font-semibold transition-colors"
              >
                <span className="truncate">🌐 Uji Endpoint API Web App</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
              </a>
            </div>
          </div>

          {/* Panduan Pembaruan Script Apps Script (Agar Logo & Foto Otomatis Masuk Drive & Sinkron ke Semua HP) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  KODE BACKEND GOOGLE DRIVE &amp; SPREADSHEET
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-1">
                  Sinkronisasi Gambar &amp; Pengaturan Lintas Perangkat
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl">
                  Salin kode backend terbaru di bawah ini ke Google Apps Script Spreadsheet Anda agar setiap kali Anda mengganti logo atau foto di satu perangkat, gambarnya otomatis tersimpan di Google Drive sekolah dan langsung muncul di semua smartphone dan laptop pengunjung.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 3000);
                  }}
                  className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? '✓ Kode Tersalin!' : 'Salin Kode Apps Script'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 text-xs font-bold flex items-center justify-center">1</div>
                <h5 className="text-xs font-bold text-slate-900">Buka Spreadsheet</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Buka Spreadsheet sekolah Anda, lalu klik menu atas <strong>Ekstensi &gt; Apps Script</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 text-xs font-bold flex items-center justify-center">2</div>
                <h5 className="text-xs font-bold text-slate-900">Tempel Kode Baru</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Hapus seluruh kode lama di file <code>Code.gs</code>, lalu <strong>Paste</strong> kode yang baru saja disalin. Klik tombol <strong>Simpan</strong> (ikon disket).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 text-xs font-bold flex items-center justify-center">3</div>
                <h5 className="text-xs font-bold text-slate-900">Terapkan Versi Baru</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Klik tombol biru <strong>Terapkan (Deploy)</strong> di kanan atas &gt; <strong>Kelola penerapan</strong> &gt; Ikon pensil (Edit) &gt; Versi: <strong>Versi baru</strong> &gt; Klik <strong>Terapkan</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-800 text-emerald-100 text-xs font-bold flex items-center justify-center">4</div>
                <h5 className="text-xs font-bold text-emerald-950">Selesai &amp; Otomatis!</h5>
                <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                  Sekarang setiap foto &amp; teks yang diubah admin langsung tersinkron dan tampil di semua smartphone pengunjung!
                </p>
              </div>
            </div>

            {/* Code Box Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono font-bold">Code.gs (Google Apps Script)</span>
                <span className="text-[11px]">JavaScript Google Workspace</span>
              </div>
              <div className="max-h-72 overflow-y-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-200 leading-relaxed">
                <pre>{APPS_SCRIPT_CODE}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
