import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, RefreshCw, Calendar, Users } from 'lucide-react';
import { dataService } from '../../services/dataService';

export const VisitorAnalyticsCard: React.FC = () => {
  const [rangeType, setRangeType] = useState<'1' | '3' | '7' | '10' | '15' | '20' | 'custom'>('7');
  const [customDays, setCustomDays] = useState<number>(30);
  const [analyticsData, setAnalyticsData] = useState<{ date: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getAnalytics();
      setAnalyticsData(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (e) {
      console.warn('Gagal memuat analitik:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Hitung jumlah hari aktif yang dipilih
  const effectiveDays = useMemo(() => {
    if (rangeType === 'custom') {
      return Math.max(1, Math.min(customDays || 30, 90));
    }
    return parseInt(rangeType, 10);
  }, [rangeType, customDays]);

  // Siapkan data per tanggal untuk N hari terakhir
  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    (analyticsData || []).forEach(item => {
      if (item && item.date) {
        // Normalisasi format tanggal YYYY-MM-DD
        const dStr = String(item.date).split('T')[0].trim();
        const existing = map.get(dStr) || 0;
        map.set(dStr, existing + (Number(item.count) || 0));
      }
    });

    const result: { dateStr: string; label: string; count: number }[] = [];
    const now = new Date();

    for (let i = effectiveDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;

      const count = map.get(key) || 0;
      const label = d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: effectiveDays > 10 ? 'numeric' : 'short'
      });

      result.push({
        dateStr: key,
        label,
        count
      });
    }

    return result;
  }, [analyticsData, effectiveDays]);

  const totalVisitors = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  const maxCount = useMemo(() => {
    const max = Math.max(...chartData.map(d => d.count), 0);
    return max > 0 ? max : 5; // default scale
  }, [chartData]);

  const averageDaily = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.round((totalVisitors / chartData.length) * 10) / 10;
  }, [chartData, totalVisitors]);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center shadow-xs shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Statistik Kunjungan Website
              </h3>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Data Realtime
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Jumlah kunjungan pengunjung pada halaman publik (dicatat 1x per sesi kunjungan).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {lastUpdated && (
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              Update: {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-900 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Muat ulang statistik"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Memuat...' : 'Segarkan'}</span>
          </button>
        </div>
      </div>

      {/* Filter Rentang Waktu (Chips / Tombol Pilihan) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Rentang Waktu:</span>
        </span>
        {(['1', '3', '7', '10', '15', '20', 'custom'] as const).map(type => {
          const isSelected = rangeType === type;
          const label = type === 'custom' ? 'Kustom' : `${type} Hari`;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setRangeType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          );
        })}

        {rangeType === 'custom' && (
          <div className="flex items-center gap-1.5 ml-1">
            <input
              type="number"
              min={1}
              max={90}
              value={customDays}
              onChange={e => setCustomDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-16 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 text-center focus:ring-2 focus:ring-emerald-800"
            />
            <span className="text-xs text-slate-500 font-semibold">hari (maks 90)</span>
          </div>
        )}
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Total Kunjungan ({effectiveDays} Hari)
          </span>
          <div className="text-2xl font-black text-emerald-950 flex items-baseline gap-1.5">
            <span>{totalVisitors.toLocaleString('id-ID')}</span>
            <span className="text-xs font-semibold text-emerald-700">sesi</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            Rata-rata Kunjungan
          </span>
          <div className="text-2xl font-black text-amber-950 flex items-baseline gap-1.5">
            <span>{averageDaily.toLocaleString('id-ID')}</span>
            <span className="text-xs font-semibold text-amber-700">/ hari</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
            Puncak Tertinggi
          </span>
          <div className="text-2xl font-black text-slate-800 flex items-baseline gap-1.5">
            <span>{Math.max(...chartData.map(d => d.count), 0).toLocaleString('id-ID')}</span>
            <span className="text-xs font-semibold text-slate-500">sesi</span>
          </div>
        </div>
      </div>

      {/* Visual Chart (SVG Bar Chart Dinamis) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
          <span>Kunjungan per Hari</span>
          <span>Skala Maks: {maxCount}</span>
        </div>

        <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60">
          {chartData.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Belum ada data kunjungan yang tercatat.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Area Bar Grafik Berdiri */}
              <div className="h-44 sm:h-52 flex items-end gap-1 sm:gap-2 px-1 pb-2 border-b border-slate-200">
                {chartData.map((item, idx) => {
                  const heightPercent = maxCount > 0 ? Math.max((item.count / maxCount) * 100, item.count > 0 ? 8 : 2) : 2;
                  const isZero = item.count === 0;

                  return (
                    <div
                      key={item.dateStr || idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip Hover */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                        <div className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg border border-slate-700">
                          <div>{item.dateStr}</div>
                          <div className="text-amber-400 font-extrabold">{item.count} Kunjungan</div>
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1"></div>
                      </div>

                      {/* Angka di atas Bar jika muat */}
                      {chartData.length <= 15 && item.count > 0 && (
                        <span className="text-[10px] font-bold text-slate-600 mb-1">
                          {item.count}
                        </span>
                      )}

                      {/* Batang Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                          isZero
                            ? 'bg-slate-200/70 hover:bg-slate-300'
                            : 'bg-emerald-700 hover:bg-emerald-600 shadow-2xs group-hover:scale-y-105 origin-bottom'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Label Sumbu X (Tanggal) */}
              <div className="flex items-center gap-1 sm:gap-2 px-1">
                {chartData.map((item, idx) => {
                  // Jika data banyak (misal > 10 hari), tampilkan label secara berselang agar tidak berantakan
                  const showLabel =
                    chartData.length <= 10 ||
                    idx === 0 ||
                    idx === chartData.length - 1 ||
                    (chartData.length <= 20 && idx % 2 === 0) ||
                    (chartData.length > 20 && idx % 5 === 0);

                  return (
                    <div
                      key={`label-${item.dateStr || idx}`}
                      className="flex-1 text-center text-[10px] text-slate-500 font-mono truncate"
                      title={item.dateStr}
                    >
                      {showLabel ? item.label : '·'}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
