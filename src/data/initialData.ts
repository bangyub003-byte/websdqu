import {
  Announcement,
  EventItem,
  FacilityItem,
  GalleryItem,
  NewsItem,
  PPDBApplicant,
  SchoolSettings,
  TeacherItem
} from '../types';

export const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: "SD Quran Unggulan Al-Itisham Playen",
  tagline: "Terwujudnya Generasi Qur’ani, Cerdas, dan Mulia",
  subTagline: "Sekolah khusus di bidang pendidikan Agama Islam dan pembentukan karakter islami usia Sekolah Dasar di dusun Banaran, Playen, Gunungkidul. Memadukan tahfidz Al-Qur'an, kurikulum terpadu, dan program 4 bahasa.",
  logoUrl: "",
  heroImageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80",
  heroImages: [
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80"
  ],
  profileBannerImageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80",
  runningText: "Penerimaan Santri Baru (PSB) Tahun Ajaran 2025/2026 Telah Dibuka! Segera amankan kuota ananda di SD Quran Unggulan Al-I'tisham Playen • Info Layanan & Konsultasi SPMB: 0878-9012-3456 • Membina Generasi Qur'ani, Cerdas, dan Berakhlak Mulia.",
  runningTextEnabled: true,
  npsn: "69985270",
  accreditation: "BAN-PDM Terakreditasi",
  skAkreditasi: "Sertifikat Akreditasi BAN-PDM 2023",
  foundation: "Pondok Pesantren Al I'tishom (Kemenkumham AHU-001271.AH.01.12)",
  address: "Dusun Banaran, 010/003, Playen, Playen, Gunungkidul, DI Yogyakarta",
  email: "info@sdqu-alitisham.sch.id",
  phoneTu: "+62 812-3456-7890",
  phoneSpmb: "+62 878-9012-3456",
  whatsappSpmb: "6287890123456",
  heroBadge: "PENERIMAAN SANTRI BARU (PSB) DIBUKA",
  heroHeadline: "Mencetak Generasi Qur’ani, Cerdas, dan Mulia",
  heroSubtitle: "SD Quran Unggulan Al-Itisham Playen membina generasi dengan pendidikan akhlak agama Islam, tahfidzul Qur'an, kurikulum terpadu, guru berpengalaman, dan lingkungan belajar kondusif di Banaran, Playen.",
  vision: "“Terwujudnya Generasi Qur’ani, Cerdas, dan Mulia”",
  missions: [
    "Melaksanakan pembelajaran yang berbasis pada nilai – nilai Al Quran.",
    "Melaksanakan pembelajaran dan pembimbingan PAIKEM (Pembelajaran Aktif, Inovatif, Kreatif, Efektif, dan Menyenangkan)",
    "Menyiapkan fasilitas yang memadai, guru yang berkompeten serta membangun budaya literasi",
    "Menanamkan akhlak mulia melalui pembiasaan sehari-hari"
  ],
  shortProfile: "SD Quran Unggulan Al-Itisham Playen merupakan jenis sekolahan khusus di bidang pendidikan Agama Islam, dan pembiasaan pembentukan karakter islami usia Sekolah Dasar. Kekhususan atau ciri khas sekolah Islam ini menjadikan daya tarik tersendiri bagi masyarakat luar kapanewon sehingga peserta didik kebanyakan berdomisili jauh dari sekolah. Sekolah ini berdomisili di dusun Banaran, 010/003, Playen, Playen, Gunungkidul, DI Yogyakarta.",
  historyPart1: "SD Quran Unggulan Al-Itisham Playen awal berdiri bernama PPS Ula Al I’tishom sebagai lembaga pendidikan kesetaraan Pondok Pesantren Salafiyah Ula (setingkat SD) yang merupakan Program dari Kementerian Agama. Didirikan pada tahun 2009 yang merupakan salah satu amal usaha dari Pondok Pesantren Al I’tishom. Pendirian PPS Ula Al I’tishom dilatarbelakangi rasa keprihatinan terhadap pergaulan hidup anak-anak yang semakin jauh dari nilai-nilai dan norma agama, oleh karena itu dengan dorongan berbagai pihak khususnya masyarakat yang mengkhawatirkan agama putra-putrinya, mendorong pondok pesantren al I’tishom untuk menyelenggarakan pendidikan dasar untuk membekali dan membentengi putra-putrinya sejak dini dengan ilmu agama dan pembiasan ibadah serta akhlaq islami.",
  historyPart2: "Kemudian karena pandangan warga masyarakat Gunungkidul yang masih khawatir bila anaknya disekolahkan di lembaga pendidikan kesetaraan karena dianggap sama dengan kejar paket, maka PPS Ula Al I’tishom pada tahun 2022 menyesuaikan diri dan bermigrasi menjadi SD Quran Unggulan Al-Itisham Playen yang disusul dengan diberikanya Ijin Operasional oleh Dinas Pendidikan Kabupaten Gunungkidul di tahun yang sama.",
  historyPart3: "Pada tahun 2023 keberadaan SD Quran Unggulan Al-Itisham semakin kuat dengan diberikanya Sertifikat Akreditasi oleh Badan Akreditasi Nasional Pendidikan Anak Usia Dini, Pendidikan Dasar dan Pendidikan Menengah (BAN-PDM).",
  featuredPrograms: [
    "Berfokus pada Pendidikan Akhlak Agama Islam",
    "Program Tahfidzul Qur’an dan Pembiasaan Ibadah",
    "Pendidikan karakter islami bersama guru yang berpengalaman",
    "Biaya pendidikan terjangkau",
    "Lingkungan dan suasana belajar yang mendukung dan jauh dari keramaian",
    "Kurikulum pendidikan yang terpadu",
    "Terdapat program 4 bahasa : Bahasa Indonesia, Bahasa Jawa, Bahasa Arab dan Bahasa Inggris"
  ],
  extracurriculars: [
    {
      id: "ekskul-1",
      name: "BTA (Baca Tulis Al-Qur’an)",
      desc: "Bimbingan intensif membaca dan menulis Al-Qur'an secara tartil, penguasaan makharijul huruf, dan kaidah tajwid dasar."
    },
    {
      id: "ekskul-2",
      name: "Pencak Silat",
      desc: "Seni bela diri Islami untuk melatih ketangkasan fisik, disiplin mental, keberanian, dan sportivitas santri."
    },
    {
      id: "ekskul-3",
      name: "Panahan",
      desc: "Olahraga sunnah Rasulullah SAW yang mengasah fokus, kestabilan emosi, konsentrasi tinggi, dan ketenangan jiwa."
    },
    {
      id: "ekskul-4",
      name: "Pramuka dan Kegiatan Lingkungan",
      desc: "Kepanduan, cinta alam lingkungan hidup, keterampilan tali-temali, kemandirian, dan kepedulian sosial."
    },
    {
      id: "ekskul-5",
      name: "Pendalaman Materi",
      desc: "Bimbingan intensif penguatan akademik, pemahaman konsep mata pelajaran, dan persiapan evaluasi belajar."
    }
  ],
  achievements: [
    {
      id: "ach-1",
      category: "ASPD",
      year: "2024",
      kabupaten: "Gunungkidul : 293",
      description: "Capaian Asesmen Standarisasi Pendidikan Daerah (ASPD) Tingkat Kabupaten Gunungkidul."
    },
    {
      id: "ach-2",
      category: "ASPD",
      year: "2025",
      kapanewon: "Playen : 25/49",
      kabupaten: "Gunungkidul : 250",
      description: "Peringkat ASPD Kapanewon Playen posisi 25 dari 49 sekolah dan capaian Kabupaten Gunungkidul 250."
    },
    {
      id: "ach-3",
      category: "MTQ",
      year: "2022",
      kapanewon: "Juara 1 : 1",
      kabupaten: "MHQ : 1",
      description: "Juara 1 Tingkat Kapanewon dan MHQ Tingkat Kabupaten."
    },
    {
      id: "ach-4",
      category: "MTQ",
      year: "2023",
      kapanewon: "Juara 1 : 2, Juara 2 : 3, Juara 3 : 2",
      kabupaten: "MHQ : 2, MTtQ : 1",
      description: "Panen Juara MTQ Kapanewon (2 Juara 1, 3 Juara 2, 2 Juara 3) serta Kabupaten (MHQ: 2, MTtQ: 1)."
    },
    {
      id: "ach-5",
      category: "MTQ",
      year: "2025",
      kapanewon: "Juara 1 : 1, Juara 2 : 4, Juara 3 : 1",
      kabupaten: "MTtQ : 2",
      description: "Prestasi MTQ Kapanewon (Juara 1: 1, Juara 2: 4, Juara 3: 1) dan Kabupaten (MTtQ: 2)."
    },
    {
      id: "ach-6",
      category: "O2SN",
      year: "2024",
      kapanewon: "Juara 1 : 1",
      kabupaten: "Bulu tangkis : 1",
      description: "Juara 1 Kapanewon dan Juara Bulu Tangkis Tingkat Kabupaten."
    },
    {
      id: "ach-7",
      category: "O2SN",
      year: "2025",
      kapanewon: "Juara 1 : 1, Juara 2 : 1, Juara 3 : 3",
      kabupaten: "Bulu tangkis : 1",
      description: "Juara 1, Juara 2, dan 3 Juara 3 Kapanewon serta Juara Bulu Tangkis Kabupaten."
    },
    {
      id: "ach-8",
      category: "FLS2N",
      year: "2025",
      kapanewon: "Kriya : Juara 3",
      description: "Prestasi Kriya Juara 3 Tingkat Kapanewon pada Festival & Lomba Seni Siswa Nasional."
    },
    {
      id: "ach-9",
      category: "FLS2N",
      year: "2026",
      kapanewon: "Kriya : Juara 2",
      description: "Prestasi Kriya Juara 2 Tingkat Kapanewon pada Festival & Lomba Seni Siswa Nasional."
    }
  ],
  psbIframeUrl: "https://psb-sdqu-alitisham.netlify.app",
  hoursWeekday: "07.15 - 15.30 WIB",
  hoursFriday: "07.15 - 11.30 WIB",
  hoursWeekend: "Sabtu & Ahad Libur",
  heroAlumniStat: "1.200+ Santri & Alumni Tersebar di berbagai jenjang unggulan DIY",
  heroCardBadge: "AKREDITASI A UNGGUL",
  heroCardRating: "4.9 / 5.0",
  heroCardStatNumber: "15+",
  heroCardStatLabel: "Tahun Pengabdian",
  heroCardDescription: "Membangun peradaban mulia dari Playen, menyemaikan tahfidz & hafizhah mutqin berintelektual sains modern sejak tahun 2010.",
  heroCardCurriculumTitle: "Kurikulum Terintegrasi",
  heroCardCurriculumSubtitle: "Kemendikbud • Kemenag • Pesantren",
  heroCardButtonText: "Kenali Lebih Dekat Sekolah Kami",
  bankAccounts: [
    {
      id: "bank-bsi",
      bankName: "Bank Syariah Indonesia (BSI)",
      accountNumber: "7211-9876-54",
      holderName: "YAYASAN AL I'TISHAM PLAYEN",
      branch: "Kantor Cabang Wonosari (Kode: 451)"
    },
    {
      id: "bank-bpd",
      bankName: "Bank BPD DIY Syariah",
      accountNumber: "801-211-009876",
      holderName: "SDQ UNGGULAN AL I'TISHAM",
      branch: "Capem Gunungkidul (Kode: 112)"
    }
  ],
  bankBsi: {
    bankName: "Bank Syariah Indonesia (BSI)",
    accountNumber: "7211-9876-54",
    holderName: "YAYASAN AL I'TISHAM PLAYEN",
    branch: "Kantor Cabang Wonosari (Kode: 451)"
  },
  bankBpd: {
    bankName: "Bank BPD DIY Syariah",
    accountNumber: "801-211-009876",
    holderName: "SDQ UNGGULAN AL I'TISHAM",
    branch: "Capem Gunungkidul (Kode: 112)"
  },
  qrisId: "NMID: ID1023249081721",
  heroSecondaryBtnText: "Kenali Selayang Pandang",
  heroSecondaryBtnModalTitle: "Selayang Pandang & Profil Singkat SDQU Al I'tisham",
  heroSecondaryBtnModalDesc: "Pendidikan dasar Islam terpadu yang menyemaikan generasi mutqin Al-Qur'an berakhlak mulia dan berwawasan luas di Dusun Banaran, Playen, Gunungkidul.",
  heroStatsRibbon: {
    stat1Val: "1.200+",
    stat1Label: "Santri Aktif & Alumni",
    stat2Val: "100%",
    stat2Label: "Target Tahfidz Mutqin",
    stat3Val: "45+",
    stat3Label: "Asatidz Bersanad",
    stat4Val: "25+",
    stat4Label: "Prestasi Tingkat DIY & Nas"
  },
  berandaFeaturesTitle: "Mengapa Memilih SDQU Al I'tisham Playen?",
  berandaFeaturesSubtitle: "Kombinasi kurikulum berkarakter islami, tahfidzul Qur'an mutqin, serta bimbingan penuh kasih sayang untuk tumbuh kembang ananda.",
  berandaFeatures: [
    {
      id: "feat-1",
      title: "Guru Tahfidz Bersanad & Berpengalaman",
      description: "Asatidz telah melalui sertifikasi talaqqi sanad Al-Qur'an dan pelatihan pedagogik anak usia sekolah dasar."
    },
    {
      id: "feat-2",
      title: "Mutaba'ah Digital Santri Terkoneksi Real–time",
      description: "Orang tua dapat memantau capaian hafalan harian, adab, kehadiran, dan kesehatan santri secara transparan via aplikasi wali."
    },
    {
      id: "feat-3",
      title: "Rasio Ideal 1:12 untuk Perhatian Optimal",
      description: "Setiap halaqah tahfidz dan kelas tematik memiliki kuota terbatas agar perkembangan akademis dan karakter terpantau intensif."
    },
    {
      id: "feat-4",
      title: "Lingkungan Ramah Anak, Nyaman & Sehat",
      description: "Terletak di kawasan Playen yang sejuk, jauh dari polusi bising kota, dengan fasilitas lapangan terbuka hijau dan masjid makmur."
    }
  ],
  testimonialsTitle: "Apa Kata Para Wali Santri SDQU Al I'tisham",
  testimonialsSubtitle: "Bukti nyata transformasi adab, kecintaan pada Al-Qur'an, dan prestasi akademik yang membanggakan keluarga.",
  testimonials: [
    {
      id: "test-1",
      name: "dr. Ahmad Wahyudi, Sp.A",
      role: "Wali Santri Alumni 2024 • Playen",
      avatar: "AW",
      avatarColor: "bg-emerald-700",
      content: "Alhamdulillah, anak kami tidak hanya hafal 4 juz dengan mutqin saat lulus, tapi yang paling membuat haru adalah kebiasaannya menjaga shalat tepat waktu dan adab bicaranya yang santun kepada kakek neneknya."
    },
    {
      id: "test-2",
      name: "Siti Nurjanah, S.Pd.",
      role: "Wali Santri Kelas 4 • Wonosari",
      avatar: "SN",
      avatarColor: "bg-amber-600",
      content: "Kekhawatiran kami tentang beban sekolah gugur seketika. Sistem pembelajaran di SDQU Al I'tisham sangat menyenangkan (joyful learning). Ananda selalu antusias bercerita tentang sains dan tilawah tiap pulang sekolah."
    },
    {
      id: "test-3",
      name: "Fajar Pratama, M.T.",
      role: "Wali Santri Kelas 2 • Paliyan",
      avatar: "FP",
      avatarColor: "bg-teal-700",
      content: "Komunikasi ustadz-ustadzah sangat terbuka. Mutaba'ah harian di aplikasi memudahkan kami memantau muroja'ah di rumah. Guru-gurunya sabar luar biasa dan benar-benar menanamkan cinta Qur'an tanpa paksaan."
    }
  ],
  ctaBannerBadge: "GELOMBANG 1 DITUTUP SEGERA",
  ctaBannerTitle: "Mari Bergabung Bersama Keluarga Besar SDQU Al I'tisham Playen",
  ctaBannerDesc: "Kuota penerimaan santri baru dibatasi demi menjaga rasio pembinaan halaqah yang optimal. Daftarkan putra-putri tercinta hari ini dan amankan kursi belajar mereka.",
  ctaBannerBtnText: "Daftar SPMB Online 2025/2026",

  // Profil
  profilHeadmasterName: "Ustadz H. Abdullah Mansur, S.Pd.I., M.Pd.",
  profilHeadmasterRole: "Kepala Sekolah SDQU Al I'tisham Playen",
  profilHeadmasterQuote: "Pendidikan sejati bukan sekadar mengisi bejana akal, melainkan menyalakan lentera tauhid dan adab dalam dada setiap santri.",
  profilHeadmasterPhotoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
  profilHeadmasterSpeech: "Bismillahirrohmanirrohim. Segala puji bagi Allah Rabb semesta alam. SD Qur'an Unggulan Al I'tisham berikhtiar melahirkan generasi yang akrab dengan Al-Qur'an sejak usia dini, berkarakter mulia, serta siap menatap era modern dengan keyakinan aqidah yang kokoh. Bersama para asatidz bersanad dan dukungan penuh para wali santri, kami terus berbenah menghadirkan iklim belajar yang aman, ramah anak, dan penuh berkah.",
  profilAchievementsTitle: "Capaian Prestasi Santri & Sekolah",
  profilAchievementsSubtitle: "Bukti nyata ikhtiar dan dedikasi santri bersama para asatidz di tingkat Kapanewon hingga Kabupaten.",
  profilCoreValuesTitle: "4 Nilai Pokok Pendidikan Kami",
  profilCoreValuesSubtitle: "Prinsip utama yang menjadi panduan dalam setiap nafas pembinaan di SDQU Al I'tisham Playen.",
  profilCoreValues: [
    {
      id: "val-1",
      title: "Ketauhidan & Aqidah Shahihah",
      arabic: "العقيدة الصحيحة",
      description: "Menanamkan kecintaan kepada Allah dan Rasul-Nya sebagai pondasi pertama sebelum ilmu dan keterampilan lainnya diajarkan."
    },
    {
      id: "val-2",
      title: "Adab Sebelum Ilmu",
      arabic: "الأدب قبل العلم",
      description: "Membiasakan akhlak santun, menghormati orang tua dan guru, serta menjaga tutur kata islami dalam kehidupan sehari-hari."
    },
    {
      id: "val-3",
      title: "Tahfidz Mutqin & Tartil",
      arabic: "الحفظ المتقن",
      description: "Bimbingan talaqqi bersanad dengan target hafalan yang kokoh dan kaidah tajwid yang benar tanpa membebani mental anak."
    },
    {
      id: "val-4",
      title: "Kemandirian & Akhlak Berdikari",
      arabic: "الاستقلالية",
      description: "Melatih santri disiplin mandiri merapikan perlengkapan, peduli kebersihan, dan tangguh menghadapi tantangan masa depan."
    }
  ],
  profilLegalitas: [
    {
      id: "leg-1",
      badge: "AKREDITASI BAN S/M",
      title: "Terakreditasi BAN-PDM Terakreditasi",
      description: "Memenuhi seluruh standar nasional pendidikan (SNP) dengan nilai capaian memuaskan dari Badan Akreditasi Nasional.",
      codeOrSk: "Sertifikat Akreditasi BAN-PDM 2023",
      themeColor: "emerald"
    },
    {
      id: "leg-2",
      badge: "IZIN OPERASIONAL",
      title: "Kemendikbudristek & Dinas",
      description: "Lembaga resmi terdaftar di Dinas Pendidikan Kabupaten Gunungkidul dan terdata aktif dalam sistem Dapodik Kemendikbudristek.",
      codeOrSk: "Izin Operasional No: 421.2/0836/2022",
      themeColor: "amber"
    },
    {
      id: "leg-3",
      badge: "YAYASAN PENYELENGGARA",
      title: "Pondok Pesantren Al I'tishom",
      description: "Berdiri di bawah naungan legalitas hukum Kemenkumham RI dengan dewan pembina dan asatidz berpengalaman dakwah sejak 2009.",
      codeOrSk: "AHU-001271.AH.01.12.Tahun 2021",
      themeColor: "teal"
    }
  ],
  teachersSectionTitle: "Dewan Guru & Asatidz",
  teachersSectionSubtitle: "Para asatidz dan ustazah yang kompeten, mencintai anak-anak, serta membimbing santri dengan keteladanan akhlak nabawiyah.",

  // Kegiatan
  kegiatanBadge: "KURIKULUM BERKARAKTER & DINAMIS",
  kegiatanTitle: "Kegiatan & Eksplorasi Santri Unggulan",
  kegiatanSubtitle: "Menghidupkan adab Qur'ani, kecakapan intelektual, ketahanan fisik, dan kreativitas mandiri melalui pembiasaan harian terpadu dan ragam ekstrakurikuler aplikatif di Playen.",
  kegiatanStat1Val: "12+",
  kegiatanStat1Label: "Klub Bakat & Minat",
  kegiatanStat2Val: "100%",
  kegiatanStat2Label: "Integrasi Adab",
  kegiatanStatsRibbon: {
    stat1Val: "07.00",
    stat1Label: "Mulai Halaqah Pagi",
    stat2Val: "30 Juz",
    stat2Label: "Bimbingan Tajwid Sanad",
    stat3Val: "100%",
    stat3Label: "Praktik Lapangan Sunnah",
    stat4Val: "24/7",
    stat4Label: "Pendampingan Karakter"
  },
  dailyActivitiesTitle: "Kegiatan Harian & Mingguan Santri",
  dailyActivitiesSubtitle: "Rutinitas pembentukan kedisiplinan, ibadah wajib & sunnah, dan tahfidz berkelanjutan.",
  dailyActivities: [
    {
      id: "act-d1",
      title: "Sholat Dhuha & Berjamaah Terbimbing",
      category: "IBADAH",
      description: "Pembiasaan shalat sunnah Dhuha setiap pagi serta shalat Dzuhur & Ashar berjamaah dengan adab masjid lengkap.",
      timeOrFrequency: "Setiap Hari (07.15 & Dzuhur)",
      imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=600&q=80",
      type: "harian"
    },
    {
      id: "act-d2",
      title: "Halaqah Tahfidz & Talaqqi Pagi",
      category: "TAHFIDZ",
      description: "Metode setoran hafalan baru (ziyadah) dengan rasio 1 ustadz mendampingi maksimal 10–12 santri secara intensif.",
      timeOrFrequency: "Senin – Jumat (07.30 – 08.45)",
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
      type: "harian"
    },
    {
      id: "act-d3",
      title: "Kultum Dhuha & Muroja'ah Akbar",
      category: "KARAKTER",
      description: "Latihan public speaking santri bergiliran membawakan nasihat hadits singkat, dilanjutkan muroja'ah bersama satu juz.",
      timeOrFrequency: "Rabu & Jumat (08.45 – 09.15)",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
      type: "harian"
    },
    {
      id: "act-d4",
      title: "Senam Pagi & Olahraga Kebugaran",
      category: "JASMANI",
      description: "Aktivitas pembinaan fisik santri di lapangan terbuka asri untuk menjaga kebugaran dan stamina menghafal Al-Qur'an.",
      timeOrFrequency: "Jumat Pagi (06.45 – 07.30)",
      imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
      type: "harian"
    }
  ],
  periodicProgramsTitle: "Program Unggulan Berkala",
  periodicProgramsSubtitle: "Agenda penguatan spiritual, literasi, karya, dan kepedulian sosial santri dalam satu semester.",
  periodicPrograms: [
    {
      id: "act-p1",
      title: "Dauroh Qur'an & Mabit Santri",
      category: "TAHFIDZ AKBAR",
      description: "Program intensif muroja'ah dan karantina hafalan semalam di sekolah dengan suasana qiyamul lail berjamaah.",
      timeOrFrequency: "1 Kali per Semester",
      imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80",
      type: "berkala"
    },
    {
      id: "act-p2",
      title: "Outing Class Sains & Alam Gunungkidul",
      category: "EKSPLORASI",
      description: "Pembelajaran kontekstual di alam terbuka, mengenal flora fauna lokal, peternakan, dan sains terapan ciptaan Allah SWT.",
      timeOrFrequency: "Tengah Semester",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
      type: "berkala"
    },
    {
      id: "act-p3",
      title: "Bakti Sosial & Santunan Berkah",
      category: "SOSIAL",
      description: "Penyaluran sedekah dan paket sembako santri kepada warga sekitar Playen untuk melatih empati kedermawanan.",
      timeOrFrequency: "Bulan Ramadhan / Idul Adha",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
      type: "berkala"
    }
  ],

  // Fasilitas
  fasilitasBadge: "SARANA & PRASARANA MODERN",
  fasilitasTitle: "Fasilitas Pendukung Belajar & Tahfidz yang Asri",
  fasilitasSubtitle: "Menghadirkan lingkungan belajar yang aman, nyaman, dan sejuk di Playen. Menunjang percepatan hafalan Al-Qur'an, eksplorasi sains, serta kesehatan jasmani santri.",
  fasilitasStat1Val: "100%",
  fasilitasStat1Label: "Milik Sendiri",
  fasilitasStat1Sub: "Lahan Wakaf Resmi",
  fasilitasStat2Val: "24/7",
  fasilitasStat2Label: "Keamanan Terpadu",
  fasilitasStat2Sub: "CCTV & One Gate",
  fasilitasEcoBadge: "STANDAR KESELAMATAN & KENYAMANAN",
  fasilitasEcoTitle: "Ekosistem Belajar Hijau, Aman, dan Ramah Anak di Playen",
  fasilitasEcoSubtitle: "Kenyamanan lingkungan fisik secara langsung mempengaruhi daya serap ingatan hafalan Al-Qur'an santri dan ketenangan orang tua selama ananda beraktivitas di sekolah.",
  fasilitasEcoItems: [
    {
      id: "eco-1",
      title: "Bebas Polusi & Udara Sejuk",
      description: "Jauh dari kebisingan jalan raya utama, dikelilingi pepohonan rimbun yang memasok udara segar untuk fokus belajar."
    },
    {
      id: "eco-2",
      title: "Keamanan Terpadu & Ramah Anak",
      description: "Akses satu pintu (one gate system), pengawasan ustadz dan pos satpam, serta area tanpa sudut berbahaya bagi santri kecil."
    },
    {
      id: "eco-3",
      title: "Air Bersih & Sanitasi Standar",
      description: "Sumber air wudhu mengalir jernih melimpah, toilet santri putra dan putri terpisah dengan standar higienis terjaga."
    },
    {
      id: "eco-4",
      title: "Masjid Nyaman & Terbuka",
      description: "Pusat ruhaniyah sekolah yang bersih dan sejuk untuk pembiasaan shalat berjamaah, halaqah Qur'an, dan tasmi'."
    }
  ],

  // 3 Kategori Pengantar Fasilitas
  facilityCat1Title: "Sarana Ibadah & Al-Qur'an",
  facilityCat1Desc: "Pusat pembinaan ruhiyah santri berupa masjid yang sejuk dan bersih, area wudhu higienis terpisah ikhwan-akhwat, serta ruang halaqah tahfidzul Qur'an yang kondusif untuk kelancaran talaqqi dan muroja'ah.",
  facilityCat1Image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",

  facilityCat2Title: "Ruang Belajar & Pembiasaan",
  facilityCat2Desc: "Ruang kelas representatif dengan ventilasi optimal dan pencahayaan asri, laboratorium komputer untuk literasi digital santri, aula serbaguna, serta media peraga pembelajaran konkret dan interaktif.",
  facilityCat2Image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",

  facilityCat3Title: "Olahraga, Seni & Pendukung",
  facilityCat3Desc: "Halaman terbuka hijau yang luas untuk apel, olahraga futsal, latihan memanah sunnah, kepanduan Hizbul Wathan/Pramuka, serta ekosistem lingkungan asri ramah anak yang bebas polusi.",
  facilityCat3Image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",

  // Infaq
  infaqBadge: "INFAQ, WAKAF & SEDEKAH PENDIDIKAN",
  infaqTitle: "Investasi Abadi untuk Generasi Penghafal Al-Qur'an",
  infaqSubtitle: "Salurkan infaq dan wakaf terbaik Anda guna mendukung operasional beasiswa santri dhuafa berprestasi, fasilitas halaqah tahfidz, dan pengembangan sarana dakwah di Playen, Gunungkidul.",
  infaqTrustBadges: ["100% Saluran Amanah", "Laporan Keuangan Berkala", "Terdaftar Kemenag DIY"],
  infaqPrograms: [
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
  ],

  // SPMB
  spmbBadge: "PENERIMAAN SANTRI BARU (PSB) ONLINE",
  spmbTitle: "Pendaftaran Santri Baru SD Quran Unggulan Al-Itisham Playen",
  spmbSubtitle: "Selamat datang di portal resmi Penerimaan Santri Baru (PSB). Silakan mengisi formulir pendaftaran online langsung di bawah ini. Tim panitia siap mendampingi ananda bertumbuh dalam keimanan kokoh, hafalan Al-Qur'an mutqin, serta budi pekerti mulia.",
  spmbStatusPill: "KUOTA TERBATAS • MAKS. 28 SANTRI/KELAS",
  spmbStepsTitle: "Alur Pendaftaran Santri Baru",
  spmbStepsSubtitle: "Proses mudah dan transparan dari pengisian formulir hingga penyambutan santri baru:",
  spmbSteps: [
    {
      step: 1,
      title: "Isi Formulir Online",
      description: "Mengisi formulir PSB melalui link yang tersedia dan melengkapi biodata dasar santri."
    },
    {
      step: 2,
      title: "Konfirmasi Panitia",
      description: "Konfirmasi pengisian data via WhatsApp panitia untuk penjadwalan observasi."
    },
    {
      step: 3,
      title: "Observasi & Pemetaan",
      description: "Pemetaan fitrah, kesiapan belajar, dan sosialisasi santri bersama para asatidz."
    },
    {
      step: 4,
      title: "Wawancara Orang Tua",
      description: "Penyelarasan visi pendidikan antara orang tua dan madrasah demi tumbuh kembang optimal."
    },
    {
      step: 5,
      title: "Daftar Ulang",
      description: "Verifikasi berkas fisik, pengukuran seragam, dan penerimaan atribut santri baru."
    }
  ],
  spmbDocsTitle: "Syarat & Dokumen Kelengkapan Berkas",
  spmbDocsSubtitle: "Berkas diserahkan dalam map folio saat tahapan observasi tatap muka:",
  spmbDocsList: [
    "Fotokopi Akta Kelahiran Calon Santri (2 lembar)",
    "Fotokopi Kartu Keluarga (KK) terbaru (2 lembar)",
    "Fotokopi KTP kedua orang tua / wali (masing-masing 1 lembar)",
    "Pas foto berwarna calon santri ukuran 3x4 (4 lembar)",
    "Fotokopi Ijazah / Surat Keterangan Lulus TK/RA/PAUD",
    "Surat Keterangan Sehat dari Dokter / Fasilitas Kesehatan"
  ],
  spmbFaqTitle: "Pertanyaan yang Sering Diajukan (FAQ)",
  spmbFaqSubtitle: "Jawaban seputar tes observasi, kurikulum tahfidz, dan proses pendaftaran santri baru.",
  spmbFaqs: [
    {
      id: "faq-1",
      question: "Apakah calon santri harus sudah bisa membaca Al-Qur'an dan Calistung saat mendaftar?",
      answer: "Tidak wajib. Observasi di SDQU Al I'tisham lebih menitikberatkan pada pemetaan kesiapan motorik, kemandirian anak, daya tangkap, dan kemauan belajar. Kami memiliki program matrikulasi dan bimbingan membaca dari dasar (BTA & Iqro')."
    },
    {
      id: "faq-2",
      question: "Berapa target hafalan Al-Qur'an selama 6 tahun di SDQU Al I'tisham?",
      answer: "Target minimal kelulusan adalah 3 hingga 5 juz mutqin dengan sanad tajwid yang benar. Bagi santri kelas akselerasi atau peminatan khusus, disediakan program tahfidz intensif hingga 10–30 juz."
    },
    {
      id: "faq-3",
      question: "Apakah kurikulum umum (Kemendikbud) tetap diajarkan secara lengkap?",
      answer: "Ya, kurikulum nasional tetap diajarkan secara lengkap dan terpadu. Santri tetap menempuh Asesmen Standarisasi Pendidikan Daerah (ASPD) dan mata pelajaran sains, matematika, bahasa, serta IPS dengan standar tinggi."
    },
    {
      id: "faq-4",
      question: "Apakah tersedia program beasiswa untuk santri yatim atau dhuafa?",
      answer: "Ya, Yayasan Al I'tisham menyediakan jalur Beasiswa Tahfidz Prestasi dan Beasiswa Dhuafa. Orang tua dapat mengajukan keringanan biaya melalui konfirmasi dokumen kepada tim panitia PSB."
    }
  ]
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Pendaftaran Santri Baru (SPMB) Gelombang 1 TA 2025/2026 Dibuka",
    category: "SPMB",
    date: "10 Januari 2025",
    content: "Penerimaan santri baru tahun ajaran 2025/2026 jalur Reguler dan Beasiswa Tahfidz Prestasi resmi dibuka. Kuota terbatas 72 siswa (3 Rombel) demi menjaga rasio pembinaan halaqah 1:12.",
    isImportant: true,
    isActive: true
  },
  {
    id: "ann-2",
    title: "Jadwal Observasi dan Pemetaan Fitrah Santri Gelombang 1",
    category: "Akademik",
    date: "15 Februari 2025",
    content: "Observasi calon santri baru mencakup kesiapan motorik, kemandirian, wawancara kesepakatan orang tua, dan tes baca Al-Qur'an secara menyenangkan dan ramah anak.",
    isImportant: false,
    isActive: true
  },
  {
    id: "ann-3",
    title: "Pelaksanaan Ujian Tasmi' Al-Qur'an Bil Ghoib Sekali Duduk",
    category: "Tahfidz",
    date: "25 Januari 2025",
    content: "Santri kelas 4, 5, dan 6 akan mengikuti uji tasmi' hafalan 1 s.d. 5 juz sekali duduk di hadapan dewan penguji bersanad dan disaksikan wali santri.",
    isImportant: false,
    isActive: true
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Santri SDQU Al I'tisham Raih Juara 1 Olimpiade Sains & Matematika Tingkat DIY",
    excerpt: "Prestasi membanggakan kembali diraih ananda santri yang memadukan kekuatan spiritual tahfidz Al-Qur'an dengan nalar riset saintifik unggul.",
    content: "Alhamdulillah, kontingen santri SD Qur'an Unggulan Al I'tisham Playen berhasil menorehkan prestasi gemilang dengan menyabet Medali Emas dalam ajang Olimpiade Sains dan Matematika tingkat Daerah Istimewa Yogyakarta. Keberhasilan ini membuktikan bahwa hafalan Al-Qur'an mempertajam kecerdasan logika anak dalam membedah problem solving sains.",
    author: "Humas SDQU",
    date: "18 Januari 2025",
    category: "Prestasi",
    imageUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80",
    readTime: "3 menit"
  },
  {
    id: "news-2",
    title: "Semarak Mukhayyam Al-Qur'an 3 Hari: Merajut Karakter Mandiri & Cinta Tilawah",
    excerpt: "Karantina intensif tahfidz di alam terbuka memadukan tadabbur alam Wanagama dengan muroja'ah akbar santri.",
    content: "Kegiatan Mukhayyam Al-Qur'an semester genap berlangsung sukses dan khidmat di kawasan asri Hutan Wanagama Playen. Santri dilatih mandiri mulai dari mendirikan tenda, shalat tahajud berjamaah di bawah naungan alam, hingga setoran hafalan intensif dengan target kelancaran mutqin.",
    author: "Ustadz Faisal, S.Pd.I",
    date: "05 Februari 2025",
    category: "Kegiatan",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    readTime: "4 menit"
  },
  {
    id: "news-3",
    title: "Market Day Entrepreneur: Santri Praktik Langsung Muamalah Syariah dan Literasi Finansial",
    excerpt: "Menumbuhkan jiwa kepemimpinan dan kejujuran berbisnis sejak usia sekolah dasar sesuai teladan Rasulullah SAW.",
    content: "Halaman sekolah disulap menjadi pasar bazar Islami dalam kegiatan Market Day. Para santri menyajikan produk kreatif buatan sendiri, menghitung uang kembalian secara teliti, serta menyisihkan sebagian keuntungan untuk sedekah infaq peduli yatim.",
    author: "Tim Kesiswaan",
    date: "20 Februari 2025",
    category: "Karakter",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    readTime: "3 menit"
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: "event-1",
    title: "Tasmi' Akbar 1–5 Juz Sekali Duduk",
    month: "MARET 2025",
    dateRange: "15 - 16 Maret 2025",
    location: "Aula Utama Kampus 1 SDQU",
    category: "Tahfidz",
    description: "Ujian sekali duduk hafalan santri di hadapan dewan asatidz dan para wali santri.",
    iconName: "BookOpen"
  },
  {
    id: "event-2",
    title: "Pesantren Kilat Ramadhan & Baksos Fitrah",
    month: "APRIL 2025",
    dateRange: "10 - 20 April 2025",
    location: "Masjid & Kompleks SDQU Al I'tisham",
    category: "Dakwah",
    description: "Kajian fiqih ibadah, tahsin bersanad, bakti sosial ifthar on the road di Playen.",
    iconName: "Star"
  },
  {
    id: "event-3",
    title: "Kemah Ukhuwah & Latihan Panahan Sunnah",
    month: "MEI 2025",
    dateRange: "22 - 24 Mei 2025",
    location: "Bumi Perkemahan Wanagama Playen",
    category: "Kepanduan",
    description: "Perkemahan Hizbul Wathan terintegrasi turnamen internal memanah dan ketangkasan fisik.",
    iconName: "CheckCircle"
  },
  {
    id: "event-4",
    title: "Haflah Akhirussanah & Wisuda Tahfidz 2025",
    month: "JUNI 2025",
    dateRange: "18 Juni 2025",
    location: "Gedung Serbaguna Playen, Gunungkidul",
    category: "Wisuda",
    description: "Wisuda Tahfidz Qur'an, pentas kaligrafi, dan penyerahan penghargaan santri berprestasi.",
    iconName: "Award"
  }
];

