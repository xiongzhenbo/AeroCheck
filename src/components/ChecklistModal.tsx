import React, { useEffect, useState } from 'react';
import { Copy, Trash2, X } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ChecklistTemplate } from '../types/checklist';

interface ChecklistModalProps {
  language: Language;
  isOpen: boolean;
  editingChecklist: ChecklistTemplate | null;
  canDelete: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    code: string;
    aircraftModel: string;
    description: string;
  }) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  language,
  isOpen,
  editingChecklist,
  canDelete,
  onClose,
  onSave,
  onDuplicate,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [aircraftModel, setAircraftModel] = useState('');
  const [description, setDescription] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (isOpen) {
      if (editingChecklist) {
        setName(editingChecklist.name);
        setCode(editingChecklist.code);
        setAircraftModel(editingChecklist.aircraftModel || '');
        setDescription(editingChecklist.description || '');
      } else {
        setName('');
        setCode('');
        setAircraftModel('');
        setDescription('');
      }
      setConfirmDelete(false);
    }
  }, [isOpen, editingChecklist]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const finalCode = (code.trim() || trimmedName.slice(0, 2)).toUpperCase().slice(0, 6);
    onSave({
      name: trimmedName,
      code: finalCode,
      aircraftModel: aircraftModel.trim(),
      description: description.trim(),
    });
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
            {editingChecklist ? t.editChecklistTitle : t.newChecklistTitle}
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                {t.checklistNameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.checklistNamePlaceholder}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                {t.checklistCodeLabel}
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={t.checklistCodePlaceholder}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] px-3.5 text-sm font-mono-tabular uppercase text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t.aircraftModelLabel}
            </label>
            <input
              type="text"
              value={aircraftModel}
              onChange={(e) => setAircraftModel(e.target.value)}
              placeholder={t.aircraftModelPlaceholder}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t.checklistDescLabel}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.checklistDescPlaceholder}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
            />
          </div>

          {editingChecklist && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              {onDuplicate && (
                <button
                  type="button"
                  onClick={() => onDuplicate(editingChecklist.id)}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.duplicateBtn}</span>
                </button>
              )}

              {onDelete && canDelete && (
                <div>
                  {!confirmDelete ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.deleteTypeBtn}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDelete(editingChecklist.id)}
                        className="min-h-[40px] px-3 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 cursor-pointer whitespace-nowrap"
                      >
                        {t.confirmDeleteType(editingChecklist.items.length)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="min-h-[40px] px-2.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer whitespace-nowrap"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
              className="min-h-[44px] px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              {editingChecklist ? t.saveChanges : t.createChecklist}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
