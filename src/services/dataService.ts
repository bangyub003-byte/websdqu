import {
  Announcement,
  EventItem,
  FacilityItem,
  GalleryItem,
  InfaqConfirmation,
  NewsItem,
  PPDBApplicant,
  SchoolSettings,
  TeacherItem
} from '../types';
import { GOOGLE_CONFIG } from '../config/googleConfig';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_FACILITIES,
  INITIAL_GALLERY,
  INITIAL_NEWS,
  INITIAL_PPDB,
  INITIAL_SETTINGS,
  INITIAL_TEACHERS
} from '../data/initialData';

// Storage keys
const STORAGE_KEYS = {
  SETTINGS: 'sdqu_settings_v2',
  ANNOUNCEMENTS: 'sdqu_announcements_v1',
  NEWS: 'sdqu_news_v1',
  EVENTS: 'sdqu_events_v1',
  TEACHERS: 'sdqu_teachers_v1',
  FACILITIES: 'sdqu_facilities_v2',
  GALLERY: 'sdqu_gallery_v1',
  PPDB: 'sdqu_ppdb_v1',
  INFAQ: 'sdqu_infaq_v1',
  APPS_SCRIPT_URL: 'sdqu_apps_script_url_v1',
  ADMIN_AUTH: 'sdqu_admin_auth_v1',
  ADMIN_PASSWORD: 'sdqu_admin_pwd_v1'
};

type Listener = () => void;

class DataService {
  private listeners: Set<Listener> = new Set();
  private settings: SchoolSettings;
  private announcements: Announcement[];
  private news: NewsItem[];
  private events: EventItem[];
  private teachers: TeacherItem[];
  private facilities: FacilityItem[];
  private gallery: GalleryItem[];
  private ppdb: PPDBApplicant[];
  private infaqConfirmations: InfaqConfirmation[] = [];
  private appsScriptUrl: string;

  constructor() {
    // Load from localStorage or initialize with initialData
    const loadedSettings = this.load<SchoolSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    // Ensure all new fields exist if loaded from older structure
    this.settings = {
      ...INITIAL_SETTINGS,
      ...loadedSettings,
      heroAlumniStat: loadedSettings?.heroAlumniStat !== undefined ? loadedSettings.heroAlumniStat : INITIAL_SETTINGS.heroAlumniStat,
      heroCardBadge: loadedSettings?.heroCardBadge || INITIAL_SETTINGS.heroCardBadge,
      heroCardRating: loadedSettings?.heroCardRating || INITIAL_SETTINGS.heroCardRating,
      heroCardStatNumber: loadedSettings?.heroCardStatNumber || INITIAL_SETTINGS.heroCardStatNumber,
      heroCardStatLabel: loadedSettings?.heroCardStatLabel || INITIAL_SETTINGS.heroCardStatLabel,
      heroCardDescription: loadedSettings?.heroCardDescription || INITIAL_SETTINGS.heroCardDescription,
      heroCardCurriculumTitle: loadedSettings?.heroCardCurriculumTitle || INITIAL_SETTINGS.heroCardCurriculumTitle,
      heroCardCurriculumSubtitle: loadedSettings?.heroCardCurriculumSubtitle || INITIAL_SETTINGS.heroCardCurriculumSubtitle,
      heroCardButtonText: loadedSettings?.heroCardButtonText || INITIAL_SETTINGS.heroCardButtonText,
      qrisImageUrl: loadedSettings?.qrisImageUrl || '',
      featuredPrograms: loadedSettings?.featuredPrograms?.length ? loadedSettings.featuredPrograms : INITIAL_SETTINGS.featuredPrograms,
      extracurriculars: loadedSettings?.extracurriculars?.length ? loadedSettings.extracurriculars : INITIAL_SETTINGS.extracurriculars,
      achievements: loadedSettings?.achievements?.length ? loadedSettings.achievements : INITIAL_SETTINGS.achievements,
      missions: loadedSettings?.missions?.length ? loadedSettings.missions : INITIAL_SETTINGS.missions
    };
    this.announcements = this.load(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    this.news = this.load(STORAGE_KEYS.NEWS, INITIAL_NEWS);
    this.events = this.load(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    this.teachers = this.load(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
    this.facilities = this.load(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
    this.gallery = this.load(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    this.ppdb = this.load(STORAGE_KEYS.PPDB, INITIAL_PPDB);
    this.infaqConfirmations = this.load(STORAGE_KEYS.INFAQ, []);
    const savedUrl = localStorage.getItem(STORAGE_KEYS.APPS_SCRIPT_URL);
    this.appsScriptUrl = (savedUrl && savedUrl.trim() !== '') ? savedUrl.trim() : GOOGLE_CONFIG.APPS_SCRIPT_DEFAULT_URL;
    if (!savedUrl && this.appsScriptUrl) {
      try {
        localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT_URL, this.appsScriptUrl);
      } catch {
        // ignore
      }
    }

    // Cross-tab real-time synchronization
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
          this.reloadFromStorage();
          this.notify();
        }
      });
    }
  }

