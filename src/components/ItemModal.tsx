import React, { useEffect, useState } from 'react';
import { ListPlus, Plus, X } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ChecklistItem } from '../types/checklist';

interface ItemModalProps {
  language: Language;
  isOpen: boolean;
  editingItem: ChecklistItem | null;
  checklistName: string;
  onClose: () => void;
  onSaveSingle: (
    data: { title: string; spec: string; zone: string },
    keepOpen: boolean
  ) => void;
  onBatchAdd: (items: Array<{ title: string; spec: string; zone: string }>) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  language,
  isOpen,
  editingItem,
  checklistName,
  onClose,
  onSaveSingle,
  onBatchAdd,
}) => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [title, setTitle] = useState('');
  const [spec, setSpec] = useState('');
  const [zone, setZone] = useState('');
  const [batchText, setBatchText] = useState('');
  const [savedNotice, setSavedNotice] = useState('');

  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (isOpen) {
      setSavedNotice('');
      if (editingItem) {
        setMode('single');
        setTitle(editingItem.title);
        setSpec(editingItem.spec);
        setZone(editingItem.zone || '');
      } else {
        setTitle('');
        setSpec('');
        setZone('');
        setBatchText('');
      }
    }
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleSingleSubmit = (keepOpen: boolean) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onSaveSingle(
      {
        title: trimmedTitle,
        spec: spec.trim(),
        zone: zone.trim(),
      },
      keepOpen
    );
    if (keepOpen) {
      setTitle('');
      setSpec('');
      setZone('');
      setSavedNotice(t.addedNotice(trimmedTitle));
    }
  };

  const parsedBatchLines = batchText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[|｜]/).map((p) => p.trim());
      if (parts.length >= 3) {
        return { zone: parts[0], title: parts[1], spec: parts.slice(2).join(' ') };
      }
      if (parts.length === 2) {
        return { title: parts[0], spec: parts[1], zone: '' };
      }
      return { title: line, spec: '', zone: '' };
    });

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedBatchLines.length === 0) return;
    onBatchAdd(parsedBatchLines);
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
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
              {editingItem ? t.editItemTitle : t.addItemTitle(checklistName)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!editingItem && (
          <div className="px-5 pt-4">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`min-h-[38px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  mode === 'single'
                    ? 'bg-white dark:bg-[#1C2531] text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.singleEntryTab}</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('batch')}
                className={`min-h-[38px] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  mode === 'batch'
                    ? 'bg-white dark:bg-[#1C2531] text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span>{t.batchImportTab}</span>
              </button>
            </div>
          </div>
        )}

        {mode === 'single' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSingleSubmit(false);
            }}
            className="p-5 space-y-4 overflow-y-auto"
          >
            {savedNotice && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 px-3.5 py-2.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                {savedNotice}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                {t.itemTitleLabel}
              </label>
              <input
                type="text"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.itemTitlePlaceholder}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                {t.itemSpecLabel}
              </label>
              <textarea
                rows={2}
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                placeholder={t.itemSpecPlaceholder}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                {t.itemZoneLabel}
              </label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder={t.itemZonePlaceholder}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 pb-safe">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                {savedNotice ? t.done : t.cancel}
              </button>
              {!editingItem && (
                <button
                  type="button"
                  disabled={!title.trim()}
                  onClick={() => handleSingleSubmit(true)}
                  className="min-h-[44px] px-4 rounded-xl border border-emerald-600/50 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.saveAndAddAnother}
                </button>
              )}
              <button
                type="submit"
                disabled={!title.trim()}
                className="min-h-[44px] px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-40 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                {editingItem ? t.saveChanges : t.addItemSubmit}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleBatchSubmit} className="p-5 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                {t.batchLabel}
              </label>
              <textarea
                rows={7}
                autoFocus
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder={t.batchPlaceholder}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono leading-relaxed"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
                {t.batchRecognized(parsedBatchLines.length)}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 pb-safe">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={parsedBatchLines.length === 0}
                className="min-h-[44px] px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-40 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                {t.batchSubmit(parsedBatchLines.length)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
