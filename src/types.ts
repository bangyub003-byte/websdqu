export interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  isImportant?: boolean;
  isActive: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime?: string;
}

export interface EventItem {
  id: string;
  title: string;
  month: string;
  dateRange: string;
  location: string;
  category: string;
  description: string;
  iconName?: string;
}

export interface TeacherItem {
  id: string;
  name: string;
  role: string;
  education: string;
  specialty: string;
  imageUrl: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'ibadah' | 'kelas' | 'perpustakaan' | 'olahraga' | 'kesehatan' | 'semua';
  categoryLabel: string;
  capacity?: string;
  specs: string[];
  description: string;
  imageUrl: string;
}

export interface PPDBApplicant {
  id: string;
  registrationNumber: string;
  studentName: string;
  nickname: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  track: 'Reguler' | 'Beasiswa Tahfidz Prestasi';
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  previousSchool?: string;
  quranMemorization?: string;
  status: 'Menunggu' | 'Observasi' | 'Diterima' | 'Cadangan' | 'Ditolak';
  registrationDate: string;
  documentDriveUrl?: string;
  notes?: string;
}

export interface InfaqConfirmation {
  id: string;
  donorName: string;
  phone: string;
  program: string;
  amount: number;
  bankDestination: string;
  transferDate: string;
  prayerNotes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export type StudentRegistration = PPDBApplicant;
export type InfaqRecord = InfaqConfirmation;

export interface SchoolState {
  settings: SchoolSettings;
  announcements: Announcement[];
  news: NewsItem[];
  events: EventItem[];
  teachers: TeacherItem[];
  facilities: FacilityItem[];
  gallery: GalleryItem[];
  students: PPDBApplicant[];
  infaqRecords: InfaqConfirmation[];
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  desc: string;
}

export interface AchievementItem {
  id: string;
  category: 'ASPD' | 'MTQ' | 'O2SN' | 'FLS2N' | 'Lainnya';
  year: string;
  kapanewon?: string;
  kabupaten?: string;
  description: string;
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  subTagline: string;
  logoUrl?: string;
  heroImageUrl?: string;
  profileBannerImageUrl?: string;
  npsn: string;
  accreditation: string;
  foundation: string;
  skAkreditasi: string;
  address: string;
  email: string;
  phoneTu: string;
  phoneSpmb: string;
  whatsappSpmb: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroVideoUrl?: string;
  vision: string;
  missions: string[];
  shortProfile: string;
  historyPart1: string;
  historyPart2: string;
  historyPart3: string;
  featuredPrograms: string[];
  extracurriculars: ExtracurricularItem[];
  achievements: AchievementItem[];
  psbIframeUrl: string;
  hoursWeekday: string;
  hoursFriday: string;
  hoursWeekend: string;
  heroAlumniStat?: string;
  heroCardBadge?: string;
  heroCardRating?: string;
  heroCardStatNumber?: string;
  heroCardStatLabel?: string;
  heroCardDescription?: string;
  heroCardCurriculumTitle?: string;
  heroCardCurriculumSubtitle?: string;
  heroCardButtonText?: string;
  bankBsi: {
    bankName: string;
    accountNumber: string;
    holderName: string;
    branch: string;
  };
  bankBpd: {
    bankName: string;
    accountNumber: string;
    holderName: string;
    branch: string;
  };
  qrisId: string;
  qrisImageUrl?: string;
}

export type ActivePage = 'beranda' | 'profil' | 'kegiatan' | 'fasilitas' | 'infaq' | 'spmb' | 'admin';