export const INITIAL_TEACHERS: TeacherItem[] = [
  {
    id: "tc-1",
    name: "Ustadz Mukhlishin, S.Pd.I., Al-Hafizh",
    role: "Koordinator Tahfidz & Pengampu Sanad",
    education: "Universitas Islam Negeri Sunan Kalijaga",
    specialty: "Sanad Qira'ah Hafsh 'an 'Ashim Jalur Syathibiyyah",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    order: 1
  },
  {
    id: "tc-2",
    name: "Ustadzah Nurul Hidayati, M.Pd.",
    role: "Kepala Sekolah & Konsultan Pedagogik",
    education: "Magister Pendidikan Universitas Negeri Yogyakarta",
    specialty: "Kurikulum Merdeka Terintegrasi Adab Nabawiyah",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    order: 2
  },
  {
    id: "tc-3",
    name: "Ustadz Rizky Ananda, S.Kom.",
    role: "Pengampu Robotika & IT Digital Sehat",
    education: "Universitas Gadjah Mada (UGM)",
    specialty: "Computational Thinking & Visual Coding Scratch/Blockly",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    order: 3
  },
  {
    id: "tc-4",
    name: "Ustadzah Fatimah Azzahra, Lc.",
    role: "Pembina Bilingual Arabic & Hadits",
    education: "Universitas Al-Azhar Kairo / LIPIA Jakarta",
    specialty: "Talaqqi Bahasa Arab Tematik & Mufrodat Harian",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    order: 4
  },
  {
    id: "tc-5",
    name: "Ustadz Danang Prasetyo, S.Si.",
    role: "Koordinator Sains & Pembina Riset Cilik",
    education: "Fakultas Biologi Universitas Gadjah Mada",
    specialty: "Eksperimen Sains Qur'ani & Hidroponik Greenhouse",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    order: 5
  },
  {
    id: "tc-6",
    name: "Ustadz Hamdan Lc.",
    role: "Bendahara Wakaf & Pembina Adab Santri",
    education: "STDI Imam Syafi'i Jember",
    specialty: "Fiqih Muamalah & Pengelolaan Ziswaf Akuntabel",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    order: 6
  }
];