  public reloadFromStorage(): void {
    const loadedSettings = this.load<SchoolSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    this.settings = { ...INITIAL_SETTINGS, ...loadedSettings };
    this.announcements = this.load(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    this.news = this.load(STORAGE_KEYS.NEWS, INITIAL_NEWS);
    this.events = this.load(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    this.teachers = this.load(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
    this.facilities = this.load(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
    this.infaqConfirmations = this.load(STORAGE_KEYS.INFAQ, []);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private save(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Subscriber error:', err);
      }
    });
  }

  // --- GETTERS ---
  public getSettings(): SchoolSettings {
    return { ...this.settings };
  }

  public getAnnouncements(): Announcement[] {
    return [...this.announcements];
  }

  public getNews(): NewsItem[] {
    return [...this.news];
  }

  public getEvents(): EventItem[] {
    return [...this.events];
  }

  public getTeachers(): TeacherItem[] {
    return [...this.teachers];
  }

  public getFacilities(): FacilityItem[] {
    return [...this.facilities];
  }

  public getGallery(): GalleryItem[] {
    return [...this.gallery];
  }

  public getPPDB(): PPDBApplicant[] {
    return [...this.ppdb];
  }

  public getInfaqConfirmations(): InfaqConfirmation[] {
    return [...this.infaqConfirmations];
  }

  public getAppsScriptUrl(): string {
    return this.appsScriptUrl;
  }

  public getState() {
    return {
      settings: this.getSettings(),
      announcements: this.getAnnouncements(),
      news: this.getNews(),
      events: this.getEvents(),
      teachers: this.getTeachers(),
      facilities: this.getFacilities(),
      gallery: this.getGallery(),
      students: this.getPPDB(),
      infaqRecords: this.getInfaqConfirmations()
    };
  }

  // --- SETTERS & CRUD ---
  public updateSettings(newSettings: SchoolSettings): void {
    this.settings = newSettings;
    this.save(STORAGE_KEYS.SETTINGS, this.settings);
  }

  public setAppsScriptUrl(url: string): void {
    this.appsScriptUrl = url.trim();
    localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT_URL, this.appsScriptUrl);
    this.notify();
  }

  // Announcements
  public addAnnouncement(item: Omit<Announcement, 'id'>): Announcement {
    const newItem: Announcement = {
      ...item,
      id: 'ann-' + Date.now()
    };
    this.announcements.unshift(newItem);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
    return newItem;
  }

  public updateAnnouncement(id: string, updated: Partial<Announcement>): void {
    this.announcements = this.announcements.map(a => a.id === id ? { ...a, ...updated } : a);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
  }

  public toggleAnnouncement(id: string, isActive: boolean): void {
    this.updateAnnouncement(id, { isActive });
  }

  public deleteAnnouncement(id: string): void {
    this.announcements = this.announcements.filter(a => a.id !== id);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
  }

  // News
  public addNews(item: Omit<NewsItem, 'id'>): NewsItem {
    const newItem: NewsItem = {
      ...item,
      id: 'news-' + Date.now()
    };
    this.news.unshift(newItem);
    this.save(STORAGE_KEYS.NEWS, this.news);
    return newItem;
  }

  public updateNews(id: string, updated: Partial<NewsItem>): void {
    this.news = this.news.map(n => n.id === id ? { ...n, ...updated } : n);
    this.save(STORAGE_KEYS.NEWS, this.news);
  }

  public deleteNews(id: string): void {
    this.news = this.news.filter(n => n.id !== id);
    this.save(STORAGE_KEYS.NEWS, this.news);
  }

  // Events
  public addEvent(item: Omit<EventItem, 'id'>): EventItem {
    const newItem: EventItem = {
      ...item,
      id: 'event-' + Date.now()
    };
    this.events.push(newItem);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    return newItem;
  }

  public updateEvent(id: string, updated: Partial<EventItem>): void {
    this.events = this.events.map(e => e.id === id ? { ...e, ...updated } : e);
    this.save(STORAGE_KEYS.EVENTS, this.events);
  }

  public deleteEvent(id: string): void {
    this.events = this.events.filter(e => e.id !== id);
    this.save(STORAGE_KEYS.EVENTS, this.events);
  }

  // Teachers
  public addTeacher(item: Omit<TeacherItem, 'id'>): TeacherItem {
    const newItem: TeacherItem = {
      ...item,
      id: 'tc-' + Date.now()
    };
    this.teachers.push(newItem);
    this.save(STORAGE_KEYS.TEACHERS, this.teachers);
    return newItem;
  }

  public updateTeacher(id: string, updated: Partial<TeacherItem>): void {
    this.teachers = this.teachers.map(t => t.id === id ? { ...t, ...updated } : t);
    this.save(STORAGE_KEYS.TEACHERS, this.teachers);
  }

  public deleteTeacher(id: string): void {
    this.teachers = this.teachers.filter(t => t.id !== id);
    this.save(STORAGE_KEYS.TEACHERS, this.teachers);
  }

  // Gallery
  public addGallery(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now()
    };
    this.gallery.unshift(newItem);
    this.save(STORAGE_KEYS.GALLERY, this.gallery);
    return newItem;
  }

