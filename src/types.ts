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

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountNumber: string;
  holderName: string;
  branch?: string;
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
  category?: string;
  imageUrl?: string;
  schedule?: string;
  coach?: string;
}

export interface AchievementItem {
  id: string;
  category: 'ASPD' | 'MTQ' | 'O2SN' | 'FLS2N' | 'Lainnya';
  year: string;
  kapanewon?: string;
  kabupaten?: string;
  description: string;
  imageUrl?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarColor?: string;
  content?: string;
  quote?: string;
  studentInfo?: string;
  rating?: number;
  imageUrl?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  desc?: string;
  timeOrFrequency?: string;
  time?: string;
  day?: string;
  schedule?: string;
  badge?: string;
  imageUrl?: string;
  type?: 'harian' | 'berkala';
}

export interface SPMBStepItem {
  id?: string;
  step?: number;
  stepNumber?: number;
  title: string;
  description: string;
  dateOrPeriod?: string;
  icon?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface InfaqProgramItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  highlight: string;
  iconType?: string;
}

export interface EcoFeatureItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface CoreValueItem {
  id: string;
  title: string;
  arabic?: string;
  description?: string;
  desc?: string;
}

export interface LegalitasItem {
  id: string;
  badge?: string;
  title: string;
  description?: string;
  nomor?: string;
  instansi?: string;
  tanggal?: string;
  codeOrSk?: string;
  themeColor?: 'emerald' | 'amber' | 'teal';
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  subTagline: string;
  logoUrl?: string;
  heroImageUrl?: string;
  heroImages?: string[];
  profileBannerImageUrl?: string;
  runningText?: string;
  runningTextEnabled?: boolean;
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
  bankAccounts?: BankAccountItem[];
  bankBsi?: {
    bankName: string;
    accountNumber: string;
    holderName: string;
    branch: string;
  };
  bankBpd?: {
    bankName: string;
    accountNumber: string;
    holderName: string;
    branch: string;
  };
  qrisId: string;
  qrisImageUrl?: string;
  // Beranda custom fields
  heroSecondaryBtnText?: string;
  heroSecondaryBtnModalTitle?: string;
  heroSecondaryBtnModalDesc?: string;
  heroStatsRibbon?: {
    stat1Val: string;
    stat1Label: string;
    stat2Val: string;
    stat2Label: string;
    stat3Val: string;
    stat3Label: string;
    stat4Val: string;
    stat4Label: string;
  };
  berandaFeaturesTitle?: string;
  berandaFeaturesSubtitle?: string;
  berandaFeatures?: {
    id: string;
    title: string;
    description: string;
  }[];
  // Mengapa Memilih Kami (Why Choose Us)
  whyChooseUsImageUrl?: string;
  whyChooseUsImageBadge?: string;
  berandaWhyUsImageUrl?: string;
  berandaWhyUsImageBadge?: string;
  berandaWhyUsTagline?: string;
  berandaWhyUsTitle?: string;
  berandaWhyUsDesc?: string;
  berandaWhyUsItems?: Array<{ title: string; desc: string; badge?: string }>;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: TestimonialItem[];
  ctaBannerBadge?: string;
  ctaBannerTitle?: string;
  ctaBannerDesc?: string;
  ctaBannerBtnText?: string;

  // Profil custom fields
  profilHeadmasterName?: string;
  profilHeadmasterRole?: string;
  profilHeadmasterQuote?: string;
  profilHeadmasterPhotoUrl?: string;
  profilHeadmasterSpeech?: string;
  profilAchievementsTitle?: string;
  profilAchievementsSubtitle?: string;
  profilCoreValuesTitle?: string;
  profilCoreValuesSubtitle?: string;
  profilCoreValues?: CoreValueItem[];
  profilLegalitas?: LegalitasItem[];
  teachersSectionTitle?: string;
  teachersSectionSubtitle?: string;

  // Kegiatan custom fields
  kegiatanBadge?: string;
  kegiatanTitle?: string;
  kegiatanSubtitle?: string;
  kegiatanStat1Val?: string;
  kegiatanStat1Label?: string;
  kegiatanStat2Val?: string;
  kegiatanStat2Label?: string;
  kegiatanStatsRibbon?: {
    stat1Val: string;
    stat1Label: string;
    stat2Val: string;
    stat2Label: string;
    stat3Val: string;
    stat3Label: string;
    stat4Val: string;
    stat4Label: string;
  };
  dailyActivitiesTitle?: string;
  dailyActivitiesSubtitle?: string;
  dailyActivities?: ActivityItem[];
  periodicProgramsTitle?: string;
  periodicProgramsSubtitle?: string;
  periodicPrograms?: ActivityItem[];

  // Fasilitas custom fields
  fasilitasBadge?: string;
  fasilitasTitle?: string;
  fasilitasSubtitle?: string;
  fasilitasHeaderTagline?: string;
  fasilitasHeaderTitle?: string;
  fasilitasHeaderDesc?: string;
  fasilitasStat1Val?: string;
  fasilitasStat1Label?: string;
  fasilitasStat1Sub?: string;
  fasilitasStat2Val?: string;
  fasilitasStat2Label?: string;
  fasilitasStat2Sub?: string;
  fasilitasEcoBadge?: string;
  fasilitasEcoTitle?: string;
  fasilitasEcoSubtitle?: string;
  fasilitasEcoDesc?: string;
  fasilitasEcoFeatures?: Array<{ id: string; title: string; description: string; iconName?: string }>;
  fasilitasEcoItems?: EcoFeatureItem[];

  // 3 Kategori Pengantar Fasilitas
  facilityCat1Title?: string;
  facilityCat1Desc?: string;
  facilityCat1Image?: string;
  facilityCat2Title?: string;
  facilityCat2Desc?: string;
  facilityCat2Image?: string;
  facilityCat3Title?: string;
  facilityCat3Desc?: string;
  facilityCat3Image?: string;

  // Infaq custom fields
  infaqBadge?: string;
  infaqTitle?: string;
  infaqSubtitle?: string;
  infaqTrustBadges?: string[];
  infaqPrograms?: InfaqProgramItem[];

  // SPMB custom fields
  spmbBadge?: string;
  spmbTitle?: string;
  spmbSubtitle?: string;
  spmbStatusPill?: string;
  spmbStepsTitle?: string;
  spmbStepsSubtitle?: string;
  spmbSteps?: SPMBStepItem[];
  spmbDocsTitle?: string;
  spmbDocsSubtitle?: string;
  spmbDocsList?: string[];
  spmbFaqTitle?: string;
  spmbFaqSubtitle?: string;
  spmbFaqs?: FAQItem[];
}

export type ActivePage = 'beranda' | 'profil' | 'kegiatan' | 'fasilitas' | 'infaq' | 'spmb' | 'admin';
