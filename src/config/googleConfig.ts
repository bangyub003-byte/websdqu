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
export const APPS_SCRIPT_CODE = `/**
 * BACKEND API GOOGLE APPS SCRIPT
 * SD QUR'AN UNGGULAN AL I'TISHAM PLAYEN
 *
 * Spreadsheet ID: 1JHMBdolxzEDbDEzjwsFDktXKjvEuYSImxEeOFYayOxk
 * Drive Folder ID: 1cp8ej7I7lQ5K157O4aaVos0tuJqnUQME
 */

const SPREADSHEET_ID = "${GOOGLE_CONFIG.SPREADSHEET_ID}";
const DRIVE_FOLDER_ID = "${GOOGLE_CONFIG.DRIVE_FOLDER_ID}";

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // 1. Unggah Gambar / Logo Langsung ke Google Drive Sekolah (Publik CDN)
    if (action === 'upload_image') {
      if (!contents.fileData || !contents.fileName) {
        return createJsonResponse({ success: false, error: 'fileData dan fileName diperlukan' });
      }
      try {
        const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
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

    // 2. Simpan Perubahan CMS (Pengaturan, Logo, Guru, Fasilitas, Berita, dll)
    if (action === 'save_cms') {
      let sheet = ss.getSheetByName('CMS_Data');
      if (!sheet) {
        sheet = ss.insertSheet('CMS_Data');
        sheet.appendRow(['key', 'value', 'updatedAt']);
      }
      const payloadStr = JSON.stringify(contents.data);
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 3).clearContent();
      }
      sheet.getRange(2, 1, 1, 3).setValues([['FULL_CMS_STATE', payloadStr, new Date().toISOString()]]);
      return createJsonResponse({ success: true, message: 'Data CMS berhasil disimpan ke Google Spreadsheet' });
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
          const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
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