  public deleteGallery(id: string): void {
    this.gallery = this.gallery.filter(g => g.id !== id);
    this.save(STORAGE_KEYS.GALLERY, this.gallery);
  }

  // Facilities
  public addFacility(item: Omit<FacilityItem, 'id'>): FacilityItem {
    const newItem: FacilityItem = {
      ...item,
      id: 'fac-' + Date.now()
    };
    this.facilities.push(newItem);
    this.save(STORAGE_KEYS.FACILITIES, this.facilities);
    return newItem;
  }

  public updateFacility(id: string, updated: Partial<FacilityItem>): void {
    this.facilities = this.facilities.map(f => f.id === id ? { ...f, ...updated } : f);
    this.save(STORAGE_KEYS.FACILITIES, this.facilities);
  }

  public deleteFacility(id: string): void {
    this.facilities = this.facilities.filter(f => f.id !== id);
    this.save(STORAGE_KEYS.FACILITIES, this.facilities);
  }

  // Infaq CRUD
  public deleteInfaq(id: string): void {
    this.infaqConfirmations = this.infaqConfirmations.filter(f => f.id !== id);
    this.save(STORAGE_KEYS.INFAQ, this.infaqConfirmations);
  }

  // Admin Security
  public verifyAdminPassword(inputUsername: string, inputPassword: string): boolean {
    const savedPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
    const validPasswords = ['spmb2628qu', 'admin123', 'alitisham2025'];
    if (savedPassword) {
      validPasswords.push(savedPassword);
    }
    return (
      inputUsername.trim().toLowerCase() === 'admin' &&
      (validPasswords.includes(inputPassword) || inputPassword === 'spmb2628qu')
    );
  }

