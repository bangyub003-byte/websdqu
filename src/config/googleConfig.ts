/**
 * Konfigurasi Utama Integrasi Google Workspace (Spreadsheet & Drive)
 * SD Qur'an Unggulan Al I'tisham Playen
 *
 * Semua ID dan URL diletakkan di satu file ini agar memudahkan pengelolaan
 * dan pemindahan ke akun Google resmi sekolah tanpa perlu mengubah kode lain.
 */

export const GOOGLE_CONFIG = {
  // Google Spreadsheet ID resmi sekolah
  SPREADSHEET_ID: '1JHMBdolxzEDbDEzjwsFDktXKjvEuYSImxEeOFYayOxk',

  // Google Drive Folder ID resmi untuk penyimpanan berkas PPDB & gambar
  DRIVE_FOLDER_ID: '1cp8ej7I7lQ5K157O4aaVos0tuJqnUQME',

  // URL Netlify SPMB Eksternal (bisa dijadikan iframe atau dibuka di tab baru)
  NETLIFY_PSB_URL: 'https://psb-sdqu-alitisham.netlify.app',

  // Default Google Apps Script Web App URL (dapat diubah oleh operator via Admin CMS)
  APPS_SCRIPT_DEFAULT_URL: 'https://script.google.com/macros/s/AKfycbzSES6hAB91kaDmDzsbXVFzONlElnNUsJGmuKHohiTPkLI6Ezf--_xE_o7b9bxLAGzZ/exec',

  // Struktur nama sheet di Google Spreadsheet
  SHEETS: {
    SETTINGS: 'Settings',
    ANNOUNCEMENTS: 'Announcements',
    NEWS: 'News',
    EVENTS: 'Events',
    TEACHERS: 'Teachers',
    GALLERY: 'Gallery',
    PPDB: 'PPDB',
    ADMIN: 'Admin',
    INFAQ: 'Infaq'
  }
};

/**
 * Script Google Apps Script (Code.gs) yang siap dicopy-paste oleh operator sekolah
 * ke menu Extensions -> Apps Script pada Google Spreadsheet.
 */
