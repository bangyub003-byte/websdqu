import React, { useState } from 'react';
import { SchoolSettings, SPMBStepItem, FAQItem } from '../../types';
import {
  FileText,
  CheckCircle2,
  HelpCircle,
  Plus,
  Trash2,
  Save,
  Check,
  ExternalLink
} from 'lucide-react';

interface AdminSpmbTabProps {
  settings: SchoolSettings;
  onUpdateSettings: (newSettings: SchoolSettings) => void;
  requestDelete: (title: string, message: string, onConfirm: () => void) => void;
  settingsSaved: boolean;
  onSave: (e: React.FormEvent) => void;
}

export const AdminSpmbTab: React.FC<AdminSpmbTabProps> = ({
  settings,
  onUpdateSettings,
  requestDelete,
  settingsSaved,
  onSave
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'iframe' | 'steps' | 'requirements' | 'faqs'>('iframe');

  return (
    <form onSubmit={onSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="text-base font-bold text-slate-900">
              Kelola Alur, Syarat &amp; FAQ SPMB Online
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sesuaikan tautan portal pendaftaran Netlify, langkah alur pendaftaran santri baru, syarat dokumen fisik, dan tanya jawab (FAQ).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {settingsSaved && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Tersimpan!</span>
            </span>
          )}
          <button
            type="submit"
            className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Container Layout: Sidebar Kiri + Konten Kanan */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Navigasi Sub-Bab Kiri */}
        <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
            Sub-Bab SPMB
          </div>
          {[
            { id: 'iframe', label: '1. Iframe Portal PSB', desc: 'Embed formulir pendaftaran Netlify' },
            { id: 'steps', label: `2. Alur Pendaftaran (${settings.spmbSteps?.length || 0})`, desc: 'Langkah registrasi hingga masuk' },
            { id: 'requirements', label: `3. Syarat & Berkas (${settings.spmbRequirements?.length || 0})`, desc: 'Dokumen fisik & administrasi' },
            { id: 'faqs', label: `4. Tanya Jawab FAQ (${settings.spmbFaqs?.length || 0})`, desc: 'Pertanyaan umum wali murid' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col ${
                activeSubTab === tab.id
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-normal mt-0.5 ${activeSubTab === tab.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Panel Konten Kanan */}
        <div className="flex-1 min-w-0 w-full space-y-6">

      {/* SUBTAB 1: IFRAME PORTAL PSB */}
      {activeSubTab === 'iframe' && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-800" />
            <span>Tautan Formulir Pendaftaran PSB Online</span>
          </h4>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">URL Portal Formulir PSB (Netlify)</label>
            <input
              type="url"
              value={settings.psbIframeUrl || ''}
              onChange={e => onUpdateSettings({ ...settings, psbIframeUrl: e.target.value })}
              placeholder="https://psb-sdqu-alitisham.netlify.app"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:ring-2 focus:ring-emerald-800"
            />
            <p className="text-[11px] text-slate-500">
              Formulir PSB ini akan dimuat secara mulus di dalam halaman website dan dapat diakses layar penuh oleh calon wali santri.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <a
              href={settings.psbIframeUrl || "https://psb-sdqu-alitisham.netlify.app"}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-900 hover:text-emerald-800 flex items-center gap-1.5 underline"
            >
              <span>Uji Buka Formulir PSB</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ALUR PENDAFTARAN */}
      {activeSubTab === 'steps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Tahapan Alur Pendaftaran Santri Baru
              </h4>
              <p className="text-xs text-slate-500">
                Langkah-langkah yang harus dilalui calon santri dan orang tua dari formulir hingga daftar ulang.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextStepNum = (settings.spmbSteps?.length || 0) + 1;
                const newItem: SPMBStepItem = {
                  id: 'step-' + Date.now(),
                  stepNumber: nextStepNum,
                  title: `Langkah ${nextStepNum}`,
                  description: 'Keterangan tahapan pendaftaran santri baru.'
                };
                onUpdateSettings({
                  ...settings,
                  spmbSteps: [...(settings.spmbSteps || []), newItem]
                });
              }}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Langkah Alur</span>
            </button>
          </div>

          <div className="space-y-3">
            {(settings.spmbSteps || []).map((st, idx) => (
              <div key={st.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-900 text-white font-bold text-xs flex items-center justify-center">
                      {st.stepNumber || idx + 1}
                    </span>
                    <input
                      type="text"
                      value={st.title}
                      onChange={e => {
                        const updated = [...(settings.spmbSteps || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        onUpdateSettings({ ...settings, spmbSteps: updated });
                      }}
                      className="font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white w-full max-w-sm"
                      placeholder="Judul Tahapan"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      requestDelete('Hapus Tahapan SPMB', `Hapus "${st.title}"?`, () => {
                        const updated = settings.spmbSteps?.filter((_, i) => i !== idx);
                        onUpdateSettings({ ...settings, spmbSteps: updated });
                      });
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={st.description}
                  onChange={e => {
                    const updated = [...(settings.spmbSteps || [])];
                    updated[idx] = { ...updated[idx], description: e.target.value };
                    onUpdateSettings({ ...settings, spmbSteps: updated });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  placeholder="Uraian kegiatan pada tahapan ini..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SYARAT & BERKAS */}
      {activeSubTab === 'requirements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Syarat &amp; Dokumen Kelengkapan Berkas
              </h4>
              <p className="text-xs text-slate-500">
                Daftar dokumen fisik yang harus diserahkan orang tua saat observasi.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const updated = [...(settings.spmbRequirements || []), 'Fotokopi berkas kelengkapan baru (2 lembar)'];
                onUpdateSettings({ ...settings, spmbRequirements: updated });
              }}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Syarat Dokumen</span>
            </button>
          </div>

          <div className="space-y-2">
            {(settings.spmbRequirements || []).map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                <input
                  type="text"
                  value={req}
                  onChange={e => {
                    const updated = [...(settings.spmbRequirements || [])];
                    updated[idx] = e.target.value;
                    onUpdateSettings({ ...settings, spmbRequirements: updated });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = settings.spmbRequirements?.filter((_, i) => i !== idx);
                    onUpdateSettings({ ...settings, spmbRequirements: updated });
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: FAQS */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Tanya Jawab Seputar SPMB (FAQ)
              </h4>
              <p className="text-xs text-slate-500">
                Pertanyaan umum yang sering ditanyakan orang tua dan jawaban resmi panitia.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newItem: FAQItem = {
                  id: 'faq-' + Date.now(),
                  question: 'Pertanyaan baru seputar pendaftaran?',
                  answer: 'Jawaban detail dan jelas dari pihak madrasah.'
                };
                onUpdateSettings({
                  ...settings,
                  spmbFaqs: [...(settings.spmbFaqs || []), newItem]
                });
              }}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pertanyaan FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {(settings.spmbFaqs || []).map((faq, idx) => (
              <div key={faq.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <HelpCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                    <input
                      type="text"
                      value={faq.question}
                      onChange={e => {
                        const updated = [...(settings.spmbFaqs || [])];
                        updated[idx] = { ...updated[idx], question: e.target.value };
                        onUpdateSettings({ ...settings, spmbFaqs: updated });
                      }}
                      className="w-full font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      placeholder="Pertanyaan FAQ..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      requestDelete('Hapus FAQ', 'Hapus pertanyaan ini?', () => {
                        const updated = settings.spmbFaqs?.filter((_, i) => i !== idx);
                        onUpdateSettings({ ...settings, spmbFaqs: updated });
                      });
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={e => {
                    const updated = [...(settings.spmbFaqs || [])];
                    updated[idx] = { ...updated[idx], answer: e.target.value };
                    onUpdateSettings({ ...settings, spmbFaqs: updated });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white leading-relaxed"
                  placeholder="Jawaban resmi..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-[11px] text-slate-500">
          *Pastikan untuk menekan tombol "Simpan Perubahan" setelah mengedit data.
        </span>

        <button
          type="submit"
          className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Alur &amp; SPMB</span>
        </button>
      </div>

    </form>
  );
};
