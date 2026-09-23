import React, { useState } from 'react';
import {
  ActivePage,
  Announcement,
  BankAccountItem,
  EventItem,
  FacilityItem,
  InfaqRecord,
  NewsItem,
  SchoolSettings,
  TeacherItem,
  AchievementItem,
  ExtracurricularItem,
  TestimonialItem,
  InfaqProgramItem,
  EcoFeatureItem,
  CoreValueItem,
  LegalitasItem,
  SPMBStepItem,
  FAQItem
} from '../../types';
import { dataService } from '../../services/dataService';
import { GOOGLE_CONFIG } from '../../config/googleConfig';
import { ThumbnailUploader } from '../common/ThumbnailUploader';
import { IconPicker } from '../common/IconPicker';
import { AdminKegiatanTab } from '../admin/AdminKegiatanTab';
import { AdminSpmbTab } from '../admin/AdminSpmbTab';
import { AdminProfilTab } from '../admin/AdminProfilTab';
import { AdminPengaturanLanjutanTab } from '../admin/AdminPengaturanLanjutanTab';
import { VisitorAnalyticsCard } from '../admin/VisitorAnalyticsCard';
import { getOptimizedImageUrl } from '../../utils/imageUtils';
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
  FileText,
  CheckCircle2,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Sliders,
  X
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
    | 'profil'
    | 'vision_missions'
    | 'programs_achievements'
    | 'facilities'
    | 'teachers'
    | 'kegiatan'
    | 'info_publikasi'
    | 'spmb'
    | 'announcements'
    | 'news'
    | 'events'
    | 'infaq'
    | 'advanced_settings'
    | 'security'
    | 'google'
    | 'publish_tutorial'
  >('overview');

  // Edit Settings State
  const [editSettings, setEditSettings] = useState<SchoolSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sub-tab Navigation States (Left sidebar navigation for TU staff)
  const [brandingSubTab, setBrandingSubTab] = useState<'logo_banner' | 'identity' | 'contact_psb' | 'hero_stats' | 'why_us' | 'testimonials_cta'>('logo_banner');
  const [visionSubTab, setVisionSubTab] = useState<'vision_mission' | 'history' | 'core_values' | 'legalitas'>('vision_mission');
  const [programsSubTab, setProgramsSubTab] = useState<'featured' | 'extracurriculars' | 'achievements'>('featured');
  const [facilitiesSubTab, setFacilitiesSubTab] = useState<'list' | 'add' | 'categories'>('list');
  const [teachersSubTab, setTeachersSubTab] = useState<'list' | 'add' | 'header'>('list');
  const [infoSubTab, setInfoSubTab] = useState<'spmb' | 'announcements' | 'news' | 'events'>('spmb');
  const [announcementsSubTab, setAnnouncementsSubTab] = useState<'list' | 'add'>('list');
  const [newsSubTab, setNewsSubTab] = useState<'list' | 'add'>('list');
  const [eventsSubTab, setEventsSubTab] = useState<'list' | 'add'>('list');
  const [infaqSubTab, setInfaqSubTab] = useState<'bank_qris' | 'records' | 'programs'>('bank_qris');
  const [advancedSubTab, setAdvancedSubTab] = useState<'database' | 'security' | 'google'>('database');
  const [publishSubTab, setPublishSubTab] = useState<'backup' | 'guide'>('backup');
  const [securitySubTab, setSecuritySubTab] = useState<'password' | 'tips'>('password');
  const [googleSubTab, setGoogleSubTab] = useState<'config' | 'actions' | 'script_code'>('config');

  // Sync settings whenever updated from dataService
  // eslint-disable-next-line react-hooks/exhaustive-deps
