import React from 'react';
import {
  Users,
  Sparkles,
  GraduationCap,
  Award,
  BookOpen,
  Target,
  Trophy,
  Heart,
  HeartHandshake,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  Building2,
  Compass,
  Star,
  Bookmark,
  Sun,
  Flame,
  Check,
  Smile,
  BadgeCheck
} from 'lucide-react';

export interface IconOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ICON_OPTIONS: IconOption[] = [
  { id: 'book-open', name: 'Al-Qur\'an / Buku', icon: BookOpen },
  { id: 'target', name: 'Target Capaian', icon: Target },
  { id: 'award', name: 'Prestasi / Medali', icon: Award },
  { id: 'trophy', name: 'Piala Kejuaraan', icon: Trophy },
  { id: 'graduation-cap', name: 'Kelulusan / Asatidz', icon: GraduationCap },
  { id: 'users', name: 'Santri / Jama\'ah', icon: Users },
  { id: 'heart', name: 'Ikhlas / Kasih Sayang', icon: Heart },
  { id: 'heart-handshake', name: 'Ukhuwah / Adab', icon: HeartHandshake },
  { id: 'clock', name: 'Waktu / Kedisiplinan', icon: Clock },
  { id: 'shield-check', name: 'Amanah / Terjaga', icon: ShieldCheck },
  { id: 'badge-check', name: 'Sertifikasi / Sanad', icon: BadgeCheck },
  { id: 'compass', name: 'Arah / Visi', icon: Compass },
  { id: 'star', name: 'Bintang Prestasi', icon: Star },
  { id: 'bookmark', name: 'Penanda Tilawah', icon: Bookmark },
  { id: 'building', name: 'Gedung / Kampus', icon: Building },
  { id: 'sun', name: 'Cahaya / Pagi', icon: Sun },
  { id: 'smile', name: 'Ramah Santri', icon: Smile },
  { id: 'check-circle-2', name: 'Tuntas Mutqin', icon: CheckCircle2 },
  { id: 'calendar', name: 'Jadwal Agenda', icon: Calendar },
  { id: 'sparkles', name: 'Keistimewaan', icon: Sparkles }
];

export const getIconComponent = (iconId?: string, fallbackId: string = 'target'): React.ComponentType<{ className?: string }> => {
  const selected = ICON_OPTIONS.find(opt => opt.id === (iconId || fallbackId));
  if (selected) return selected.icon;
  const fallback = ICON_OPTIONS.find(opt => opt.id === fallbackId);
  return fallback ? fallback.icon : Target;
};

interface IconPickerProps {
  label?: string;
  value?: string;
  onChange: (iconId: string) => void;
  fallbackId?: string;
  compact?: boolean;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  label = 'Pilih Ikon',
  value,
  onChange,
  fallbackId = 'target',
  compact = false
}) => {
  const currentIconId = value || fallbackId;
  const CurrentIcon = getIconComponent(currentIconId, fallbackId);
  const currentOption = ICON_OPTIONS.find(opt => opt.id === currentIconId);

  return (
    <div className="space-y-1.5">
      {label && <label className="text-[11px] font-bold text-slate-700 block">{label}</label>}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-900 text-emerald-200 flex items-center justify-center shrink-0 border border-emerald-800 shadow-2xs">
          <CurrentIcon className="w-5 h-5" />
        </div>
        <select
          value={currentIconId}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-800 font-medium ${
            compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs'
          }`}
        >
          {ICON_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