  public updateAdminPassword(newPassword: string): void {
    if (newPassword && newPassword.trim().length >= 5) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword.trim());
    }
  }

  // Backup and Restore Database
  public exportDatabaseJSON(): string {
    return JSON.stringify(this.getState(), null, 2);
  }

  public importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) {
        this.settings = { ...this.settings, ...parsed.settings };
        this.save(STORAGE_KEYS.SETTINGS, this.settings);
      }
      if (Array.isArray(parsed.announcements)) {
        this.announcements = parsed.announcements;
        this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
      }
      if (Array.isArray(parsed.news)) {
        this.news = parsed.news;
        this.save(STORAGE_KEYS.NEWS, this.news);
      }
      if (Array.isArray(parsed.events)) {
        this.events = parsed.events;
        this.save(STORAGE_KEYS.EVENTS, this.events);
      }
      if (Array.isArray(parsed.teachers)) {
        this.teachers = parsed.teachers;
        this.save(STORAGE_KEYS.TEACHERS, this.teachers);
      }
      if (Array.isArray(parsed.facilities)) {
        this.facilities = parsed.facilities;
        this.save(STORAGE_KEYS.FACILITIES, this.facilities);
      }
      if (Array.isArray(parsed.infaqRecords)) {
        this.infaqConfirmations = parsed.infaqRecords;
        this.save(STORAGE_KEYS.INFAQ, this.infaqConfirmations);
      }
      this.notify();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  public resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.FACILITIES);
    localStorage.removeItem(STORAGE_KEYS.INFAQ);
    this.settings = { ...INITIAL_SETTINGS };
    this.announcements = [...INITIAL_ANNOUNCEMENTS];
    this.news = [...INITIAL_NEWS];
    this.events = [...INITIAL_EVENTS];
    this.teachers = [...INITIAL_TEACHERS];
    this.facilities = [...INITIAL_FACILITIES];
    this.infaqConfirmations = [];
    this.notify();
  }

  // --- PPDB REGISTRATION ---
  public async submitPPDB(applicant: Omit<PPDBApplicant, 'id' | 'registrationNumber' | 'registrationDate' | 'status'>, fileData?: { base64: string; name: string; type: string }): Promise<{ success: boolean; applicant: PPDBApplicant; message: string }> {
    const nextSeq = this.ppdb.length + 1;
    const regNum = `SDQU-2025-${String(nextSeq).padStart(3, '0')}`;
    const newApplicant: PPDBApplicant = {
      ...applicant,
      id: 'ppdb-' + Date.now(),
      registrationNumber: regNum,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Menunggu'
    };

    let driveLink = '';

    // If Google Apps Script Web App is connected, push to Google Spreadsheet and Google Drive!
    if (this.appsScriptUrl) {
      try {
        const payload: Record<string, unknown> = {
          action: 'save_ppdb',
          data: newApplicant
        };
        if (fileData) {
          payload.fileData = fileData.base64;
          payload.fileName = `${regNum}_${fileData.name}`;
          payload.fileMime = fileData.type;
        }

        // Call Google Apps Script endpoint via POST
        await fetch(this.appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          mode: 'no-cors' // Google Apps Script Web Apps redirect requirement
        });

        driveLink = `https://drive.google.com/drive/folders/${GOOGLE_CONFIG.DRIVE_FOLDER_ID}`;
        newApplicant.documentDriveUrl = driveLink;
      } catch (err) {
        console.warn('Apps Script push failed, saving locally:', err);
      }
    }

    this.ppdb.unshift(newApplicant);
    this.save(STORAGE_KEYS.PPDB, this.ppdb);

    return {
      success: true,
      applicant: newApplicant,
      message: `Pendaftaran berhasil tercatat dengan Nomor Registrasi: ${regNum}. Data tersimpan ke database.`
    };
  }

  public updatePPDBStatus(id: string, status: PPDBApplicant['status'], notes?: string): void {
    this.ppdb = this.ppdb.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          notes: notes !== undefined ? notes : p.notes
        };
      }
      return p;
    });
    this.save(STORAGE_KEYS.PPDB, this.ppdb);
  }

  public updateStudentStatus(id: string, status: any, notes?: string): void {
    this.updatePPDBStatus(id, status, notes);
  }

  public deletePPDB(id: string): void {
    this.ppdb = this.ppdb.filter(p => p.id !== id);
    this.save(STORAGE_KEYS.PPDB, this.ppdb);
  }

  // --- INFAQ CONFIRMATION ---
  public async submitInfaq(confirmation: Omit<InfaqConfirmation, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
    const newRecord: InfaqConfirmation = {
      ...confirmation,
      id: 'infaq-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    if (this.appsScriptUrl) {
      try {
        await fetch(this.appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'save_infaq', data: newRecord }),
          mode: 'no-cors'
        });
      } catch (e) {
        console.warn('Apps script infaq push failed:', e);
      }
    }

    this.infaqConfirmations.unshift(newRecord);
    this.save(STORAGE_KEYS.INFAQ, this.infaqConfirmations);

    return {
      success: true,
      message: 'Jazakumullah khairan. Konfirmasi infaq & donasi Anda telah berhasil kami catat.'
    };
  }

  // --- SYNC FROM GOOGLE APPS SCRIPT / SPREADSHEET ---
  public async syncFromGoogle(): Promise<{ success: boolean; message: string; count?: number }> {
    const url = this.getAppsScriptUrl();
    if (!url) {
      return { success: false, message: 'URL Google Apps Script belum dikonfigurasi.' };
    }
    try {
      const response = await fetch(`${url}?action=getAll`);
      const json = await response.json();
      if (json && json.success && json.data) {
        let count = 0;
        if (json.data.PPDB && Array.isArray(json.data.PPDB) && json.data.PPDB.length > 0) {
          const validPpdb = json.data.PPDB.filter((p: any) => p.registrationNumber || p.studentName);
          if (validPpdb.length > 0) {
            this.ppdb = validPpdb;
            this.save(STORAGE_KEYS.PPDB, this.ppdb);
            count += validPpdb.length;
          }
        }
        if (json.data.Infaq && Array.isArray(json.data.Infaq) && json.data.Infaq.length > 0) {
          const validInfaq = json.data.Infaq.filter((i: any) => i.id || i.donorName);
          if (validInfaq.length > 0) {
            this.infaqConfirmations = validInfaq;
            this.save(STORAGE_KEYS.INFAQ, this.infaqConfirmations);
            count += validInfaq.length;
          }
        }
        return {
          success: true,
          message: `Berhasil sinkronisasi dengan Google Spreadsheet! (${count} baris data berhasil dimuat)`,
          count
        };
      }
      return { success: false, message: json?.error || 'Tidak ada data di Google Spreadsheet.' };
    } catch (err: any) {
      return {
        success: false,
        message: 'Gagal sinkronisasi: ' + (err.message || 'Periksa koneksi atau izin Web App (Anyone)')
      };
    }
  }

  // --- CSV EXPORT FOR PPDB ---
  public exportPPDBToCSV(): string {
    const headers = [
      'No Registrasi',
      'Nama Santri',
      'Panggilan',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Jalur',
      'Nama Orang Tua/Wali',
      'No WhatsApp',
      'Email',
      'Alamat',
      'Asal Sekolah/TK',
      'Hafalan Quran',
      'Status Pendaftaran',
      'Tanggal Daftar',
      'Link Berkas Drive',
      'Catatan Panitia'
    ];

    const rows = this.ppdb.map(p => [
      `"${p.registrationNumber}"`,
      `"${p.studentName.replace(/"/g, '""')}"`,
      `"${p.nickname.replace(/"/g, '""')}"`,
      `"${p.gender}"`,
      `"${p.birthPlace}"`,
      `"${p.birthDate}"`,
      `"${p.track}"`,
      `"${p.parentName.replace(/"/g, '""')}"`,
      `"${p.parentPhone}"`,
      `"${p.parentEmail || ''}"`,
      `"${(p.address || '').replace(/"/g, '""')}"`,
      `"${(p.previousSchool || '').replace(/"/g, '""')}"`,
      `"${(p.quranMemorization || '').replace(/"/g, '""')}"`,
      `"${p.status}"`,
      `"${p.registrationDate}"`,
      `"${p.documentDriveUrl || ''}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  }

  // Reset to original Stitch defaults
  public resetToStitchDefaults(): void {
    this.settings = { ...INITIAL_SETTINGS };
    this.announcements = [...INITIAL_ANNOUNCEMENTS];
    this.news = [...INITIAL_NEWS];
    this.events = [...INITIAL_EVENTS];
    this.teachers = [...INITIAL_TEACHERS];
    this.facilities = [...INITIAL_FACILITIES];
    this.gallery = [...INITIAL_GALLERY];
    this.ppdb = [...INITIAL_PPDB];
    this.infaqConfirmations = [];

    this.save(STORAGE_KEYS.SETTINGS, this.settings);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
    this.save(STORAGE_KEYS.NEWS, this.news);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    this.save(STORAGE_KEYS.TEACHERS, this.teachers);
    this.save(STORAGE_KEYS.FACILITIES, this.facilities);
    this.save(STORAGE_KEYS.GALLERY, this.gallery);
    this.save(STORAGE_KEYS.PPDB, this.ppdb);
    this.save(STORAGE_KEYS.INFAQ, this.infaqConfirmations);
  }
}

export const dataService = new DataService();