export function getAppsScriptCode(customSpreadsheetId?: string, customDriveFolderId?: string): string {
  const ssId = (customSpreadsheetId && customSpreadsheetId.trim() !== '') ? customSpreadsheetId.trim() : GOOGLE_CONFIG.SPREADSHEET_ID;
  const driveId = (customDriveFolderId && customDriveFolderId.trim() !== '') ? customDriveFolderId.trim() : GOOGLE_CONFIG.DRIVE_FOLDER_ID;

  return `/**
 * BACKEND API GOOGLE APPS SCRIPT (FULL SINKRONISASI REALTIME)
 * SD QUR'AN UNGGULAN AL I'TISHAM PLAYEN
 *
 * Spreadsheet ID: ${ssId}
 * Drive Folder ID: ${driveId}
 */

const SPREADSHEET_ID = "${ssId}";
const DRIVE_FOLDER_ID = "${driveId}";

// 1. Helper Akses Spreadsheet Otomatis
function getSS() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch(e) {}
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    }
  } catch(e) {}
  throw new Error("Spreadsheet tidak dapat diakses. Pastikan script ini dibuka dari menu Ekstensi > Apps Script di Spreadsheet Anda.");
}

// 2. Helper Akses Google Drive Otomatis (Buat folder otomatis jika ID kosong atau tidak valid)
function getUploadFolder() {
  if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID.trim() !== '' && DRIVE_FOLDER_ID.indexOf('...') === -1) {
    try {
      var existingFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID.trim());
      if (existingFolder) return existingFolder;
    } catch(e) {
      Logger.log("Folder Drive ID tidak ditemukan di akun ini, beralih ke folder otomatis: " + e);
    }
  }
  // Otomatis cari atau buat folder di Google Drive sekolah milik akun ini
  var folderName = "SDQU_Berkas_Upload";
  var folders = DriveApp.getFoldersByName(folderName);
  var folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName);
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(errShare) {
      Logger.log("Info permission: " + errShare);
    }
  }
  return folder;
}

function doGet(e) {
  try {
    const ss = getSS();
    const action = (e && e.parameter && e.parameter.action) || 'getAll';
    const sheetName = (e && e.parameter && e.parameter.sheet) || 'PPDB';

    // 1. Ambil Semua Data (Termasuk CMS, PPDB, dan Infaq)
    if (action === 'getAll') {
      const result = {};
      const sheets = ss.getSheets();
      sheets.forEach(sh => {
        const name = sh.getName();
        const data = sh.getDataRange().getValues();
        if (data.length > 1) {
          const headers = data[0];
          result[name] = data.slice(1).map(row => {
            const item = {};
            headers.forEach((h, i) => item[h] = row[i]);
            return item;
          });
        } else {
          result[name] = [];
        }
      });
      return createJsonResponse({ success: true, data: result });
    }

    // 2. Ambil Khusus Data CMS State
    if (action === 'getCMS') {
      const sheet = ss.getSheetByName('CMS_Data');
      if (sheet && sheet.getLastRow() > 1) {
        const val = sheet.getRange(2, 2).getValue();
        if (val) {
          return createJsonResponse({ success: true, data: JSON.parse(val) });
        }
      }
      return createJsonResponse({ success: false, message: 'Belum ada data CMS tersimpan di Spreadsheet' });
    }

    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return createJsonResponse({ success: false, error: 'Sheet not found: ' + sheetName });
    }
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse({ success: true, data: [] });
    }
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const item = {};
      headers.forEach((h, i) => item[h] = row[i]);
      return item;
    });
    return createJsonResponse({ success: true, data: rows });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const ss = getSS();

    // 1. Unggah Gambar / Logo Langsung ke Google Drive Sekolah (Publik CDN)
    if (action === 'upload_image') {
      if (!contents.fileData || !contents.fileName) {
        return createJsonResponse({ success: false, error: 'fileData dan fileName diperlukan' });
      }
      try {
        const folder = getUploadFolder();
        const rawBase64 = contents.fileData.split(',')[1] || contents.fileData;
        const decoded = Utilities.base64Decode(rawBase64);
        const mime = contents.fileMime || 'image/jpeg';
        const blob = Utilities.newBlob(decoded, mime, contents.fileName);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        const fileId = file.getId();
        const driveUrl = file.getUrl();
        const directUrl = 'https://lh3.googleusercontent.com/d/' + fileId;
        return createJsonResponse({
          success: true,
          fileId: fileId,
          driveUrl: driveUrl,
          directUrl: directUrl,
          message: 'Gambar berhasil diunggah ke Google Drive'
        });
      } catch (uploadErr) {
        return createJsonResponse({ success: false, error: uploadErr.toString() });
      }
    }

    // 2. Simpan Perubahan CMS ke Lembar Bacaan Manusia & JSON Backup
    if (action === 'save_cms') {
      const data = contents.data;

      // A. Simpan Full JSON State ke Lembar CMS_Data
      let sheetCMS = ss.getSheetByName('CMS_Data');
      if (!sheetCMS) {
        sheetCMS = ss.insertSheet('CMS_Data');
        sheetCMS.appendRow(['key', 'value', 'updatedAt']);
      }
      const payloadStr = JSON.stringify(data);
      const lastRowCMS = sheetCMS.getLastRow();
      if (lastRowCMS > 1) {
        sheetCMS.getRange(2, 1, lastRowCMS - 1, 3).clearContent();
      }
      sheetCMS.getRange(2, 1, 1, 3).setValues([['FULL_CMS_STATE', payloadStr, new Date().toISOString()]]);

      // B. Sinkronkan Lembar "Settings" yang Mudah Diedit Manusia
      if (data.settings) {
        let shSettings = ss.getSheetByName('Settings');
        if (!shSettings) {
          shSettings = ss.insertSheet('Settings');
        }
        shSettings.clear();
        shSettings.appendRow(['Key', 'Label', 'Value', 'Keterangan']);
        const s = data.settings;
        const rowsSettings = [
          ['schoolName', 'Nama Sekolah', s.schoolName || '', 'Nama resmi sekolah di header & kartu'],
          ['tagline', 'Tagline / Slogan', s.tagline || '', 'Slogan yang tampil di bawah nama sekolah'],
          ['heroAlumniStat', 'Teks Statistik Hero', s.heroAlumniStat || '', 'Badge statistik di banner beranda'],
          ['heroCardBadge', 'Badge Akreditasi', s.heroCardBadge || '', 'Badge kartu beranda'],
          ['heroCardRating', 'Rating Kepuasan', s.heroCardRating || '', 'Rating 4.9/5.0 di kartu beranda'],
          ['heroCardStatNumber', 'Angka Pengabdian', s.heroCardStatNumber || '', 'Angka tahun (15+)'],
          ['heroCardStatLabel', 'Label Pengabdian', s.heroCardStatLabel || '', 'Tahun Pengabdian'],
          ['heroCardDescription', 'Deskripsi Kartu Hero', s.heroCardDescription || '', 'Paragraf keterangan di kartu beranda'],
          ['heroCardCurriculumTitle', 'Judul Kurikulum', s.heroCardCurriculumTitle || '', 'Judul kurikulum terintegrasi'],
          ['heroCardCurriculumSubtitle', 'Rincian Kurikulum', s.heroCardCurriculumSubtitle || '', 'Kemendikbud • Kemenag • Pesantren'],
          ['heroCardButtonText', 'Teks Tombol Kartu', s.heroCardButtonText || '', 'Teks tombol di kartu beranda'],
          ['logoUrl', 'URL Logo Sekolah', s.logoUrl || '', 'Tautan foto logo sekolah (Drive / CDN)'],
          ['heroImageUrl', 'URL Background Hero', s.heroImageUrl || '', 'Tautan background hero beranda'],
          ['profileBannerImageUrl', 'URL Banner Profil', s.profileBannerImageUrl || '', 'Tautan foto banner profil sekolah'],
          ['qrisImageUrl', 'URL Foto QRIS', s.qrisImageUrl || '', 'Tautan gambar barcode QRIS Infaq'],
          ['phone', 'Nomor Telepon / WA', s.phone || '', 'Kontak WhatsApp resmi'],
          ['email', 'Email Resmi', s.email || '', 'Alamat email resmi sekolah'],
          ['address', 'Alamat Lengkap', s.address || '', 'Alamat fisik sekolah']
        ];
        rowsSettings.forEach(r => shSettings.appendRow(r));
        shSettings.getRange('A1:D1').setFontWeight('bold').setBackground('#d1fae5');
      }

      // C. Sinkronkan Lembar "Teachers" (Guru & Asatidz)
      if (Array.isArray(data.teachers) && data.teachers.length > 0) {
        let shTeachers = ss.getSheetByName('Teachers');
        if (!shTeachers) shTeachers = ss.insertSheet('Teachers');
        shTeachers.clear();
        shTeachers.appendRow(['id', 'name', 'role', 'specialty', 'education', 'imageUrl']);
        data.teachers.forEach(t => {
          shTeachers.appendRow([t.id || '', t.name || '', t.role || '', t.specialty || '', t.education || '', t.imageUrl || '']);
        });
        shTeachers.getRange('A1:F1').setFontWeight('bold').setBackground('#fef3c7');
      }

      // D. Sinkronkan Lembar "Facilities" (Fasilitas)
      if (Array.isArray(data.facilities) && data.facilities.length > 0) {
        let shFac = ss.getSheetByName('Facilities');
        if (!shFac) shFac = ss.insertSheet('Facilities');
        shFac.clear();
        shFac.appendRow(['id', 'name', 'category', 'imageUrl', 'description', 'specs']);
        data.facilities.forEach(f => {
          const specStr = Array.isArray(f.specs) ? f.specs.join(', ') : (f.specs || '');
          shFac.appendRow([f.id || '', f.name || '', f.category || '', f.imageUrl || '', f.description || '', specStr]);
        });
        shFac.getRange('A1:F1').setFontWeight('bold').setBackground('#e0e7ff');
      }

      // E. Sinkronkan Lembar "News" (Berita)
      if (Array.isArray(data.news) && data.news.length > 0) {
        let shNews = ss.getSheetByName('News');
        if (!shNews) shNews = ss.insertSheet('News');
        shNews.clear();
        shNews.appendRow(['id', 'title', 'summary', 'content', 'date', 'author', 'imageUrl', 'category']);
        data.news.forEach(n => {
          shNews.appendRow([n.id || '', n.title || '', n.summary || '', n.content || '', n.date || '', n.author || '', n.imageUrl || '', n.category || '']);
        });
        shNews.getRange('A1:H1').setFontWeight('bold').setBackground('#ecfdf5');
      }

      // F. Sinkronkan Lembar "Announcements" (Pengumuman)
      if (Array.isArray(data.announcements) && data.announcements.length > 0) {
        let shAnn = ss.getSheetByName('Announcements');
        if (!shAnn) shAnn = ss.insertSheet('Announcements');
        shAnn.clear();
        shAnn.appendRow(['id', 'title', 'content', 'date', 'category', 'isActive']);
        data.announcements.forEach(a => {
          shAnn.appendRow([a.id || '', a.title || '', a.content || '', a.date || '', a.category || '', a.isActive !== false ? 'Ya' : 'Tidak']);
        });
        shAnn.getRange('A1:F1').setFontWeight('bold').setBackground('#fdf4ff');
      }

      // G. Sinkronkan Lembar "Events" (Agenda)
      if (Array.isArray(data.events) && data.events.length > 0) {
        let shEv = ss.getSheetByName('Events');
        if (!shEv) shEv = ss.insertSheet('Events');
        shEv.clear();
        shEv.appendRow(['id', 'title', 'date', 'time', 'location', 'description', 'category']);
        data.events.forEach(ev => {
          shEv.appendRow([ev.id || '', ev.title || '', ev.date || '', ev.time || '', ev.location || '', ev.description || '', ev.category || '']);
        });
        shEv.getRange('A1:G1').setFontWeight('bold').setBackground('#fff7ed');
      }

      // H. Sinkronkan Lembar "Gallery" (Galeri)
      if (Array.isArray(data.gallery) && data.gallery.length > 0) {
        let shGal = ss.getSheetByName('Gallery');
        if (!shGal) shGal = ss.insertSheet('Gallery');
        shGal.clear();
        shGal.appendRow(['id', 'title', 'category', 'imageUrl', 'date']);
        data.gallery.forEach(g => {
          shGal.appendRow([g.id || '', g.title || '', g.category || '', g.imageUrl || '', g.date || '']);
        });
        shGal.getRange('A1:E1').setFontWeight('bold').setBackground('#f1f5f9');
      }

      return createJsonResponse({
        success: true,
        message: 'Data CMS & Lembar Spreadsheet (Settings, Teachers, Facilities, News, dll) berhasil diperbarui!'
      });
    }

    // 3. Simpan Pendaftaran Santri Baru (PPDB)
    if (action === 'save_ppdb') {
      let sheet = ss.getSheetByName('PPDB');
      if (!sheet) {
        sheet = ss.insertSheet('PPDB');
        sheet.appendRow([
          'id', 'registrationNumber', 'studentName', 'nickname', 'gender',
          'birthPlace', 'birthDate', 'track', 'parentName', 'parentPhone',
          'parentEmail', 'address', 'previousSchool', 'quranMemorization',
          'status', 'registrationDate', 'documentDriveUrl', 'notes'
        ]);
      }

      let driveUrl = '';
      if (contents.fileData && contents.fileName) {
        try {
          const folder = getUploadFolder();
          const decoded = Utilities.base64Decode(contents.fileData.split(',')[1] || contents.fileData);
          const blob = Utilities.newBlob(decoded, contents.fileMime || 'application/pdf', contents.fileName);
          const file = folder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          driveUrl = file.getUrl();
        } catch (fileErr) {
          driveUrl = 'Upload error: ' + fileErr.toString();
        }
      }

      const p = contents.data;
      sheet.appendRow([
        p.id || Utilities.getUuid(),
        p.registrationNumber,
        p.studentName,
        p.nickname || '',
        p.gender,
        p.birthPlace || '',
        p.birthDate || '',
        p.track,
        p.parentName,
        p.parentPhone,
        p.parentEmail || '',
        p.address || '',
        p.previousSchool || '',
        p.quranMemorization || '',
        p.status || 'Menunggu',
        p.registrationDate || new Date().toISOString(),
        driveUrl || p.documentDriveUrl || '',
        p.notes || ''
      ]);

      return createJsonResponse({ success: true, message: 'Data PPDB berhasil disimpan', driveUrl: driveUrl });
    }

    // 4. Simpan Konfirmasi Infaq & Donasi
    if (action === 'save_infaq') {
      let sheet = ss.getSheetByName('Infaq');
      if (!sheet) {
        sheet = ss.insertSheet('Infaq');
        sheet.appendRow(['id', 'donorName', 'phone', 'program', 'amount', 'bankDestination', 'transferDate', 'prayerNotes', 'createdAt']);
      }
      const infaq = contents.data;
      sheet.appendRow([
        infaq.id || Utilities.getUuid(),
        infaq.donorName,
        infaq.phone,
        infaq.program,
        infaq.amount,
        infaq.bankDestination,
        infaq.transferDate,
        infaq.prayerNotes || '',
        infaq.createdAt || new Date().toISOString()
      ]);
      return createJsonResponse({ success: true, message: 'Konfirmasi infaq berhasil disimpan' });
    }

    return createJsonResponse({ success: false, error: 'Aksi tidak dikenali: ' + action });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
}

export const APPS_SCRIPT_CODE = getAppsScriptCode();