export const INITIAL_FACILITIES: FacilityItem[] = [
  {
    id: "fac-1",
    name: "Ruang Kelas",
    category: "kelas",
    categoryLabel: "Ruang Kelas",
    capacity: "Ruang Belajar Nyaman",
    specs: [
      "Ventilasi & Pencahayaan Optimal",
      "Meja Kursi Ergonomis Ramah Anak",
      "Papan Tulis & Media Belajar Interaktif"
    ],
    description: "Ruang kelas yang nyaman, bersih, dan representatif untuk mendukung metode pembelajaran PAIKEM (Pembelajaran Aktif, Inovatif, Kreatif, Efektif, dan Menyenangkan).",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac-2",
    name: "Masjid",
    category: "ibadah",
    categoryLabel: "Tempat Ibadah",
    capacity: "Jamaah Santri & Asatidz",
    specs: [
      "Area Ibadah Suci & Sejuk",
      "Tempat Wudhu Ikhwan & Akhwat Terpisah",
      "Pusat Halaqah Tahfidzul Qur'an"
    ],
    description: "Pusat pembinaan ruhiyah, shalat berjamaah, pembiasaan ibadah harian, serta halaqah tahfidz dan muraja'ah Al-Qur'an.",
    imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac-3",
    name: "Lab Komputer",
    category: "kelas",
    categoryLabel: "Laboratorium Komputer",
    capacity: "Unit Komputer Lengkap",
    specs: [
      "Perangkat Komputer Siap Pakai",
      "Internet Terproteksi Konten Positif",
      "Pembelajaran Literasi Digital & TIK"
    ],
    description: "Fasilitas laboratorium komputer untuk membekali santri keterampilan teknologi informasi, literasi digital sehat, serta latihan komputasi dasar.",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac-4",
    name: "Aula",
    category: "kelas",
    categoryLabel: "Aula Serbaguna",
    capacity: "Ruang Pertemuan Luas",
    specs: [
      "Audio Sound System & Proyektor",
      "Kapasitas Luas untuk Pertemuan",
      "Pentas Seni & Haflah Santri"
    ],
    description: "Gedung aula serbaguna untuk berbagai kegiatan bersama, pertemuan wali santri, peringatan hari besar Islam, seminar, dan wisuda tahfidz.",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac-5",
    name: "Halaman",
    category: "olahraga",
    categoryLabel: "Halaman & Area Terbuka",
    capacity: "Area Outdoor Luas",
    specs: [
      "Suasana Asri & Jauh dari Keramaian",
      "Lapangan Upacara & Olahraga",
      "Area Latihan Panahan & Kepanduan"
    ],
    description: "Halaman terbuka yang luas, hijau, dan asri di lingkungan Banaran Playen untuk kegiatan apel santri, olahraga, latihan panahan, kepanduan pramuka, dan kegiatan lingkungan.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fac-6",
    name: "Berbagai Alat Peraga Pembelajaran",
    category: "kelas",
    categoryLabel: "Media Pembelajaran",
    capacity: "Lengkap & Variatif",
    specs: [
      "Alat Peraga IPA & Matematika Konkret",
      "Media Pembelajaran Al-Qur'an & Tajwid",
      "Alat Peraga Bahasa & Literasi PAIKEM"
    ],
    description: "Koleksi sarana dan alat peraga edukatif guna mempermudah pemahaman konsep saintifik, keagamaan, dan bahasa secara interaktif, menyenangkan, dan berdaya serap tinggi.",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Suasana Halaqah Talaqqi Al-Qur'an Pagi",
    category: "Tahfidz",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    date: "Februari 2025"
  },
  {
    id: "gal-2",
    title: "Praktik Eksperimen Sains Mikroskop Kauniyah",
    category: "Sains",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
    date: "Januari 2025"
  },
  {
    id: "gal-3",
    title: "Latihan Panahan Tradisional Sunnah Santri",
    category: "Ekstrakurikuler",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    date: "Februari 2025"
  },
  {
    id: "gal-4",
    title: "Pembinaan Karakter Sholat Dhuha Berjamaah",
    category: "Ibadah",
    imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    date: "Januari 2025"
  },
  {
    id: "gal-5",
    title: "Kunjungan Edukasi Outing Class Alam Pegunungan",
    category: "Outing",
    imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
    date: "Desember 2024"
  },
  {
    id: "gal-6",
    title: "Haflah Wisuda Tahfidz & Khotmil Qur'an",
    category: "Prestasi",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    date: "Juni 2024"
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: "test-1",
    name: "dr. Ahmad Wahyudi, Sp.A",
    role: "Wali Santri Alumni 2024 • Playen",
    avatar: "AW",
    avatarColor: "bg-emerald-700",
    content: "Alhamdulillah, anak kami tidak hanya hafal 4 juz dengan mutqin saat lulus, tapi yang paling membuat haru adalah kebiasaannya menjaga shalat tepat waktu dan adab bicaranya yang santun kepada kakek neneknya."
  },
  {
    id: "test-2",
    name: "Siti Nurjanah, S.Pd.",
    role: "Wali Santri Kelas 4 • Wonosari",
    avatar: "SN",
    avatarColor: "bg-amber-600",
    content: "Kekhawatiran kami tentang beban sekolah gugur seketika. Sistem pembelajaran di SDQU Al I'tisham sangat menyenangkan (joyful learning). Ananda selalu antusias bercerita tentang sains dan tilawah tiap pulang sekolah."
  },
  {
    id: "test-3",
    name: "Fajar Pratama, M.T.",
    role: "Wali Santri Kelas 2 • Paliyan",
    avatar: "FP",
    avatarColor: "bg-teal-700",
    content: "Komunikasi ustadz-ustadzah sangat terbuka. Mutaba'ah harian di aplikasi memudahkan kami memantau muroja'ah di rumah. Guru-gurunya sabar luar biasa dan benar-benar menanamkan cinta Qur'an tanpa paksaan."
  }
];

