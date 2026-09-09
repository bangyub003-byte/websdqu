import React, { useState } from 'react';

/**
 * Utilitas Gambar & Thumbnail SD Qur'an Unggulan Al I'tisham
 * Menjamin gambar Google Drive, Unsplash, CDN, atau Data URI tampil sempurna
 * di SEMUA perangkat (HP Android, iPhone, Laptop, Tablet, Vercel)
 * tanpa diblokir oleh kebijakan referer Google.
 */

/**
 * Mengekstrak Google Drive File ID dari berbagai format URL
 */
export function extractDriveFileId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();

  // Pola 1: /file/d/FILE_ID
  const m1 = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1 && m1[1]) return m1[1];

  // Pola 2: lh3.googleusercontent.com/d/FILE_ID
  const m2 = clean.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (m2 && m2[1]) return m2[1];

  // Pola 3: id=FILE_ID
  const m3 = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m3 && m3[1]) return m3[1];

  // Pola 4: drive.google.com/thumbnail?id=FILE_ID
  const m4 = clean.match(/drive\.google\.com\/thumbnail\?.*?id=([a-zA-Z0-9_-]+)/);
  if (m4 && m4[1]) return m4[1];

  return null;
}

/**
 * Menghasilkan URL gambar yang siap dirender di browser mana pun.
 * Menggunakan thumbnail CDN Google Drive resmi yang paling stabil
 * dan tidak memerlukan otentikasi login.
 */
export function getOptimizedImageUrl(url?: string | null, fallback = ''): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const clean = url.trim();

  // Jika berupa blob URL dari perangkat lain atau sesi lampau yang sudah invalid
  if (clean.startsWith('blob:')) {
    // Pada perangkat lain, blob URL tidak bisa dibuka. Gunakan fallback jika ada.
    return clean;
  }

  // Cek apakah ini Google Drive ID / Link
  const fileId = extractDriveFileId(clean);
  if (fileId) {
    // Google Drive direct thumbnail CDN - resmi, cepat, dan selalu bekerja di lintas perangkat
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }

  return clean;
}

/**
 * Khusus untuk thumbnail kecil (misal avatar, icon daftar fasilitas/kegiatan)
 */
export function getSmallThumbnailUrl(url?: string | null, fallback = ''): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const clean = url.trim();
  const fileId = extractDriveFileId(clean);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
  }

  return clean;
}

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

/**
 * Komponen Image Aman yang otomatis:
 * 1. Mengoptimalkan link Google Drive
 * 2. Menyertakan referrerPolicy="no-referrer" agar Google CDN tidak memblokir (Anti-403)
 * 3. Menangani error secara otomatis ke gambar cadangan
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
  onError,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const optimized = getOptimizedImageUrl(src, fallbackSrc);
  const displaySrc = hasError ? fallbackSrc : (optimized || fallbackSrc);

  return (
    <img
      src={displaySrc}
      alt={alt || 'Foto SDQU Al I\'tisham'}
      className={className}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={(e) => {
        if (!hasError && fallbackSrc) {
          setHasError(true);
        }
        if (onError) {
          onError(e);
        }
      }}
      {...rest}
    />
  );
};