React.useEffect(() => {
  setEditSettings({ ...settings });
}, []); // hanya sinkron sekali saat panel admin pertama dibuka, bukan tiap polling

  // Safe In-App Delete Confirmation Modal (never blocked by iframe security)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionLabel?: string;
    onConfirm: () => void;
  } | null>(null);

  const requestDelete = (title: string, message: string, onConfirm: () => void) => {
    setDeleteModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setDeleteModal(null);
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

  // Edit Teacher State
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherRole, setEditTeacherRole] = useState('');
  const [editTeacherSpecialty, setEditTeacherSpecialty] = useState('');
  const [editTeacherEducation, setEditTeacherEducation] = useState('');
  const [editTeacherImage, setEditTeacherImage] = useState('');

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

  // Dynamic Bank Accounts Management State
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [bankFormName, setBankFormName] = useState('');
  const [bankFormNumber, setBankFormNumber] = useState('');
  const [bankFormHolder, setBankFormHolder] = useState('');
  const [bankFormBranch, setBankFormBranch] = useState('');

  const openAddBankModal = () => {
    setEditingBankId(null);
    setBankFormName('');
    setBankFormNumber('');
    setBankFormHolder('');
    setBankFormBranch('');
    setBankModalOpen(true);
  };

  const openEditBankModal = (item: BankAccountItem) => {
    setEditingBankId(item.id);
    setBankFormName(item.bankName);
    setBankFormNumber(item.accountNumber);
    setBankFormHolder(item.holderName);
    setBankFormBranch(item.branch || '');
    setBankModalOpen(true);
  };

  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankFormName.trim() || !bankFormNumber.trim() || !bankFormHolder.trim()) {
      alert('Mohon isi nama bank, nomor rekening, dan nama pemilik rekening.');
      return;
    }

    const currentList: BankAccountItem[] = (editSettings.bankAccounts && editSettings.bankAccounts.length > 0)
      ? [...editSettings.bankAccounts]
      : [
          ...(editSettings.bankBsi?.accountNumber ? [{
            id: 'bank-bsi',
            bankName: editSettings.bankBsi.bankName || 'Bank Syariah Indonesia (BSI)',
            accountNumber: editSettings.bankBsi.accountNumber || '',
            holderName: editSettings.bankBsi.holderName || '',
            branch: editSettings.bankBsi.branch || ''
          }] : []),
          ...(editSettings.bankBpd?.accountNumber ? [{
            id: 'bank-bpd',
            bankName: editSettings.bankBpd.bankName || 'Bank BPD DIY Syariah',
            accountNumber: editSettings.bankBpd.accountNumber || '',
            holderName: editSettings.bankBpd.holderName || '',
            branch: editSettings.bankBpd.branch || ''
          }] : [])
        ];

    let updatedList: BankAccountItem[];
    if (editingBankId) {
      updatedList = currentList.map(item => item.id === editingBankId ? {
        ...item,
        bankName: bankFormName.trim(),
        accountNumber: bankFormNumber.trim(),
        holderName: bankFormHolder.trim(),
        branch: bankFormBranch.trim()
      } : item);
    } else {
      const newAcc: BankAccountItem = {
        id: 'bank-' + Date.now(),
        bankName: bankFormName.trim(),
        accountNumber: bankFormNumber.trim(),
        holderName: bankFormHolder.trim(),
        branch: bankFormBranch.trim()
      };
      updatedList = [...currentList, newAcc];
    }

    const updatedSettings: SchoolSettings = {
      ...editSettings,
      bankAccounts: updatedList,
      bankBsi: updatedList[0] ? {
        bankName: updatedList[0].bankName,
        accountNumber: updatedList[0].accountNumber,
        holderName: updatedList[0].holderName,
        branch: updatedList[0].branch || ''
      } : editSettings.bankBsi,
      bankBpd: updatedList[1] ? {
        bankName: updatedList[1].bankName,
        accountNumber: updatedList[1].accountNumber,
        holderName: updatedList[1].holderName,
        branch: updatedList[1].branch || ''
      } : editSettings.bankBpd
    };

    setEditSettings(updatedSettings);
    dataService.updateSettings(updatedSettings);
    setBankModalOpen(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleDeleteBankAccount = (id: string, bankName: string) => {
    requestDelete(
      'Hapus Rekening Bank',
      `Apakah Anda yakin ingin menghapus rekening ${bankName}? Rekening ini tidak akan ditampilkan lagi di halaman donasi publik.`,
      () => {
        const currentList: BankAccountItem[] = (editSettings.bankAccounts && editSettings.bankAccounts.length > 0)
          ? editSettings.bankAccounts
          : [];
        const updatedList = currentList.filter(item => item.id !== id);
        const updatedSettings: SchoolSettings = {
          ...editSettings,
          bankAccounts: updatedList,
          bankBsi: updatedList[0] ? {
            bankName: updatedList[0].bankName,
            accountNumber: updatedList[0].accountNumber,
            holderName: updatedList[0].holderName,
            branch: updatedList[0].branch || ''
          } : undefined,
          bankBpd: updatedList[1] ? {
            bankName: updatedList[1].bankName,
            accountNumber: updatedList[1].accountNumber,
            holderName: updatedList[1].holderName,
            branch: updatedList[1].branch || ''
          } : undefined
        };
        setEditSettings(updatedSettings);
        dataService.updateSettings(updatedSettings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    );
  };

  // Dynamic Infaq Programs Management State
  const [infaqProgramModalOpen, setInfaqProgramModalOpen] = useState(false);
  const [editingInfaqProgramId, setEditingInfaqProgramId] = useState<string | null>(null);
  const [infaqProgTag, setInfaqProgTag] = useState('');
  const [infaqProgTitle, setInfaqProgTitle] = useState('');
  const [infaqProgDesc, setInfaqProgDesc] = useState('');
  const [infaqProgHighlight, setInfaqProgHighlight] = useState('');
  const [infaqProgIconType, setInfaqProgIconType] = useState('scholarship');

  const openAddInfaqProgramModal = () => {
    setEditingInfaqProgramId(null);
    setInfaqProgTag('');
    setInfaqProgTitle('');
    setInfaqProgDesc('');
    setInfaqProgHighlight('');
    setInfaqProgIconType('scholarship');
    setInfaqProgramModalOpen(true);
  };

  const openEditInfaqProgramModal = (item: InfaqProgramItem) => {
    setEditingInfaqProgramId(item.id);
    setInfaqProgTag(item.tag || '');
    setInfaqProgTitle(item.title || '');
    setInfaqProgDesc(item.description || '');
    setInfaqProgHighlight(item.highlight || '');
    setInfaqProgIconType(item.iconType || 'scholarship');
    setInfaqProgramModalOpen(true);
  };

  const handleSaveInfaqProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infaqProgTitle.trim()) {
      alert('Mohon isi judul program infaq.');
      return;
    }

    const currentList: InfaqProgramItem[] = (editSettings.infaqPrograms && editSettings.infaqPrograms.length > 0)
      ? [...editSettings.infaqPrograms]
      : [
          {
            id: 'inf-1',
            tag: 'BEASISWA DHUAFA',
            title: "Beasiswa Santri Qur'an",
            description: "Bantuan biaya pendidikan, seragam, dan buku untuk santri yatim dan dhuafa berprestasi agar terus lancar menghafal Al-Qur'an.",
            highlight: 'Mulai Rp 50.000 / paket',
            iconType: 'scholarship'
          },
          {
            id: 'inf-2',
            tag: 'WAKAF JARIYAH',
            title: 'Wakaf Sarana & Bangunan',
            description: "Pembangunan dan perluasan ruang kelas baru, perluasan masjid jami' sekolah, serta pengadaan AC ramah lingkungan.",
            highlight: 'Pahala Mengalir Abadi',
            iconType: 'building'
          },
          {
            id: 'inf-3',
            tag: 'OPERASIONAL DAKWAH',
            title: 'Operasional Dakwah & Al-Qur\'an',
            description: 'Pengadaan mushaf Al-Qur\'an rasm Utsmani, media pembelajaran digital sains terpadu, dan pelatihan sanad asatidz berkala.',
            highlight: 'Investasi Generasi Emas',
            iconType: 'book'
          }
        ];

    let updatedList: InfaqProgramItem[];
    if (editingInfaqProgramId) {
      updatedList = currentList.map(item => item.id === editingInfaqProgramId ? {
        ...item,
        tag: infaqProgTag.trim() || 'PROGRAM',
        title: infaqProgTitle.trim(),
        description: infaqProgDesc.trim(),
        highlight: infaqProgHighlight.trim() || 'Salurkan Kebaikan',
        iconType: infaqProgIconType
      } : item);
    } else {
      const newProgram: InfaqProgramItem = {
        id: 'inf-' + Date.now(),
        tag: infaqProgTag.trim() || 'PROGRAM',
        title: infaqProgTitle.trim(),
        description: infaqProgDesc.trim(),
        highlight: infaqProgHighlight.trim() || 'Salurkan Kebaikan',
        iconType: infaqProgIconType
      };
      updatedList = [...currentList, newProgram];
    }

    const updatedSettings: SchoolSettings = {
      ...editSettings,
      infaqPrograms: updatedList
    };

    setEditSettings(updatedSettings);
    dataService.updateSettings(updatedSettings);
    setInfaqProgramModalOpen(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleDeleteInfaqProgram = (id: string, title: string) => {
    requestDelete(
      'Hapus Program Infaq',
      `Apakah Anda yakin ingin menghapus program "${title}"? Program ini tidak akan ditampilkan lagi di halaman donasi publik.`,
      () => {
        const currentList: InfaqProgramItem[] = (editSettings.infaqPrograms && editSettings.infaqPrograms.length > 0)
          ? editSettings.infaqPrograms
          : [];
        const updatedList = currentList.filter(item => item.id !== id);
        const updatedSettings: SchoolSettings = {
          ...editSettings,
          infaqPrograms: updatedList
        };
        setEditSettings(updatedSettings);
        dataService.updateSettings(updatedSettings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    );
  };

  // Google Apps Script Integration State
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState(dataService.getAppsScriptUrl());
  const [spreadsheetIdInput, setSpreadsheetIdInput] = useState(dataService.getSpreadsheetId());
  const [driveFolderIdInput, setDriveFolderIdInput] = useState(dataService.getDriveFolderId());
  const [appsScriptSaved, setAppsScriptSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testConnectionFeedback, setTestConnectionFeedback] = useState<{ success: boolean; message: string; details?: any } | null>(null);
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
    dataService.cancelScheduledPush(); // 👈 baris baru: batalkan kiriman otomatis biar tidak dobel
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
    dataService.cancelScheduledPush();
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

  const handleSaveGoogleSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    dataService.setAppsScriptUrl(appsScriptUrlInput);
    dataService.setSpreadsheetId(spreadsheetIdInput);
    dataService.setDriveFolderId(driveFolderIdInput);
    setAppsScriptSaved(true);
    setTimeout(() => setAppsScriptSaved(false), 3500);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestConnectionFeedback(null);
    try {
      dataService.setAppsScriptUrl(appsScriptUrlInput);
      dataService.setSpreadsheetId(spreadsheetIdInput);
      dataService.setDriveFolderId(driveFolderIdInput);
      const res = await dataService.testAppsScriptConnection();
      setTestConnectionFeedback(res);
    } catch (e: any) {
      setTestConnectionFeedback({ success: false, message: 'Gagal menguji koneksi: ' + (e.message || 'Periksa koneksi internet') });
    } finally {
      setIsTestingConnection(false);
      setTimeout(() => setTestConnectionFeedback(null), 8000);
    }
  };

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await dataService.syncFromGoogle();
    setIsSyncing(false);
    setSyncFeedback(res);
    setTimeout(() => setSyncFeedback(null), 6000);
  };

  const [isFormattingSheets, setIsFormattingSheets] = useState(false);

  const handleFormatSheets = async () => {
    dataService.cancelScheduledPush();
    setIsFormattingSheets(true);
    setSyncFeedback(null);
    try {
      const res = await dataService.pushToCloud();
      if (res && res.success) {
        setSyncFeedback({
          success: true,
          message: 'Berhasil! Semua lembar (Settings, Teachers, Facilities, News, dll) telah diformat dan disinkronkan ke Google Spreadsheet.'
        });
      } else {
        setSyncFeedback({
          success: false,
          message: res?.message || 'Gagal menyinkronkan lembar ke Spreadsheet. Pastikan URL Apps Script sudah benar.'
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        success: false,
        message: err?.message || 'Terjadi kesalahan saat memformat lembar Spreadsheet.'
      });
    } finally {
      setIsFormattingSheets(false);
      setTimeout(() => setSyncFeedback(null), 7000);
    }
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

  const startEditTeacher = (tc: TeacherItem) => {
    setEditingTeacherId(tc.id);
    setEditTeacherName(tc.name);
    setEditTeacherRole(tc.role);
    setEditTeacherSpecialty(tc.specialty);
    setEditTeacherEducation(tc.education);
    setEditTeacherImage(tc.imageUrl);
  };

  const handleSaveEditTeacher = (id: string) => {
    dataService.updateTeacher(id, {
      name: editTeacherName,
      role: editTeacherRole,
      specialty: editTeacherSpecialty,
      education: editTeacherEducation,
      imageUrl: editTeacherImage
    });
    setEditingTeacherId(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      
      {/* Sticky Top Header & Navigation Tabs Bar */}
      <div className="sticky top-0 z-40 bg-[#fdfdfb]/95 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-2 pb-3 border-b border-slate-200/90 shadow-2xs space-y-3">
        {/* Ringkas Header Bar: Judul Admin Ringkas + Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  Dashboard Admin CMS
                </h1>
                <span className="hidden sm:inline text-xs text-slate-400 font-semibold">•</span>
                <span className="hidden sm:inline text-xs font-semibold text-emerald-800 line-clamp-1">
                  {editSettings.schoolName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePushToCloud}
              disabled={isSyncing}
              className="text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 px-3.5 py-1.5 sm:py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              title="Kirim dan sinkronkan semua perubahan ke Google Cloud agar tampil di semua perangkat"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Lintas Perangkat'}</span>
            </button>

            <button
              onClick={() => setActivePage('beranda')}
              className="text-xs font-bold text-slate-600 hover:text-emerald-900 px-3 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 px-3 py-1.5 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Responsive horizontally scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pt-1">
          {[
            { id: 'overview', label: 'Ringkasan', icon: Database },
            { id: 'general_branding', label: 'Pengaturan & Hero Beranda', icon: Settings },
            { id: 'profil', label: `Profil Sekolah (${teachers.length})`, icon: BookOpen },
            { id: 'kegiatan', label: 'Kegiatan & Ekskul', icon: Calendar },
            { id: 'facilities', label: `Fasilitas (${facilities.length})`, icon: Building },
            { id: 'info_publikasi', label: 'Info & Publikasi', icon: Megaphone },
            { id: 'infaq', label: `Infaq & QRIS (${infaqRecords.length})`, icon: HeartHandshake },
            { id: 'advanced_settings', label: 'Pengaturan Lanjutan', icon: Sliders }
          ].map(item => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'info_publikasi' &&
                (activeTab === 'spmb' || activeTab === 'announcements' || activeTab === 'news' || activeTab === 'events')) ||
              (item.id === 'advanced_settings' &&
                (activeTab === 'publish_tutorial' || activeTab === 'security' || activeTab === 'google'));
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

          {/* Panel Grafik Statistik Kunjungan Website (Hanya Tampil di Admin CMS) */}
          <VisitorAnalyticsCard />

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pengaturan Umum, Logo &amp; Media Gambar
              </h3>
              <p className="text-xs text-slate-500">
                Ubah logo, banner foto, identitas sekolah, kontak, dan link PSB secara langsung.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {settingsSaved && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Pengaturan Berhasil Disimpan!</span>
                </span>
              )}
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>

          {/* Sub-Bab Layout: Sidebar Kiri + Konten Kanan */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar Sub-Bab Kiri */}
            <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                Sub-Bab Pengaturan
              </div>
              {[
                { id: 'logo_banner', label: '1. Logo & Foto Banner', desc: 'Logo sekolah, banner hero & profil' },
                { id: 'identity', label: '2. Identitas & Teks Utama', desc: 'Nama, tagline, akreditasi & NPSN' },
                { id: 'contact_psb', label: '3. Kontak, Alamat & PSB', desc: 'WhatsApp, email, link PSB & video' },
                { id: 'hero_stats', label: '4. Statistik Pita Beranda', desc: '4 kartu angka capaian' },
                { id: 'why_us', label: '5. Mengapa Memilih Kami', desc: 'Nilai keunggulan & dokumentasi' },
                { id: 'testimonials_cta', label: '6. Testimoni & Banner CTA', desc: 'Kutipan wali & ajakan pendaftaran' }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setBrandingSubTab(sub.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col ${
                    brandingSubTab === sub.id
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{sub.label}</span>
                  <span className={`text-[10px] font-normal mt-0.5 ${brandingSubTab === sub.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {sub.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Panel Konten Kanan */}
            <div className="flex-1 min-w-0 w-full space-y-6">

          {/* Section: Logo & Media Images dengan Pratinjau Thumbnail Nyata */}
          {brandingSubTab === 'logo_banner' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>Foto Logo &amp; Banner Utama Website (Pratinjau Thumbnail)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih atau unggah file foto dari HP/Laptop Anda. Gambar otomatis dikompresi, disimpan aman di Google Drive, dan langsung tampil sebagai thumbnail.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Logo Sekolah */}
              <ThumbnailUploader
                label="Logo Resmi Sekolah"
                value={editSettings.logoUrl || '/images/logo.png'}
                onChange={url => setEditSettings({ ...editSettings, logoUrl: url })}
                onUploadFile={(file, label) => handleFileUpload(file, url => setEditSettings({ ...editSettings, logoUrl: url }), label)}
                aspectRatio="square"
                fit="contain"
                helperText="PNG transparan direkomendasikan"
                defaultFallback="/images/logo.png"
              />

              {/* Banner Hero Beranda */}
              <ThumbnailUploader
                label="Foto Banner Hero Beranda"
                value={editSettings.heroImageUrl || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"}
                onChange={url => setEditSettings({ ...editSettings, heroImageUrl: url })}
                onUploadFile={(file, label) => handleFileUpload(file, url => setEditSettings({ ...editSettings, heroImageUrl: url }), label)}
                aspectRatio="video"
                fit="cover"
                helperText="Format lanskap 16:9 disarankan"
              />

              {/* Banner Halaman Profil */}
              <ThumbnailUploader
                label="Foto Banner Profil Sekolah"
                value={editSettings.profileBannerImageUrl || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80"}
                onChange={url => setEditSettings({ ...editSettings, profileBannerImageUrl: url })}
                onUploadFile={(file, label) => handleFileUpload(file, url => setEditSettings({ ...editSettings, profileBannerImageUrl: url }), label)}
                aspectRatio="video"
                fit="cover"
                helperText="Format lanskap disarankan"
              />
            </div>

            {/* FITUR 1: Pengelolaan Slideshow Foto Background Hero */}
            {(() => {
              const currentSlideshow: string[] = (editSettings.heroImages && editSettings.heroImages.length > 0)
                ? editSettings.heroImages
                : (editSettings.heroImageUrl ? [editSettings.heroImageUrl] : ["https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80"]);

              return (
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-800" />
                        <span>Slideshow Foto Background Hero Beranda ({currentSlideshow.length} Foto)</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Koleksi foto ini akan otomatis berganti tiap 5 detik dengan transisi fade pada latar Hero beranda. Foto pertama (#1) otomatis menjadi fallback foto utama.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...currentSlideshow, "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80"];
                        setEditSettings({
                          ...editSettings,
                          heroImages: updated,
                          heroImageUrl: updated[0] || editSettings.heroImageUrl
                        });
                      }}
                      className="text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Foto Slideshow</span>
                    </button>
                  </div>

                  {/* List of slideshow images */}
                  <div className="space-y-3">
                    {currentSlideshow.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                            <img
                              src={getOptimizedImageUrl(imgUrl, "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=300&q=80")}
                              alt={`Slide ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=300&q=80";
                              }}
                            />
                            <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {idx === 0 ? 'Foto Utama & Fallback' : `Slide #${idx + 1}`}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={imgUrl}
                              onChange={(e) => {
                                const newImages = [...currentSlideshow];
                                newImages[idx] = e.target.value;
                                setEditSettings({
                                  ...editSettings,
                                  heroImages: newImages,
                                  heroImageUrl: newImages[0] || editSettings.heroImageUrl
                                });
                              }}
                              placeholder="URL foto..."
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <label className="text-xs font-bold text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl cursor-pointer transition-colors">
                            <span>Ganti File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, (uploadedUrl) => {
                                    const newImages = [...currentSlideshow];
                                    newImages[idx] = uploadedUrl;
                                    setEditSettings({
                                      ...editSettings,
                                      heroImages: newImages,
                                      heroImageUrl: newImages[0] || editSettings.heroImageUrl
                                    });
                                  }, `hero_slide_${idx + 1}`);
                                }
                              }}
                            />
                          </label>

                          {/* Move Up */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx === 0) return;
                              const newImages = [...currentSlideshow];
                              const temp = newImages[idx - 1];
                              newImages[idx - 1] = newImages[idx];
                              newImages[idx] = temp;
                              setEditSettings({
                                ...editSettings,
                                heroImages: newImages,
                                heroImageUrl: newImages[0] || editSettings.heroImageUrl
                              });
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                            title="Pindah ke Atas"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Move Down */}
                          <button
                            type="button"
                            disabled={idx === currentSlideshow.length - 1}
                            onClick={() => {
                              if (idx === currentSlideshow.length - 1) return;
                              const newImages = [...currentSlideshow];
                              const temp = newImages[idx + 1];
                              newImages[idx + 1] = newImages[idx];
                              newImages[idx] = temp;
                              setEditSettings({
                                ...editSettings,
                                heroImages: newImages,
                                heroImageUrl: newImages[0] || editSettings.heroImageUrl
                              });
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                            title="Pindah ke Bawah"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={currentSlideshow.length <= 1}
                            onClick={() => {
                              if (currentSlideshow.length <= 1) return;
                              requestDelete('Hapus Foto Slideshow', `Hapus foto slide #${idx + 1}?`, () => {
                                const newImages = currentSlideshow.filter((_, i) => i !== idx);
                                setEditSettings({
                                  ...editSettings,
                                  heroImages: newImages,
                                  heroImageUrl: newImages[0] || editSettings.heroImageUrl
                                });
                              });
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                            title="Hapus Slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
          )}

          {/* Section: Identitas & Teks Header */}
          {brandingSubTab === 'identity' && (
          <div className="space-y-4">
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

            {/* FITUR 2: Pengaturan Running Text (Marquee) Beranda */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-emerald-800" />
                  <span>Teks Berjalan Pengumuman Beranda (Running Text Marquee)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-900 cursor-pointer bg-white px-3 py-1 rounded-lg border border-emerald-200">
                  <input
                    type="checkbox"
                    checked={editSettings.runningTextEnabled !== false}
                    onChange={e => setEditSettings({ ...editSettings, runningTextEnabled: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Tampilkan di Beranda</span>
                </label>
              </div>

              <textarea
                rows={2}
                value={editSettings.runningText ?? ''}
                onChange={e => setEditSettings({ ...editSettings, runningText: e.target.value })}
                placeholder="Tuliskan teks sorotan yang akan berjalan terus di bar bagian atas beranda..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-800"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                <span className="text-slate-500">
                  *Teks akan berjalan terus secara kontinu dan otomatis berhenti saat pengunjung mengarahkan kursor.
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">Template Cepat:</span>
                  <button
                    type="button"
                    onClick={() => setEditSettings({
                      ...editSettings,
                      runningText: "Penerimaan Santri Baru (PSB) Tahun Ajaran 2025/2026 Telah Dibuka! Segera amankan kuota ananda di SD Quran Unggulan Al-I'tisham Playen • Info Layanan SPMB: 0878-9012-3456 • Membina Generasi Qur'ani, Cerdas, dan Berakhlak Mulia.",
                      runningTextEnabled: true
                    })}
                    className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold hover:bg-emerald-200 transition-colors"
                  >
                    PSB Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditSettings({
                      ...editSettings,
                      runningText: "Alhamdulillah, Santri SDQU Al-I'tisham berhasil meraih Juara 1 Tahfidz Qur'an & Olimpiade Sains Tingkat Kabupaten Tahun 2025!",
                      runningTextEnabled: true
                    })}
                    className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 transition-colors"
                  >
                    Prestasi
                  </button>
                </div>
              </div>
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
          )}

          {/* Section: URL Iframe PSB */}
          {brandingSubTab === 'contact_psb' && (
          <div className="space-y-6">
          <div className="space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">WhatsApp Panitia PSB</label>
                <input
                  type="text"
                  value={editSettings.whatsappSpmb}
                  onChange={e => setEditSettings({ ...editSettings, whatsappSpmb: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  placeholder="Contoh: 087890123456 atau 6287890123456"
                />
                <p className="text-[11px] text-slate-500">
                  Nomor ini digunakan di seluruh tombol, teks &amp; link chat WhatsApp panitia di website.
                </p>
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Link Google Maps (Opsional / Custom Embed URL)</label>
              <input
                type="url"
                value={editSettings.googleMapsEmbedUrl || ''}
                onChange={e => setEditSettings({ ...editSettings, googleMapsEmbedUrl: e.target.value })}
                placeholder="Contoh: https://maps.google.com/maps?q=SDQU+Al+I'tisham+Playen&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Jika diisi, peta lokasi di footer website akan menggunakan URL embed ini. Jika dikosongkan, peta otomatis mengikuti teks Alamat Lengkap di atas.
              </p>
            </div>

            {/* Nomor WhatsApp Tambahan (Multi-Kontak) */}
            <div className="pt-3 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Nomor WhatsApp / Kontak Tambahan
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Tambahkan kontak layanan lain (misal: Humas, Bendahara Infaq, Layanan Santri) agar muncul di kontak footer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newContact = {
                      id: `contact-${Date.now()}`,
                      name: '',
                      phone: ''
                    };
                    const updated = [...(editSettings.additionalContacts || []), newContact];
                    setEditSettings({ ...editSettings, additionalContacts: updated });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Kontak</span>
                </button>
              </div>

              {(!editSettings.additionalContacts || editSettings.additionalContacts.length === 0) ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs text-center">
                  Belum ada kontak tambahan. Klik tombol di atas untuk menambahkan.
                </div>
              ) : (
                <div className="space-y-2">
                  {editSettings.additionalContacts.map((contact, idx) => (
                    <div key={contact.id || idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">Nama / Divisi Layanan</label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={e => {
                            const updated = [...(editSettings.additionalContacts || [])];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setEditSettings({ ...editSettings, additionalContacts: updated });
                          }}
                          placeholder="Contoh: Humas &amp; Kerjasama, Bendahara Infaq"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div className="w-full sm:w-56 space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">Nomor WhatsApp</label>
                        <input
                          type="text"
                          value={contact.phone}
                          onChange={e => {
                            const updated = [...(editSettings.additionalContacts || [])];
                            updated[idx] = { ...updated[idx], phone: e.target.value };
                            setEditSettings({ ...editSettings, additionalContacts: updated });
                          }}
                          placeholder="628123456789"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                        />
                      </div>
                      <div className="self-end sm:self-center pt-2 sm:pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editSettings.additionalContacts || []).filter((_, i) => i !== idx);
                            setEditSettings({ ...editSettings, additionalContacts: updated });
                          }}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus kontak ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

          {/* Section: Tombol Video Profil / Pengganti Tonton Profil Singkat */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Tombol &amp; Modal Video Profil Beranda</span>
            </h4>
            <p className="text-xs text-slate-500">
              Ganti teks tombol "Tonton Profil Singkat" dengan kata-kata lain pilihan Anda dan sesuaikan judul modalnya.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Teks Tombol Profil (Di Sebelah Tombol PSB)</label>
                <input
                  type="text"
                  value={editSettings.heroVideoBtnText || ''}
                  onChange={e => setEditSettings({ ...editSettings, heroVideoBtnText: e.target.value })}
                  placeholder="Contoh: Kenali Sekolah Kami / Profil Singkat"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Jendela Modal Profil</label>
                <input
                  type="text"
                  value={editSettings.heroVideoTitle || ''}
                  onChange={e => setEditSettings({ ...editSettings, heroVideoTitle: e.target.value })}
                  placeholder="Profil Singkat SD Qur'an Unggulan Al I'tisham"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Deskripsi Modal Profil</label>
              <textarea
                rows={2}
                value={editSettings.heroVideoDesc || ''}
                onChange={e => setEditSettings({ ...editSettings, heroVideoDesc: e.target.value })}
                placeholder="Deskripsi singkat tentang sekolah yang tampil saat tombol diklik..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
          </div>
          )}

          {/* Section: 4 Statistik Utama Beranda (Pita Angka) */}
          {brandingSubTab === 'hero_stats' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
              <div>
                <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-800" />
                  <span>4 Angka Statistik Utama Beranda (Pita Angka Hero)</span>
                </h4>
                <p className="text-xs text-emerald-900/80 mt-0.5">
                  Struktur tetap 4 slot kartu statistik pada pita hijau di bawah hero Beranda. Anda dapat mengedit teks &amp; nilai, atau mengosongkan/mereset masing-masing slot.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditSettings({
                      ...editSettings,
                      heroStatsRibbon: {
                        stat1Val: '1.200+',
                        stat1Label: 'Santri Aktif & Alumni',
                        stat2Val: '100%',
                        stat2Label: 'Target Tahfidz Mutqin',
                        stat3Val: '45+',
                        stat3Label: 'Asatidz Bersanad',
                        stat4Val: '25+',
                        stat4Label: 'Prestasi Tingkat DIY & Nas',
                      }
                    });
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-900 bg-white hover:bg-emerald-100 rounded-xl border border-emerald-300 flex items-center gap-1.5 shadow-2xs transition-colors"
                  title="Kembalikan semua 4 slot ke nilai awal standar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Semua Default</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditSettings({
                      ...editSettings,
                      heroStatsRibbon: {
                        stat1Val: '',
                        stat1Label: '',
                        stat2Val: '',
                        stat2Label: '',
                        stat3Val: '',
                        stat3Label: '',
                        stat4Val: '',
                        stat4Label: '',
                      }
                    });
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-1.5 shadow-2xs transition-colors"
                  title="Kosongkan semua slot pita agar disembunyikan dari Beranda"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan Semua</span>
                </button>
              </div>
            </div>

            {(() => {
              const currentRibbon = {
                stat1Val: editSettings.heroStatsRibbon?.stat1Val !== undefined ? editSettings.heroStatsRibbon.stat1Val : '1.200+',
                stat1Label: editSettings.heroStatsRibbon?.stat1Label !== undefined ? editSettings.heroStatsRibbon.stat1Label : 'Santri Aktif & Alumni',
                stat1Icon: editSettings.heroStatsRibbon?.stat1Icon || 'users',
                stat2Val: editSettings.heroStatsRibbon?.stat2Val !== undefined ? editSettings.heroStatsRibbon.stat2Val : '100%',
                stat2Label: editSettings.heroStatsRibbon?.stat2Label !== undefined ? editSettings.heroStatsRibbon.stat2Label : 'Target Tahfidz Mutqin',
                stat2Icon: editSettings.heroStatsRibbon?.stat2Icon || 'target',
                stat3Val: editSettings.heroStatsRibbon?.stat3Val !== undefined ? editSettings.heroStatsRibbon.stat3Val : '45+',
                stat3Label: editSettings.heroStatsRibbon?.stat3Label !== undefined ? editSettings.heroStatsRibbon.stat3Label : 'Asatidz Bersanad',
                stat3Icon: editSettings.heroStatsRibbon?.stat3Icon || 'graduation-cap',
                stat4Val: editSettings.heroStatsRibbon?.stat4Val !== undefined ? editSettings.heroStatsRibbon.stat4Val : '25+',
                stat4Label: editSettings.heroStatsRibbon?.stat4Label !== undefined ? editSettings.heroStatsRibbon.stat4Label : 'Prestasi Tingkat DIY & Nas',
                stat4Icon: editSettings.heroStatsRibbon?.stat4Icon || 'award',
              };

              const defaultSlots = [
                { num: 1, val: '1.200+', label: 'Santri Aktif & Alumni', valKey: 'stat1Val', labelKey: 'stat1Label', iconKey: 'stat1Icon', defaultIcon: 'users', desc: 'Slot 1: Total Santri & Alumni' },
                { num: 2, val: '100%', label: 'Target Tahfidz Mutqin', valKey: 'stat2Val', labelKey: 'stat2Label', iconKey: 'stat2Icon', defaultIcon: 'target', desc: 'Slot 2: Target Mutqin Tahfidz' },
                { num: 3, val: '45+', label: 'Asatidz Bersanad', valKey: 'stat3Val', labelKey: 'stat3Label', iconKey: 'stat3Icon', defaultIcon: 'graduation-cap', desc: 'Slot 3: Dewan Asatidz / Pengajar' },
                { num: 4, val: '25+', label: 'Prestasi Tingkat DIY & Nas', valKey: 'stat4Val', labelKey: 'stat4Label', iconKey: 'stat4Icon', defaultIcon: 'award', desc: 'Slot 4: Capaian Prestasi' }
              ];

              const updateSlot = (field: string, val: string) => {
                const updated = {
                  ...currentRibbon,
                  [field]: val
                };
                setEditSettings({
                  ...editSettings,
                  heroStatsRibbon: updated
                });
              };

              const clearSlot = (valKey: string, labelKey: string) => {
                setEditSettings({
                  ...editSettings,
                  heroStatsRibbon: {
                    ...currentRibbon,
                    [valKey]: '',
                    [labelKey]: ''
                  }
                });
              };

              const resetSlot = (valKey: string, labelKey: string, defVal: string, defLabel: string, iconKey: string, defIcon: string) => {
                setEditSettings({
                  ...editSettings,
                  heroStatsRibbon: {
                    ...currentRibbon,
                    [valKey]: defVal,
                    [labelKey]: defLabel,
                    [iconKey]: defIcon
                  }
                });
              };

              const slots = defaultSlots.map(s => ({
                ...s,
                currentVal: (currentRibbon as any)[s.valKey] || '',
                currentLabel: (currentRibbon as any)[s.labelKey] || '',
                currentIcon: (currentRibbon as any)[s.iconKey] || s.defaultIcon,
                isEmpty: !((currentRibbon as any)[s.valKey] || '').trim() && !((currentRibbon as any)[s.labelKey] || '').trim()
              }));

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {slots.map(s => (
                      <div
                        key={s.num}
                        className={`p-4 rounded-2xl border transition-all space-y-3 shadow-2xs ${
                          s.isEmpty
                            ? 'bg-slate-50/70 border-dashed border-slate-300 opacity-80'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-[10px] font-extrabold flex items-center justify-center">
                              {s.num}
                            </span>
                            <span className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wider">
                              Slot #{s.num}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              s.isEmpty
                                ? 'bg-rose-50 text-rose-600 border-rose-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {s.isEmpty ? 'Dikosongkan' : 'Aktif'}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Angka / Nilai
                          </label>
                          <input
                            type="text"
                            value={s.currentVal}
                            onChange={e => updateSlot(s.valKey, e.target.value)}
                            placeholder={s.val}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-extrabold text-emerald-950 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Teks Label Keterangan
                          </label>
                          <input
                            type="text"
                            value={s.currentLabel}
                            onChange={e => updateSlot(s.labelKey, e.target.value)}
                            placeholder={s.label}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-800"
                          />
                        </div>

                        {/* Pilihan Ikon Admin */}
                        <div className="pt-1">
                          <IconPicker
                            label="Pilihan Ikon Kartu"
                            value={s.currentIcon}
                            onChange={newIcon => updateSlot(s.iconKey, newIcon)}
                            fallbackId={s.defaultIcon}
                            compact
                          />
                        </div>

                        <div className="text-[10px] text-slate-400 font-medium">
                          {s.desc}
                        </div>

                        {/* Kontrol Edit / Kosongkan / Reset untuk slot ini */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                          <button
                            type="button"
                            onClick={() => clearSlot(s.valKey, s.labelKey)}
                            disabled={s.isEmpty}
                            className={`text-[11px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                              s.isEmpty
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                            title="Hapus / kosongkan angka dan label slot ini agar tidak tampil di beranda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Kosongkan</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => resetSlot(s.valKey, s.labelKey, s.val, s.label, s.iconKey, s.defaultIcon)}
                            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                            title="Kembalikan nilai awal bawaan slot ini"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Default</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live Preview Pita Beranda */}
                  <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-2.5 shadow-md">
                    <div className="flex items-center justify-between text-[11px] text-emerald-300">
                      <span className="font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pratinjau Tampilan Pengunjung (Pita Beranda)</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full">
                        {slots.filter(s => !s.isEmpty).length} dari 4 slot aktif
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-900/80 pt-1">
                      {slots.map(s => (
                        <div key={s.num} className="pt-2 sm:pt-0 sm:px-3 first:px-0">
                          {s.isEmpty ? (
                            <div className="text-[11px] text-emerald-600/70 italic py-2">
                              (Slot #{s.num} disembunyikan)
                            </div>
                          ) : (
                            <div>
                              <div className="text-xl font-extrabold text-white">
                                {s.currentVal || s.val}
                              </div>
                              <div className="text-xs text-emerald-300 font-medium">
                                {s.currentLabel || s.label}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          )}

          {/* Section: Mengapa Memilih Kami (Why Choose Us) */}
          {brandingSubTab === 'why_us' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Bagian "Mengapa Memilih SDQU Al I'tisham"</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tagline Badge</label>
                <input
                  type="text"
                  value={editSettings.berandaWhyUsTagline || ''}
                  onChange={e => setEditSettings({ ...editSettings, berandaWhyUsTagline: e.target.value })}
                  placeholder="MENGAPA MEMILIH KAMI"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Bagian</label>
                <input
                  type="text"
                  value={editSettings.berandaWhyUsTitle || ''}
                  onChange={e => setEditSettings({ ...editSettings, berandaWhyUsTitle: e.target.value })}
                  placeholder="Fondasi Kokoh untuk Generasi Emas Masa Depan"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Deskripsi Pengantar</label>
              <textarea
                rows={2}
                value={editSettings.berandaWhyUsDesc || ''}
                onChange={e => setEditSettings({ ...editSettings, berandaWhyUsDesc: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            {/* Foto Samping Kiri & Badge Mengapa Memilih Kami */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Foto Samping Kiri &amp; Badge Gambar</span>
                </h5>
                <p className="text-[11px] text-slate-500">
                  Ubah foto santri/kegiatan di samping kiri dan teks badge floating di atas foto.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Teks Badge di Atas Foto</label>
                <input
                  type="text"
                  value={editSettings.whyChooseUsImageBadge || editSettings.berandaWhyUsImageBadge || ''}
                  onChange={e => setEditSettings({
                    ...editSettings,
                    whyChooseUsImageBadge: e.target.value,
                    berandaWhyUsImageBadge: e.target.value
                  })}
                  placeholder="Contoh: 100% Pendampingan Personal atau UNGGUL & BERAKHLAK"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <ThumbnailUploader
                label="Foto Samping Kiri (Pendampingan Santri)"
                value={editSettings.whyChooseUsImageUrl || editSettings.berandaWhyUsImageUrl || ''}
                onChange={url => setEditSettings({
                  ...editSettings,
                  whyChooseUsImageUrl: url,
                  berandaWhyUsImageUrl: url
                })}
                onUploadFile={(file, label) =>
                  handleFileUpload(file, url => setEditSettings({
                    ...editSettings,
                    whyChooseUsImageUrl: url,
                    berandaWhyUsImageUrl: url
                  }), label)
                }
                aspectRatio="portrait"
                fit="cover"
                helperText="Upload foto pendampingan santri atau pilih dari galeri komputer/HP"
              />
            </div>

            {/* Cards Why Choose Us with Full CRUD */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Pilar Keunggulan ({editSettings.berandaWhyUsItems?.length || 0} Pilar)</label>
                  <p className="text-[11px] text-slate-500">Poin-poin pilar keunggulan pada bagian "Mengapa Memilih Kami".</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...(editSettings.berandaWhyUsItems || []),
                      {
                        title: 'Pilar Baru',
                        desc: 'Penjelasan keunggulan yang didapatkan santri.',
                        badge: 'KEUNGGULAN'
                      }
                    ];
                    setEditSettings({ ...editSettings, berandaWhyUsItems: updated });
                  }}
                  className="text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pilar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(editSettings.berandaWhyUsItems || []).map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">Pilar #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.badge || ''}
                          onChange={e => {
                            const updated = [...(editSettings.berandaWhyUsItems || [])];
                            updated[idx] = { ...updated[idx], badge: e.target.value };
                            setEditSettings({ ...editSettings, berandaWhyUsItems: updated });
                          }}
                          placeholder="Badge"
                          className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 text-right w-28 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            requestDelete(
                              'Hapus Pilar Keunggulan',
                              `Apakah Anda yakin ingin menghapus pilar "${item.title || `Pilar #${idx + 1}`}"?`,
                              () => {
                                const updated = editSettings.berandaWhyUsItems?.filter((_, i) => i !== idx);
                                setEditSettings({ ...editSettings, berandaWhyUsItems: updated });
                              }
                            );
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                          title="Hapus Pilar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Judul Pilar</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={e => {
                          const updated = [...(editSettings.berandaWhyUsItems || [])];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setEditSettings({ ...editSettings, berandaWhyUsItems: updated });
                        }}
                        placeholder="Judul Pilar"
                        className="w-full px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Deskripsi Keunggulan</label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={e => {
                          const updated = [...(editSettings.berandaWhyUsItems || [])];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setEditSettings({ ...editSettings, berandaWhyUsItems: updated });
                        }}
                        placeholder="Deskripsi keunggulan..."
                        className="w-full px-2.5 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Section: Testimoni Wali Santri & CTA Banner */}
          {brandingSubTab === 'testimonials_cta' && (
          <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Testimoni Orang Tua &amp; Wali Santri</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Ubah kutipan, nama wali, info santri, serta upload foto thumbnail wali santri.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newItem: TestimonialItem = {
                    id: 'testi-' + Date.now(),
                    name: 'Nama Wali Santri',
                    role: 'Wali Santri Kelas ...',
                    quote: 'Kesan dan pengalaman mempercayakan pendidikan putra-putri di SDQU Al I\'tisham.',
                    studentInfo: 'Ayahanda / Ibunda ...',
                    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'
                  };
                  setEditSettings({
                    ...editSettings,
                    testimonials: [...(editSettings.testimonials || []), newItem]
                  });
                }}
                className="text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Testimoni</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tagline Testimoni</label>
                <input
                  type="text"
                  value={editSettings.testimonialsHeaderTagline || ''}
                  onChange={e => setEditSettings({ ...editSettings, testimonialsHeaderTagline: e.target.value })}
                  placeholder="KATA MEREKA TENTANG AL I'TISHAM"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Bagian Testimoni</label>
                <input
                  type="text"
                  value={editSettings.testimonialsHeaderTitle || ''}
                  onChange={e => setEditSettings({ ...editSettings, testimonialsHeaderTitle: e.target.value })}
                  placeholder="Kepercayaan Penuh dari Ayah &amp; Bunda"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-4">
              {(editSettings.testimonials || []).map((t, idx) => (
                <div key={t.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">Testimoni #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        requestDelete('Hapus Testimoni', `Hapus testimoni dari ${t.name}?`, () => {
                          const updated = editSettings.testimonials?.filter((_, i) => i !== idx);
                          setEditSettings({ ...editSettings, testimonials: updated });
                        });
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">Nama Wali Santri *</label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={e => {
                          const updated = [...(editSettings.testimonials || [])];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setEditSettings({ ...editSettings, testimonials: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">Role / Status</label>
                      <input
                        type="text"
                        value={t.role}
                        onChange={e => {
                          const updated = [...(editSettings.testimonials || [])];
                          updated[idx] = { ...updated[idx], role: e.target.value };
                          setEditSettings({ ...editSettings, testimonials: updated });
                        }}
                        placeholder="Wali Santri Kelas 4"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block">Info Santri (Anak)</label>
                      <input
                        type="text"
                        value={t.studentInfo || ''}
                        onChange={e => {
                          const updated = [...(editSettings.testimonials || [])];
                          updated[idx] = { ...updated[idx], studentInfo: e.target.value };
                          setEditSettings({ ...editSettings, testimonials: updated });
                        }}
                        placeholder="Ibunda Aisyah (Hafal 3 Juz)"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Kutipan Testimoni</label>
                    <textarea
                      rows={2}
                      value={t.quote || t.content || ''}
                      onChange={e => {
                        const updated = [...(editSettings.testimonials || [])];
                        updated[idx] = { ...updated[idx], quote: e.target.value, content: e.target.value };
                        setEditSettings({ ...editSettings, testimonials: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <ThumbnailUploader
                      label={`Foto / Avatar untuk ${t.name}`}
                      value={t.imageUrl || t.avatar || ''}
                      onChange={url => {
                        const updated = [...(editSettings.testimonials || [])];
                        updated[idx] = { ...updated[idx], avatar: url, imageUrl: url };
                        setEditSettings({ ...editSettings, testimonials: updated });
                      }}
                      onUploadFile={(file, label) =>
                        handleFileUpload(file, url => {
                          const updated = [...(editSettings.testimonials || [])];
                          updated[idx] = { ...updated[idx], avatar: url, imageUrl: url };
                          setEditSettings({ ...editSettings, testimonials: updated });
                        }, label)
                      }
                      aspectRatio="avatar"
                      fit="cover"
                      helperText="Pilih foto profil orang tua/wali dari galeri"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: CTA Banner Beranda */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Banner Ajakan Pendaftaran (CTA Beranda)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Badge Banner</label>
                <input
                  type="text"
                  value={editSettings.berandaCtaBadge || ''}
                  onChange={e => setEditSettings({ ...editSettings, berandaCtaBadge: e.target.value })}
                  placeholder="PENERIMAAN SANTRI BARU"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Teks Tombol Aksi</label>
                <input
                  type="text"
                  value={editSettings.berandaCtaBtnText || ''}
                  onChange={e => setEditSettings({ ...editSettings, berandaCtaBtnText: e.target.value })}
                  placeholder="Daftar Santri Baru Sekarang"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Judul Banner CTA</label>
              <input
                type="text"
                value={editSettings.berandaCtaTitle || ''}
                onChange={e => setEditSettings({ ...editSettings, berandaCtaTitle: e.target.value })}
                placeholder="Siapkan Masa Depan Qur'ani Putra-Putri Anda Bersama Kami"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Deskripsi Banner CTA</label>
              <textarea
                rows={2}
                value={editSettings.berandaCtaDesc || ''}
                onChange={e => setEditSettings({ ...editSettings, berandaCtaDesc: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
          </div>
          )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Pengaturan</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB CONTENT: PROFIL SEKOLAH TERPADU (6 SUB-BAB SESUAI DROPDOWN PUBLIK) */}
      {(activeTab === 'profil' || activeTab === 'vision_missions' || activeTab === 'programs_achievements' || activeTab === 'teachers') && (
        <AdminProfilTab
          settings={editSettings}
          onUpdateSettings={setEditSettings}
          teachers={teachers}
          onAddTeacher={dataService.addTeacher}
          onUpdateTeacher={dataService.updateTeacher}
          onDeleteTeacher={dataService.deleteTeacher}
          handleFileUpload={handleFileUpload}
          requestDelete={requestDelete}
          settingsSaved={settingsSaved}
          onSave={handleSaveSettings}
        />
      )}

      {/* TAB CONTENT: FASILITAS (6 FASILITAS) */}
      {activeTab === 'facilities' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kelola Fasilitas Kampus ({facilities.length} Fasilitas)
              </h3>
              <p className="text-xs text-slate-500">
                Ubah foto, nama, spesifikasi, dan deskripsi fasilitas yang tampil di halaman Fasilitas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFacilitiesSubTab(facilitiesSubTab === 'list' ? 'add' : 'list')}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{facilitiesSubTab === 'list' ? 'Tambah Fasilitas Baru' : 'Lihat Daftar Fasilitas'}</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar Sub-Bab Kiri */}
            <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                Sub-Bab Fasilitas
              </div>
              {[
                { id: 'list', label: '1. Daftar Fasilitas', desc: `${facilities.length} fasilitas terdaftar` },
                { id: 'add', label: '2. Tambah Fasilitas Baru', desc: 'Formulir fasilitas baru' },
                { id: 'categories', label: '3. Pengantar 3 Kategori', desc: 'Judul, narasi & foto 3 kategori' }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setFacilitiesSubTab(sub.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col ${
                    facilitiesSubTab === sub.id
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{sub.label}</span>
                  <span className={`text-[10px] font-normal mt-0.5 ${facilitiesSubTab === sub.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {sub.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Panel Konten Kanan */}
            <div className="flex-1 min-w-0 w-full space-y-6">
              {/* Form Tambah Fasilitas */}
              {facilitiesSubTab === 'add' && (
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

                <div className="sm:col-span-2">
                  <ThumbnailUploader
                    label="Foto Fasilitas Sekolah (Thumbnail)"
                    value={newFacImage}
                    onChange={setNewFacImage}
                    onUploadFile={(file, label) => handleFileUpload(file, setNewFacImage, label)}
                    aspectRatio="video"
                    fit="cover"
                    helperText="Pilih foto fasilitas dari galeri HP atau komputer"
                  />
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
                  onClick={() => setFacilitiesSubTab('list')}
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
          {facilitiesSubTab === 'list' && (
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

                      <ThumbnailUploader
                        label="Foto Fasilitas (Thumbnail)"
                        value={editFacImage}
                        onChange={setEditFacImage}
                        onUploadFile={(file, label) => handleFileUpload(file, setEditFacImage, label)}
                        aspectRatio="video"
                        fit="cover"
                      />

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
          )}

          {/* Form Pengantar 3 Kategori & Header Fasilitas */}
          {facilitiesSubTab === 'categories' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Header Info */}
              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-800" />
                    <span>Header &amp; Pengantar Halaman Fasilitas</span>
                  </h4>
                  <p className="text-xs text-emerald-900/80 mt-0.5">
                    Teks pengantar di bagian paling atas halaman Fasilitas publik beserta 2 angka statistik ringkasnya.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Badge / Tagline Atas</label>
                    <input
                      type="text"
                      value={editSettings.fasilitasBadge || ''}
                      onChange={e => setEditSettings({ ...editSettings, fasilitasBadge: e.target.value })}
                      placeholder="SARANA &amp; PRASARANA MODERN"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700">Judul Utama Halaman Fasilitas</label>
                    <input
                      type="text"
                      value={editSettings.fasilitasTitle || ''}
                      onChange={e => setEditSettings({ ...editSettings, fasilitasTitle: e.target.value })}
                      placeholder="Fasilitas Pendukung Belajar &amp; Tahfidz yang Asri"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Subtitle Pengantar</label>
                  <textarea
                    rows={2}
                    value={editSettings.fasilitasSubtitle || ''}
                    onChange={e => setEditSettings({ ...editSettings, fasilitasSubtitle: e.target.value })}
                    placeholder="Menghadirkan lingkungan belajar yang aman, nyaman, dan sejuk di Playen..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-200/60">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-950">Statistik Cepat #1</span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={editSettings.fasilitasStat1Val || ''}
                        onChange={e => setEditSettings({ ...editSettings, fasilitasStat1Val: e.target.value })}
                        placeholder="100%"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={editSettings.fasilitasStat1Label || ''}
                        onChange={e => setEditSettings({ ...editSettings, fasilitasStat1Label: e.target.value })}
                        placeholder="Milik Sendiri"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        value={editSettings.fasilitasStat1Sub || ''}
                        onChange={e => setEditSettings({ ...editSettings, fasilitasStat1Sub: e.target.value })}
                        placeholder="Lahan Wakaf"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-950">Statistik Cepat #2</span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={editSettings.fasilitasStat2Val || ''}
                        onChange={e => setEditSettings({ ...editSettings, fasilitasStat2Val: e.target.value })}
                        placeholder="2.500 m²"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={editSettings.fasilitasStat2Label || ''}
                        onChange={e => setEditSettings({ ...editSettings, fasilitasStat2Label: e.target.value })}
                        placeholder="Luas Kampus"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                      <input
                        type="text"
                        value={editSettings.fasilitasStat2Sub || ''}
                        onChange={e => setEditSettings({ ...editSettings, fasilitasStat2Sub: e.target.value })}
                        placeholder="Asri & Terpadu"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kategori 1 */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-900 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        Kategori 1: Sarana Ibadah &amp; Al-Qur'an
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Masjid, area wudhu, halaqah tahfidz Qur'an.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditSettings({
                        ...editSettings,
                        facilityCat1Title: "Sarana Ibadah & Al-Qur'an",
                        facilityCat1Desc: "Pusat pembinaan ruhiyah santri berupa masjid yang sejuk dan bersih, area wudhu higienis terpisah ikhwan-akhwat, serta ruang halaqah tahfidzul Qur'an yang kondusif untuk kelancaran talaqqi dan muroja'ah.",
                        facilityCat1Image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80"
                      });
                    }}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 hover:bg-emerald-100/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Default</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Judul Kategori 1 *</label>
                  <input
                    type="text"
                    value={editSettings.facilityCat1Title || ''}
                    onChange={e => setEditSettings({ ...editSettings, facilityCat1Title: e.target.value })}
                    placeholder="Sarana Ibadah & Al-Qur'an"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Narasi Pengantar Kategori 1 *</label>
                  <textarea
                    rows={3}
                    value={editSettings.facilityCat1Desc || ''}
                    onChange={e => setEditSettings({ ...editSettings, facilityCat1Desc: e.target.value })}
                    placeholder="Deskripsi pengantar kategori ibadah..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <ThumbnailUploader
                  label="Foto Utama / Banner Kategori 1"
                  value={editSettings.facilityCat1Image || ''}
                  onChange={val => setEditSettings({ ...editSettings, facilityCat1Image: val })}
                  onUploadFile={(file, label) => handleFileUpload(file, val => setEditSettings({ ...editSettings, facilityCat1Image: val }), label)}
                  aspectRatio="video"
                  fit="cover"
                  helperText="Foto representatif yang tampil di samping teks narasi kategori 1"
                />
              </div>

              {/* Kategori 2 */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        Kategori 2: Ruang Belajar &amp; Pembiasaan
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Ruang kelas, perpustakaan, lab komputer, aula serbaguna.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditSettings({
                        ...editSettings,
                        facilityCat2Title: "Ruang Belajar & Pembiasaan",
                        facilityCat2Desc: "Ruang kelas representatif dengan ventilasi optimal dan pencahayaan asri, laboratorium komputer untuk literasi digital santri, aula serbaguna, serta media peraga pembelajaran konkret dan interaktif.",
                        facilityCat2Image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
                      });
                    }}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 hover:bg-emerald-100/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Default</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Judul Kategori 2 *</label>
                  <input
                    type="text"
                    value={editSettings.facilityCat2Title || ''}
                    onChange={e => setEditSettings({ ...editSettings, facilityCat2Title: e.target.value })}
                    placeholder="Ruang Belajar & Pembiasaan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Narasi Pengantar Kategori 2 *</label>
                  <textarea
                    rows={3}
                    value={editSettings.facilityCat2Desc || ''}
                    onChange={e => setEditSettings({ ...editSettings, facilityCat2Desc: e.target.value })}
                    placeholder="Deskripsi pengantar ruang kelas dan belajar..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <ThumbnailUploader
                  label="Foto Utama / Banner Kategori 2"
                  value={editSettings.facilityCat2Image || ''}
                  onChange={val => setEditSettings({ ...editSettings, facilityCat2Image: val })}
                  onUploadFile={(file, label) => handleFileUpload(file, val => setEditSettings({ ...editSettings, facilityCat2Image: val }), label)}
                  aspectRatio="video"
                  fit="cover"
                  helperText="Foto representatif yang tampil di samping teks narasi kategori 2"
                />
              </div>

              {/* Kategori 3 */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-800 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        Kategori 3: Olahraga, Seni &amp; Pendukung
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Lapangan olahraga, area panahan, UKS, kantin sehat, lingkungan asri.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditSettings({
                        ...editSettings,
                        facilityCat3Title: "Olahraga, Seni & Pendukung",
                        facilityCat3Desc: "Halaman terbuka hijau yang luas untuk apel, olahraga futsal, latihan memanah sunnah, kepanduan Hizbul Wathan/Pramuka, serta ekosistem lingkungan asri ramah anak yang bebas polusi.",
                        facilityCat3Image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                      });
                    }}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 hover:bg-emerald-100/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Default</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Judul Kategori 3 *</label>
                  <input
                    type="text"
                    value={editSettings.facilityCat3Title || ''}
                    onChange={e => setEditSettings({ ...editSettings, facilityCat3Title: e.target.value })}
                    placeholder="Olahraga, Seni & Pendukung"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Deskripsi Narasi Pengantar Kategori 3 *</label>
                  <textarea
                    rows={3}
                    value={editSettings.facilityCat3Desc || ''}
                    onChange={e => setEditSettings({ ...editSettings, facilityCat3Desc: e.target.value })}
                    placeholder="Deskripsi pengantar olahraga dan sarana pendukung..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <ThumbnailUploader
                  label="Foto Utama / Banner Kategori 3"
                  value={editSettings.facilityCat3Image || ''}
                  onChange={val => setEditSettings({ ...editSettings, facilityCat3Image: val })}
                  onUploadFile={(file, label) => handleFileUpload(file, val => setEditSettings({ ...editSettings, facilityCat3Image: val }), label)}
                  aspectRatio="video"
                  fit="cover"
                  helperText="Foto representatif yang tampil di samping teks narasi kategori 3"
                />
              </div>

              {/* Tombol Simpan */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                {settingsSaved ? (
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    <span>Pengantar kategori fasilitas berhasil disimpan &amp; disinkronkan!</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    *Klik tombol simpan untuk memperbarui halaman Fasilitas publik secara langsung.
                  </span>
                )}

                <button
                  type="submit"
                  className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengantar Fasilitas</span>
                </button>
              </div>
            </form>
          )}

            </div>
          </div>
        </div>
      )}



      {/* TAB CONTENT: KEGIATAN & EKSKUL */}
      {activeTab === 'kegiatan' && (
        <AdminKegiatanTab
          settings={editSettings}
          onUpdateSettings={setEditSettings}
          handleFileUpload={handleFileUpload}
          requestDelete={requestDelete}
          onSave={handleSaveSettings}
          settingsSaved={settingsSaved}
          events={events}
          onAddEvent={(newEvent) => {
            dataService.addEvent(newEvent);
          }}
          onUpdateEvent={(id, updated) => {
            dataService.updateEvent(id, updated);
          }}
          onDeleteEvent={(id, title) => {
            requestDelete(
              `Hapus Agenda "${title}"`,
              `Apakah Anda yakin ingin menghapus agenda kegiatan "${title}"? Tindakan ini tidak dapat dibatalkan.`,
              () => {
                dataService.deleteEvent(id);
              }
            );
          }}
        />
      )}

      {/* TAB CONTENT: INFO & PUBLIKASI (GABUNGAN ALUR & SPMB, PENGUMUMAN, BERITA, AGENDA) */}
      {(activeTab === 'info_publikasi' || activeTab === 'spmb' || activeTab === 'announcements' || activeTab === 'news' || activeTab === 'events') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  PORTAL INFORMASI TERPADU
                </span>
                <span className="text-xs text-slate-400 font-semibold">• 4 Modul Terintegrasi</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-1.5">
                Kelola Informasi &amp; Publikasi Madrasah
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pusat kendali Alur &amp; SPMB, Pengumuman pita informasi, Berita &amp; artikel madrasah, serta Agenda kegiatan sekolah.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar Sub-Bab Kiri */}
            <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                Sub-Bab Publikasi
              </div>
              {[
                { id: 'spmb', label: '1. Alur & SPMB', desc: 'Alur PSB, kuota & integrasi portal', icon: CheckCircle2 },
                { id: 'announcements', label: '2. Pengumuman', desc: `${announcements.length} pengumuman terdata`, icon: Megaphone },
                { id: 'news', label: '3. Berita & Artikel', desc: `${news.length} artikel terbit`, icon: Newspaper },
                { id: 'events', label: '4. Agenda Sekolah', desc: `${events.length} agenda terdaftar`, icon: Calendar }
              ].map(sub => {
                const SubIcon = sub.icon;
                const isSubActive = (activeTab === 'info_publikasi' && infoSubTab === sub.id) || activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setInfoSubTab(sub.id as any);
                      setActiveTab('info_publikasi');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col ${
                      isSubActive
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-amber-300' : 'text-slate-500'}`} />
                      <span>{sub.label}</span>
                    </div>
                    <span className={`text-[10px] font-normal mt-0.5 ml-5.5 ${isSubActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {sub.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Panel Konten Kanan */}
            <div className="flex-1 min-w-0 w-full space-y-6">
              {/* SUB 1: ALUR & SPMB */}
              {((infoSubTab === 'spmb' && activeTab === 'info_publikasi') || activeTab === 'spmb') && (
                <AdminSpmbTab
                  settings={editSettings}
                  onUpdateSettings={setEditSettings}
                  requestDelete={requestDelete}
                  onSave={handleSaveSettings}
                  settingsSaved={settingsSaved}
                />
              )}

              {/* SUB 2: PENGUMUMAN */}
              {((infoSubTab === 'announcements' && activeTab === 'info_publikasi') || activeTab === 'announcements') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Kelola Pengumuman Sekolah ({announcements.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Pengumuman aktif akan muncul di pita informasi atas website.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAnnouncementsSubTab(announcementsSubTab === 'list' ? 'add' : 'list')}
                      className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{announcementsSubTab === 'list' ? 'Tambah Pengumuman' : 'Lihat Daftar Pengumuman'}</span>
                    </button>
                  </div>

                  {/* Form Tambah */}
                  {announcementsSubTab === 'add' && (
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
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
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
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setAnnouncementsSubTab('list')}
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
                  {announcementsSubTab === 'list' && (
                    <div className="space-y-3">
                      {announcements.map(ann => (
                        <div
                          key={ann.id}
                          className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50"
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
                  )}
                </div>
              )}

              {/* SUB 3: BERITA */}
              {((infoSubTab === 'news' && activeTab === 'info_publikasi') || activeTab === 'news') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Berita &amp; Artikel Sekolah ({news.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Artikel informasi yang tampil di halaman Berita / Beranda.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewsSubTab(newsSubTab === 'list' ? 'add' : 'list')}
                      className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{newsSubTab === 'list' ? 'Tambah Berita Baru' : 'Lihat Daftar Berita'}</span>
                    </button>
                  </div>

                  {/* Form Tambah Berita Baru */}
                  {newsSubTab === 'add' && (
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
                        <div className="sm:col-span-2">
                          <ThumbnailUploader
                            label="Foto Dokumentasi Berita (Thumbnail)"
                            value={newNewsImage}
                            onChange={setNewNewsImage}
                            onUploadFile={(file, label) => handleFileUpload(file, setNewNewsImage, label)}
                            aspectRatio="video"
                            fit="cover"
                            helperText="Pilih foto kegiatan atau berita dari galeri HP atau komputer"
                          />
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
                          onClick={() => setNewsSubTab('list')}
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

                  {newsSubTab === 'list' && (
                    <div className="space-y-3">
                      {news.map(item => (
                        <div key={item.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
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
                  )}
                </div>
              )}

              {/* SUB 4: AGENDA */}
              {((infoSubTab === 'events' && activeTab === 'info_publikasi') || activeTab === 'events') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Agenda Kegiatan Sekolah ({events.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kalender jadwal akademik dan kegiatan madrasah.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEventsSubTab(eventsSubTab === 'list' ? 'add' : 'list')}
                      className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{eventsSubTab === 'list' ? 'Tambah Agenda Baru' : 'Lihat Jadwal Agenda'}</span>
                    </button>
                  </div>

                  {/* Form Tambah Agenda Baru */}
                  {eventsSubTab === 'add' && (
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
                          onClick={() => setEventsSubTab('list')}
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

                  {eventsSubTab === 'list' && (
                    <div className="space-y-3">
                      {events.map((ev, idx) => (
                        <div key={`${ev.id}-${idx}`} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
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
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INFAQ & DONASI */}
      {activeTab === 'infaq' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar Sub-Bab Kiri */}
            <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                Sub-Bab Infaq & Donasi
              </div>
              {[
                { id: 'bank_qris', label: '1. Rekening Bank & QRIS', desc: 'Pengaturan QRIS & Nomor Rekening' },
                { id: 'records', label: '2. Riwayat Infaq Masuk', desc: `${infaqRecords.length} konfirmasi donasi` },
                { id: 'programs', label: '3. Program Infaq', desc: `${(editSettings.infaqPrograms?.length || 3)} program donasi` }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setInfaqSubTab(sub.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col ${
                    infaqSubTab === sub.id
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{sub.label}</span>
                  <span className={`text-[10px] font-normal mt-0.5 ${infaqSubTab === sub.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {sub.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Panel Konten Kanan */}
            <div className="flex-1 min-w-0 w-full space-y-6">

          {/* Rekening & QRIS Form */}
          {infaqSubTab === 'bank_qris' && (
          <>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                {/* QRIS Image Preview with ThumbnailUploader */}
                <div className="sm:col-span-2">
                  <ThumbnailUploader
                    label="Foto Barcode QRIS Resmi Sekolah (Thumbnail)"
                    value={editSettings.qrisImageUrl || ''}
                    onChange={url => setEditSettings({ ...editSettings, qrisImageUrl: url })}
                    onUploadFile={(file, label) => handleFileUpload(file, url => setEditSettings({ ...editSettings, qrisImageUrl: url }), label)}
                    aspectRatio="square"
                    fit="contain"
                    helperText="Unggah gambar screenshot atau file QRIS dari Bank"
                  />
                </div>

                {/* NMID field */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nomor NMID QRIS:</label>
                    <input
                      type="text"
                      value={editSettings.qrisId || ''}
                      onChange={e => setEditSettings({ ...editSettings, qrisId: e.target.value })}
                      placeholder="Contoh: ID1023249081721"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white font-semibold"
                    />
                    <p className="text-[10px] text-slate-500">Nomor National Merchant ID yang tertera di bawah barcode QRIS Anda.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Bank Accounts Manager */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-800" />
                    Daftar Rekening Bank Penyaluran Donasi
                  </h4>
                  <p className="text-xs text-slate-500">
                    Rekening resmi yang ditampilkan di halaman Infaq &amp; Wakaf website. Anda dapat menambah, mengubah, atau menghapus rekening secara fleksibel.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddBankModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Rekening Baru</span>
                </button>
              </div>

              {(() => {
                const currentAccounts: BankAccountItem[] = (editSettings.bankAccounts && editSettings.bankAccounts.length > 0)
                  ? editSettings.bankAccounts
                  : [
                      ...(editSettings.bankBsi?.accountNumber ? [{
                        id: 'bank-bsi',
                        bankName: editSettings.bankBsi.bankName || 'Bank Syariah Indonesia (BSI)',
                        accountNumber: editSettings.bankBsi.accountNumber || '',
                        holderName: editSettings.bankBsi.holderName || "a.n. YAYASAN AL I'TISHAM PLAYEN",
                        branch: editSettings.bankBsi.branch || 'Kode Bank: 451'
                      }] : []),
                      ...(editSettings.bankBpd?.accountNumber ? [{
                        id: 'bank-bpd',
                        bankName: editSettings.bankBpd.bankName || 'Bank BPD DIY Syariah',
                        accountNumber: editSettings.bankBpd.accountNumber || '',
                        holderName: editSettings.bankBpd.holderName || "a.n. SDQ UNGGULAN AL I'TISHAM",
                        branch: editSettings.bankBpd.branch || 'Capem Gunungkidul'
                      }] : [])
                    ];

                if (currentAccounts.length === 0) {
                  return (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-slate-500 space-y-2">
                      <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold">Belum ada rekening bank yang dikonfigurasi.</p>
                      <p className="text-[11px] text-slate-400">Klik "Tambah Rekening Baru" untuk menambahkan rekening pertama.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentAccounts.map((account, idx) => (
                      <div
                        key={account.id || idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-[10px]">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {account.bankName}
                              </span>
                            </div>
                            {account.branch && (
                              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {account.branch}
                              </span>
                            )}
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-0.5">
                            <div className="text-sm font-mono font-bold text-slate-900 tracking-wider">
                              {account.accountNumber}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium truncate">
                              a.n. {account.holderName}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60">
                          <button
                            type="button"
                            onClick={() => openEditBankModal(account)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                            title="Edit Rekening"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBankAccount(account.id, account.bankName)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 transition-colors"
                            title="Hapus Rekening"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Infaq &amp; QRIS</span>
              </button>
            </div>
          </form>

          {/* Modal Input/Edit Rekening Bank */}
          {bankModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-900">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold">
                      {editingBankId ? 'Edit Rekening Bank' : 'Tambah Rekening Bank Baru'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBankModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveBankAccount} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nama Bank *</label>
                    <input
                      type="text"
                      required
                      value={bankFormName}
                      onChange={e => setBankFormName(e.target.value)}
                      placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nomor Rekening *</label>
                    <input
                      type="text"
                      required
                      value={bankFormNumber}
                      onChange={e => setBankFormNumber(e.target.value)}
                      placeholder="Contoh: 712-345-6789"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Atas Nama Pemilik Rekening *</label>
                    <input
                      type="text"
                      required
                      value={bankFormHolder}
                      onChange={e => setBankFormHolder(e.target.value)}
                      placeholder="Contoh: a.n. YAYASAN AL I'TISHAM PLAYEN"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Kantor Cabang / Keterangan (Opsional)</label>
                    <input
                      type="text"
                      value={bankFormBranch}
                      onChange={e => setBankFormBranch(e.target.value)}
                      placeholder="Contoh: Capem Gunungkidul atau Kode Bank: 451"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setBankModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold transition-colors shadow-xs"
                    >
                      Simpan Rekening
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          </>
          )}

          {/* Tabel Riwayat Infaq */}
          {infaqSubTab === 'records' && (
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
          )}

          {/* SUB-BAB 3: PROGRAM INFAQ UNGGULAN (CRUD) */}
          {infaqSubTab === 'programs' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-emerald-800" />
                    <span>Daftar Program Infaq &amp; Donasi</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kelola kartu program infaq yang tampil di halaman donasi publik serta opsi pilihan form konfirmasi donatur.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddInfaqProgramModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Program Infaq</span>
                </button>
              </div>

              {(() => {
                const currentPrograms: InfaqProgramItem[] = (editSettings.infaqPrograms && editSettings.infaqPrograms.length > 0)
                  ? editSettings.infaqPrograms
                  : [
                      {
                        id: "inf-1",
                        tag: "BEASISWA DHUAFA",
                        title: "Beasiswa Santri Qur'an",
                        description: "Bantuan biaya pendidikan, seragam, dan buku untuk santri yatim dan dhuafa berprestasi agar terus lancar menghafal Al-Qur'an.",
                        highlight: "Mulai Rp 50.000 / paket",
                        iconType: "scholarship"
                      },
                      {
                        id: "inf-2",
                        tag: "WAKAF JARIYAH",
                        title: "Wakaf Sarana & Bangunan",
                        description: "Pembangunan dan perluasan ruang kelas baru, perluasan masjid jami' sekolah, serta pengadaan AC ramah lingkungan.",
                        highlight: "Pahala Mengalir Abadi",
                        iconType: "building"
                      },
                      {
                        id: "inf-3",
                        tag: "OPERASIONAL DAKWAH",
                        title: "Operasional Dakwah & Al-Qur'an",
                        description: "Pengadaan mushaf Al-Qur'an rasm Utsmani, media pembelajaran digital sains terpadu, dan pelatihan sanad asatidz berkala.",
                        highlight: "Investasi Generasi Emas",
                        iconType: "book"
                      }
                    ];

                if (currentPrograms.length === 0) {
                  return (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-slate-500 space-y-2">
                      <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold">Belum ada program infaq yang dikonfigurasi.</p>
                      <p className="text-[11px] text-slate-400">Klik "Tambah Program Infaq" untuk menambahkan program donasi pertama.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentPrograms.map((prog, idx) => (
                      <div
                        key={prog.id || idx}
                        className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                              {prog.tag || 'PROGRAM'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Icon: {prog.iconType === 'building' ? 'Gedung' : prog.iconType === 'book' ? 'Buku/Al-Qur\'an' : 'Beasiswa'}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {prog.title}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {prog.description}
                          </p>

                          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                            {prog.highlight}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200/60">
                          <button
                            type="button"
                            onClick={() => openEditInfaqProgramModal(prog)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteInfaqProgram(prog.id, prog.title)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Modal Input/Edit Program Infaq */}
              {infaqProgramModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-slate-900">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                          <HeartHandshake className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold">
                          {editingInfaqProgramId ? 'Edit Program Infaq' : 'Tambah Program Infaq Baru'}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInfaqProgramModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveInfaqProgram} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Judul Program Donasi *
                        </label>
                        <input
                          type="text"
                          required
                          value={infaqProgTitle}
                          onChange={e => setInfaqProgTitle(e.target.value)}
                          placeholder="Contoh: Beasiswa Santri Qur'an, Wakaf Gedung..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Label / Tag Badge
                          </label>
                          <input
                            type="text"
                            value={infaqProgTag}
                            onChange={e => setInfaqProgTag(e.target.value)}
                            placeholder="Contoh: BEASISWA DHUAFA, WAKAF JARIYAH"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Ikon Kartu
                          </label>
                          <select
                            value={infaqProgIconType}
                            onChange={e => setInfaqProgIconType(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white"
                          >
                            <option value="scholarship">Topi Toga (Beasiswa)</option>
                            <option value="building">Gedung / Sarana</option>
                            <option value="book">Buku / Mushaf Qur'an</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Highlight / Target Donasi
                        </label>
                        <input
                          type="text"
                          value={infaqProgHighlight}
                          onChange={e => setInfaqProgHighlight(e.target.value)}
                          placeholder="Contoh: Mulai Rp 50.000 / paket, Pahala Mengalir Abadi"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Deskripsi Lengkap Program
                        </label>
                        <textarea
                          rows={3}
                          value={infaqProgDesc}
                          onChange={e => setInfaqProgDesc(e.target.value)}
                          placeholder="Jelaskan tujuan program, sasaran santri, dan keutamaan penyaluran donasi ini..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setInfaqProgramModalOpen(false)}
                          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Save className="w-4 h-4" />
                          <span>Simpan Program</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PENGATURAN LANJUTAN (CADANGAN & DATABASE, KEAMANAN SANDI, INTEGRASI GOOGLE) */}
      {(activeTab === 'advanced_settings' || activeTab === 'publish_tutorial' || activeTab === 'security' || activeTab === 'google') && (
        <AdminPengaturanLanjutanTab
          settings={settings}
          dataService={dataService}
          spreadsheetIdInput={spreadsheetIdInput}
          setSpreadsheetIdInput={setSpreadsheetIdInput}
          driveFolderIdInput={driveFolderIdInput}
          setDriveFolderIdInput={setDriveFolderIdInput}
          appsScriptUrlInput={appsScriptUrlInput}
          setAppsScriptUrlInput={setAppsScriptUrlInput}
          handleSaveGoogleSettings={handleSaveGoogleSettings}
          appsScriptSaved={appsScriptSaved}
          handleSyncGoogle={handleSyncGoogle}
          isSyncing={isSyncing}
          syncFeedback={syncFeedback}
          handleFormatSheets={handleFormatSheets}
          isFormattingSheets={isFormattingSheets}
          handleTestConnection={handleTestConnection}
          isTestingConnection={isTestingConnection}
          testConnectionFeedback={testConnectionFeedback}
          copiedCode={copiedCode}
          setCopiedCode={setCopiedCode}
          handleExportDatabase={handleExportDatabase}
          handleImportDatabase={handleImportDatabase}
          backupFeedback={backupFeedback}
          setBackupFeedback={setBackupFeedback}
          requestDelete={requestDelete}
          activeSubTab={advancedSubTab}
          onChangeSubTab={setAdvancedSubTab}
        />
      )}


      {/* MODAL KONFIRMASI HAPUS NON-BLOCKING (Mencegah kendala confirm() di iframe) */}
      {deleteModal && deleteModal.isOpen && (
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


    </div>
  );
};