export const INITIAL_PPDB: PPDBApplicant[] = [
  {
    id: "ppdb-001",
    registrationNumber: "SDQU-2025-001",
    studentName: "Muhammad Farhan Al-Fatih",
    nickname: "Farhan",
    gender: "Laki-laki",
    birthPlace: "Gunungkidul",
    birthDate: "2018-05-14",
    track: "Reguler",
    parentName: "Hendra Irawan, S.T.",
    parentPhone: "081298765432",
    parentEmail: "hendra.irawan@gmail.com",
    address: "Logandeng, Playen, Gunungkidul",
    previousSchool: "TK IT Mutiara Hati Wonosari",
    quranMemorization: "Juz 30 (An-Naas s.d An-Naba')",
    status: "Observasi",
    registrationDate: "2025-01-12",
    notes: "Sudah terjadwal temu observasi Sabtu pekan ini."
  },
  {
    id: "ppdb-002",
    registrationNumber: "SDQU-2025-002",
    studentName: "Maryam Khairunnisa",
    nickname: "Maryam",
    gender: "Perempuan",
    birthPlace: "Yogyakarta",
    birthDate: "2018-08-20",
    track: "Beasiswa Tahfidz Prestasi",
    parentName: "dr. Faisal Ibrahim, Sp.A",
    parentPhone: "087812345678",
    parentEmail: "drfaisal.ibrahim@gmail.com",
    address: "Gatak, Playen, Gunungkidul",
    previousSchool: "RA Al-Ikhlas Playen",
    quranMemorization: "2 Juz (Juz 29 & 30 Mutqin)",
    status: "Diterima",
    registrationDate: "2025-01-15",
    notes: "Lulus seleksi beasiswa tahfidz prestasi."
  },
  {
    id: "ppdb-003",
    registrationNumber: "SDQU-2025-003",
    studentName: "Ahmad Ziyad Al-Farabi",
    nickname: "Ziyad",
    gender: "Laki-laki",
    birthPlace: "Wonosari",
    birthDate: "2018-11-03",
    track: "Reguler",
    parentName: "Bambang Triyono",
    parentPhone: "085643219870",
    parentEmail: "bambang.triyono@yahoo.com",
    address: "Baleharjo, Wonosari, Gunungkidul",
    previousSchool: "TK ABA Wonosari",
    quranMemorization: "Surat Pendek (Ad-Dhuha - An-Naas)",
    status: "Menunggu",
    registrationDate: "2025-02-02",
    notes: "Menunggu kelengkapan fotokopi Akta & KK."
  }
];
