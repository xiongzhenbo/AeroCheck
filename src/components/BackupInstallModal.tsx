import React, { useRef, useState } from 'react';
import { Download, RotateCcw, Smartphone, Upload, X } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ChecklistTemplate } from '../types/checklist';
import { PWAInstallButton } from './PWAInstallButton';

interface BackupInstallModalProps {
  language: Language;
  isOpen: boolean;
  checklists: ChecklistTemplate[];
  onClose: () => void;
  onImportChecklists: (imported: ChecklistTemplate[]) => void;
  onRestoreDefaults: () => void;
}

export const BackupInstallModal: React.FC<BackupInstallModalProps> = ({
  language,
  isOpen,
  checklists,
  onClose,
  onImportChecklists,
  onRestoreDefaults,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );
  const [confirmResetDefaults, setConfirmResetDefaults] = useState(false);

  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleExport = () => {
    const payload = JSON.stringify(checklists, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `aerocheck-checklists-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ type: 'ok', text: t.exportSuccess(checklists.length) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) {
          throw new Error('Invalid format');
        }
        const sanitized: ChecklistTemplate[] = parsed
          .filter((c) => c && typeof c.name === 'string' && Array.isArray(c.items))
          .map((c, idx) => ({
            id: typeof c.id === 'string' ? c.id : `imp-${Date.now()}-${idx}`,
            name: c.name,
            code: typeof c.code === 'string' ? c.code : 'CHK',
            aircraftModel: typeof c.aircraftModel === 'string' ? c.aircraftModel : '',
            description: typeof c.description === 'string' ? c.description : '',
            updatedAt: new Date().toISOString(),
            items: c.items
              .filter(
                (item: unknown) => item && typeof (item as { title?: unknown }).title === 'string'
              )
              .map(
                (
                  item: { id?: string; title: string; spec?: string; zone?: string },
                  iIdx: number
                ) => ({
                  id: typeof item.id === 'string' ? item.id : `imp-item-${Date.now()}-${iIdx}`,
                  title: item.title,
                  spec: typeof item.spec === 'string' ? item.spec : '',
                  zone: typeof item.zone === 'string' ? item.zone : '',
                  checked: false,
                })
              ),
          }));

        if (sanitized.length === 0) {
          throw new Error('No valid checklists found');
        }
        onImportChecklists(sanitized);
        setStatusMessage({ type: 'ok', text: t.importSuccess(sanitized.length) });
      } catch {
        setStatusMessage({ type: 'err', text: t.importError });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#131A23] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 sm:hidden shrink-0" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {t.backupTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto pb-safe">
          {statusMessage && (
            <div
              className={`rounded-xl px-4 py-3 text-xs font-medium border ${
                statusMessage.type === 'ok'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500/40 text-rose-800 dark:text-rose-300'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] p-4 space-y-3">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.installSectionTitle}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.installSectionDesc}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <PWAInstallButton language={language} showFallbackGuide />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.backupSectionTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161E29] text-slate-800 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span>{t.exportBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161E29] text-slate-800 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-sky-500" />
                <span>{t.importBtn}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </section>

          <section className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t.restoreDefaultsDesc}
            </div>
            {!confirmResetDefaults ? (
              <button
                type="button"
                onClick={() => setConfirmResetDefaults(true)}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.restoreDefaultsBtn}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onRestoreDefaults();
                    setConfirmResetDefaults(false);
                    setStatusMessage({ type: 'ok', text: t.restoreSuccess });
                  }}
                  className="min-h-[40px] px-3 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-500 cursor-pointer whitespace-nowrap"
                >
                  {t.confirmRestoreDefaults}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetDefaults(false)}
                  className="min-h-[40px] px-2.5 rounded-lg text-xs font-medium text-slate-500 cursor-pointer whitespace-nowrap"
                >
                  {t.cancel}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
