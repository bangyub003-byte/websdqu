import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  RefreshCw,
  Link as LinkIcon,
  Eye,
  CloudCheck
} from 'lucide-react';
import { getOptimizedImageUrl, extractDriveFileId } from '../../utils/imageUtils';

interface ThumbnailUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onUploadFile?: (file: File, label: string) => Promise<void> | void;
  aspectRatio?: 'square' | 'video' | 'banner' | 'avatar';
  fit?: 'contain' | 'cover';
  helperText?: string;
  defaultFallback?: string;
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  label,
  value,
  onChange,
  onUploadFile,
  aspectRatio = 'video',
  fit = 'cover',
  helperText,
  defaultFallback = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Aspect ratio classes
  const aspectClass = {
    square: 'aspect-square max-w-[180px]',
    avatar: 'aspect-square max-w-[140px] rounded-full',
    video: 'aspect-video w-full max-h-[220px]',
    banner: 'aspect-[21/9] w-full max-h-[200px]'
  }[aspectRatio];

  const processFile = async (file: File) => {
    if (!file) return;

    // Tampilkan preview lokal sekejap selagi mengunggah ke Google Drive
    const tempUrl = URL.createObjectURL(file);
    setLocalPreview(tempUrl);
    setPreviewError(false);

    if (onUploadFile) {
      setIsUploading(true);
      try {
        await onUploadFile(file, label);
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setIsUploading(false);
        // Hapus local preview setelah beberapa detik agar memakai URL final dari props
        setTimeout(() => {
          setLocalPreview(null);
          URL.revokeObjectURL(tempUrl);
        }, 1500);
      }
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    }
  };

  const handleCopyUrl = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasImage = Boolean(localPreview || (value && value.trim() !== ''));
  const isDriveUrl = Boolean(extractDriveFileId(value));
  const displayImageSrc = localPreview || getOptimizedImageUrl(value, defaultFallback);

  return (
    <div className="space-y-2.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      {/* Header Label & Actions */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-800" />
          <span>{label}</span>
        </label>
        {hasImage && (
          <div className="flex items-center gap-1.5">
            {isDriveUrl && (
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                <CloudCheck className="w-3 h-3" />
                <span>Google Drive</span>
              </span>
            )}
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Thumbnail Aktif</span>
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Display Box */}
      <div
        className="relative group"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div
          className={`${aspectClass} mx-auto bg-slate-900/5 rounded-2xl border-2 border-dashed ${
            isDragOver
              ? 'border-emerald-600 bg-emerald-50/50 scale-[1.01]'
              : hasImage
              ? 'border-emerald-500/40 bg-slate-950/5'
              : 'border-slate-300 hover:border-emerald-700'
          } overflow-hidden flex items-center justify-center transition-all relative`}
        >
          {hasImage && !previewError ? (
            <img
              src={displayImageSrc}
              alt={label}
              referrerPolicy="no-referrer"
              onError={() => {
                if (!localPreview) {
                  setPreviewError(true);
                }
              }}
              className={`w-full h-full ${
                fit === 'contain' ? 'object-contain p-3' : 'object-cover'
              } transition-transform duration-300 group-hover:scale-[1.02]`}
            />
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="text-center p-4 cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-800 transition-colors w-full h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Pilih / Unggah Foto</p>
                <p className="text-[10px] text-slate-500">Klik atau seret foto ke sini</p>
              </div>
            </div>
          )}

          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-10 animate-in fade-in">
              <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              <p className="text-xs font-bold text-amber-300">Menyimpan ke Google Drive...</p>
              <p className="text-[10px] text-slate-300">Otomatis sinkron ke semua perangkat</p>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{hasImage ? 'Ganti Foto' : 'Unggah Foto'}</span>
          </button>

          {hasImage && (
            <>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                title="Tampilkan URL gambar"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">URL</span>
              </button>

              <a
                href={getOptimizedImageUrl(value)}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Buka gambar di tab baru"
              >
                <Eye className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setLocalPreview(null);
                  if (defaultFallback) {
                    onChange(defaultFallback);
                  } else {
                    onChange('');
                  }
                  setPreviewError(false);
                }}
                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                title="Hapus / Reset Foto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {helperText && (
          <span className="text-[11px] text-slate-600 italic">
            {helperText}
          </span>
        )}
      </div>

      {/* Optional URL Input field for direct copy/paste */}
      {showUrlInput && (
        <div className="pt-2 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span>Tautan URL Gambar:</span>
            {copied && <span className="text-emerald-600 font-bold">✓ Tersalin!</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={value}
              onChange={e => {
                onChange(e.target.value);
                setPreviewError(false);
              }}
              placeholder="https://... atau tempel tautan Google Drive"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] font-mono bg-white text-slate-900"
            />
            <button
              type="button"
              onClick={handleCopyUrl}
              className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold shrink-0"
            >
              Salin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
