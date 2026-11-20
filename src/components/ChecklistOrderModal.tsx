import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpToLine, GripVertical, X } from 'lucide-react';
import { usePointerDragReorder } from '../hooks/usePointerDragReorder';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ChecklistTemplate } from '../types/checklist';

interface ChecklistOrderModalProps {
  language: Language;
  isOpen: boolean;
  checklists: ChecklistTemplate[];
  activeChecklistId: string;
  onClose: () => void;
  onMoveChecklist: (id: string, direction: 'up' | 'down' | 'top') => void;
  onReorderChecklists: (fromIndex: number, toIndex: number) => void;
}

export const ChecklistOrderModal: React.FC<ChecklistOrderModalProps> = ({
  language,
  isOpen,
  checklists,
  activeChecklistId,
  onClose,
  onMoveChecklist,
  onReorderChecklists,
}) => {
  const t = TRANSLATIONS[language];
  const { draggingIndex, registerRow, startDrag } = usePointerDragReorder(
    checklists.length,
    onReorderChecklists
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#131A23] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 sm:hidden shrink-0" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t.orderModalTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.orderModalSub}
            </p>
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

        <div className="p-4 space-y-2 overflow-y-auto">
          {checklists.map((tpl, index) => {
            const isFirst = index === 0;
            const isLast = index === checklists.length - 1;
            const isActive = tpl.id === activeChecklistId;
            const isDragging = draggingIndex === index;

            return (
              <div
                key={tpl.id}
                ref={(el) => registerRow(index, el)}
                className={`rounded-xl border px-2.5 py-2 flex items-center gap-2 transition-colors ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-md ring-1 ring-emerald-500/40'
                    : isActive
                      ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/25'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0D1117]'
                }`}
              >
                <button
                  type="button"
                  onPointerDown={(e) => startDrag(index, e)}
                  aria-label={t.dragToReorder}
                  className="min-h-[44px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 touch-none select-none cursor-grab active:cursor-grabbing shrink-0"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono-tabular text-slate-400 dark:text-slate-500 w-5 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-tabular font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                      {tpl.code}
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {tpl.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tabular truncate">
                    {t.orderModalItemMeta(tpl.items.length, tpl.aircraftModel)}
                  </p>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onMoveChecklist(tpl.id, 'top')}
                    aria-label={`${t.pinTop} ${tpl.name}`}
                    title={t.pinTop}
                    className="min-h-[44px] min-w-[38px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-25 cursor-pointer"
                  >
                    <ArrowUpToLine className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onMoveChecklist(tpl.id, 'up')}
                    aria-label={`${t.moveUp} ${tpl.name}`}
                    title={t.moveUp}
                    className="min-h-[44px] min-w-[38px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-25 cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onMoveChecklist(tpl.id, 'down')}
                    aria-label={`${t.moveDown} ${tpl.name}`}
                    title={t.moveDown}
                    className="min-h-[44px] min-w-[38px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-25 cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 pb-safe">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 active:scale-[0.99] transition-all cursor-pointer"
          >
            {t.doneSorting}
          </button>
        </div>
      </div>
    </div>
  );
};
