import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckCircle2,
  Edit3,
  FolderPlus,
  GripVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Trash2,
  X,
} from 'lucide-react';
import { usePointerDragReorder } from '../hooks/usePointerDragReorder';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ChecklistItem, ChecklistTemplate } from '../types/checklist';
import { PWAInstallButton } from './PWAInstallButton';

interface ChecklistWorkspaceProps {
  language: Language;
  checklists: ChecklistTemplate[];
  activeChecklist: ChecklistTemplate;
  filterMode: 'all' | 'pending' | 'done';
  isEditMode: boolean;
  onSelectChecklist: (id: string) => void;
  onChangeFilterMode: (mode: 'all' | 'pending' | 'done') => void;
  onToggleEditMode: () => void;
  onToggleItem: (itemId: string) => void;
  onResetChecklist: () => void;
  onOpenNewChecklist: () => void;
  onOpenEditChecklist: (checklist: ChecklistTemplate) => void;
  onOpenOrderModal: () => void;
  onOpenAddItem: () => void;
  onOpenEditItem: (item: ChecklistItem) => void;
  onMoveItem: (itemId: string, direction: 'up' | 'down') => void;
  onReorderItems: (fromIndex: number, toIndex: number) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenBackupModal: () => void;
}

export const ChecklistWorkspace: React.FC<ChecklistWorkspaceProps> = ({
  language,
  checklists,
  activeChecklist,
  filterMode,
  isEditMode,
  onSelectChecklist,
  onChangeFilterMode,
  onToggleEditMode,
  onToggleItem,
  onResetChecklist,
  onOpenNewChecklist,
  onOpenEditChecklist,
  onOpenOrderModal,
  onOpenAddItem,
  onOpenEditItem,
  onMoveItem,
  onReorderItems,
  onDeleteItem,
  onOpenBackupModal,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredChecklists = normalizedQuery
    ? checklists.filter((tpl) => {
        const haystack = [tpl.name, tpl.code, tpl.aircraftModel || '', tpl.description || '']
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : checklists;

  const totalCount = activeChecklist.items.length;
  const checkedCount = activeChecklist.items.filter((i) => i.checked).length;
  const pendingCount = totalCount - checkedCount;
  const progressPct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const isAllDone = totalCount > 0 && checkedCount === totalCount;

  const { draggingIndex, registerRow, startDrag } = usePointerDragReorder(
    activeChecklist.items.length,
    onReorderItems
  );

  const filteredItems = activeChecklist.items.filter((item) => {
    if (isEditMode || filterMode === 'all') return true;
    if (filterMode === 'pending') return !item.checked;
    return item.checked;
  });

  const ringSize = 48;
  const strokeWidth = 4.5;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 sm:py-6 pb-24 lg:pb-10">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Desktop Sidebar: Checklist Types */}
        <aside className="hidden lg:flex lg:flex-col lg:w-76 shrink-0 gap-4 sticky top-[68px]">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A23] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.checklistTypes}
              </h2>
              <div className="flex items-center gap-1.5">
                {checklists.length > 1 && (
                  <button
                    type="button"
                    onClick={onOpenOrderModal}
                    className="inline-flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>{t.sortBtn}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenNewChecklist}
                  className="inline-flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.newTypeBtn}</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchChecklistPlaceholder}
                aria-label={t.searchChecklistPlaceholder}
                className="w-full min-h-[38px] rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-[#0D1117] pl-8.5 pr-9 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={t.clearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {filteredChecklists.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 px-3 py-5 text-center space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.noChecklistMatch(searchQuery.trim())}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="min-h-[34px] px-3 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                  >
                    {t.clearSearch}
                  </button>
                </div>
              ) : (
                filteredChecklists.map((tpl) => {
                  const isActive = tpl.id === activeChecklist.id;
                  const tplDone = tpl.items.filter((i) => i.checked).length;
                  const tplTotal = tpl.items.length;
                  const tplComplete = tplTotal > 0 && tplDone === tplTotal;

                  return (
                    <div
                      key={tpl.id}
                      className={`group flex items-center gap-2 rounded-xl border transition-colors ${
                        isActive
                          ? 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/35'
                          : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectChecklist(tpl.id)}
                        className="flex-1 min-w-0 text-left px-3 py-2.5 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-mono-tabular font-semibold ${
                                isActive
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {tpl.code}
                            </span>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              {tpl.name}
                            </span>
                          </div>
                          {tpl.aircraftModel && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {tpl.aircraftModel}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs font-mono-tabular shrink-0 ${
                            tplComplete
                              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {tplDone}/{tplTotal}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenEditChecklist(tpl)}
                        aria-label={t.typeSettingsAria(tpl.name)}
                        className="min-h-[40px] min-w-[36px] mr-1 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer shrink-0"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A23] p-4 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.sidebarHint}
            </p>
            <div className="flex flex-col gap-2">
              <PWAInstallButton language={language} />
              <button
                type="button"
                onClick={onOpenBackupModal}
                className="w-full min-h-[42px] rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t.backupModalBtn}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Checklist Type Switcher */}
        <div className="lg:hidden space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {t.checklistTypes}
            </span>
            <div className="flex items-center gap-1.5">
              {checklists.length > 1 && (
                <button
                  type="button"
                  onClick={onOpenOrderModal}
                  className="inline-flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131A23] cursor-pointer whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>{t.sortBtn}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenEditChecklist(activeChecklist)}
                className="inline-flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131A23] cursor-pointer whitespace-nowrap"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{t.manageShort}</span>
              </button>
              <button
                type="button"
                onClick={onOpenNewChecklist}
                className="inline-flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 cursor-pointer whitespace-nowrap"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>{t.newShort}</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchChecklistPlaceholder}
              aria-label={t.searchChecklistPlaceholder}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A23] pl-9 pr-10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={t.clearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {filteredChecklists.length === 0 ? (
              <div className="flex items-center gap-3 w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131A23] px-3.5 py-2.5 justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {t.noChecklistMatch(searchQuery.trim())}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="min-h-[32px] px-2.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 shrink-0 cursor-pointer"
                >
                  {t.clearSearch}
                </button>
              </div>
            ) : (
              filteredChecklists.map((tpl) => {
                const isActive = tpl.id === activeChecklist.id;
                const tplDone = tpl.items.filter((i) => i.checked).length;
                const tplTotal = tpl.items.length;

                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onSelectChecklist(tpl.id)}
                    className={`min-h-[44px] px-3.5 rounded-xl border text-left transition-colors shrink-0 cursor-pointer flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white dark:bg-[#131A23] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono-tabular font-semibold ${
                        isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {tpl.code}
                    </span>
                    <span className="text-sm font-medium whitespace-nowrap">{tpl.name}</span>
                    <span
                      className={`text-xs font-mono-tabular ${
                        isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {tplDone}/{tplTotal}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Main Electronic Checklist Panel */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* Integrated Active Checklist Header & Interactive Status Filters */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A23] p-4 sm:p-5 space-y-3.5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-xs font-mono-tabular font-semibold text-emerald-600 dark:text-emerald-400">
                    {activeChecklist.code}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {activeChecklist.name}
                  </h1>
                </div>

                {(activeChecklist.aircraftModel || activeChecklist.description) && (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {activeChecklist.aircraftModel && (
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {activeChecklist.aircraftModel}
                      </span>
                    )}
                    {activeChecklist.aircraftModel && activeChecklist.description && (
                      <span aria-hidden="true"> · </span>
                    )}
                    {activeChecklist.description && <span>{activeChecklist.description}</span>}
                  </p>
                )}
              </div>

              {/* Compact Progress Ring & Ratio */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-base font-bold font-mono-tabular text-slate-900 dark:text-slate-100">
                    {checkedCount}/{totalCount}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAllDone ? t.checklistDoneLabel : t.completedCountLabel}
                  </div>
                </div>
                <div className="relative flex items-center justify-center">
                  <svg width={ringSize} height={ringSize} className="-rotate-90">
                    <circle
                      cx={ringSize / 2}
                      cy={ringSize / 2}
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      className="text-slate-200 dark:text-slate-800"
                    />
                    <circle
                      cx={ringSize / 2}
                      cy={ringSize / 2}
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className={`transition-all duration-200 ${
                        isAllDone ? 'text-emerald-500' : 'text-emerald-600 dark:text-emerald-500'
                      }`}
                    />
                  </svg>
                  <span className="absolute text-[11px] font-bold font-mono-tabular text-slate-800 dark:text-slate-200">
                    {progressPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Integrated Status Filter Tabs + Desktop Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="grid grid-cols-3 sm:inline-flex w-full sm:w-auto items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onChangeFilterMode('all')}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-medium font-mono-tabular transition-colors cursor-pointer whitespace-nowrap ${
                    filterMode === 'all'
                      ? 'bg-white dark:bg-[#1C2531] text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t.filterAll(totalCount)}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFilterMode('pending')}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-medium font-mono-tabular transition-colors cursor-pointer whitespace-nowrap ${
                    filterMode === 'pending'
                      ? 'bg-white dark:bg-[#1C2531] text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t.filterPending(pendingCount)}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFilterMode('done')}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-medium font-mono-tabular transition-colors cursor-pointer whitespace-nowrap ${
                    filterMode === 'done'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {t.filterDone(checkedCount)}
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleEditMode}
                  className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    isEditMode
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-[#0D1117] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditMode ? t.exitEditMode : t.editItems}</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenAddItem}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addItem}</span>
                </button>
                <button
                  type="button"
                  onClick={onResetChecklist}
                  disabled={checkedCount === 0}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-emerald-600 text-white hover:opacity-90 disabled:opacity-40 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetChecklist}</span>
                </button>
              </div>
            </div>
          </section>

          {/* ECL Checklist Complete Banner */}
          {isAllDone && !isEditMode && (
            <div className="rounded-2xl border border-emerald-500/70 bg-emerald-600 text-white px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold">
                    {t.allCompleteTitle(activeChecklist.name)}
                  </div>
                  <div className="text-xs text-emerald-100 font-mono-tabular">
                    {t.allCompleteSub(totalCount)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onResetChecklist}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl bg-white text-emerald-800 text-xs font-semibold hover:bg-emerald-50 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetAndReuse}</span>
              </button>
            </div>
          )}

          {/* Edit Mode Helper Banner */}
          {isEditMode && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                {t.editModeBanner}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenAddItem}
                  className="min-h-[36px] px-3 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 cursor-pointer whitespace-nowrap"
                >
                  {t.addNewItemInline}
                </button>
                <button
                  type="button"
                  onClick={onToggleEditMode}
                  className="min-h-[36px] px-3 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium cursor-pointer whitespace-nowrap"
                >
                  {t.doneEditingBtn}
                </button>
              </div>
            </div>
          )}

          {/* Checklist Items List */}
          {activeChecklist.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131A23] px-6 py-12 text-center space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.emptyItemsTitle(activeChecklist.name)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.emptyItemsSub}</p>
              <button
                type="button"
                onClick={onOpenAddItem}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addFirstItem}</span>
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A23] px-6 py-10 text-center space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {filterMode === 'pending' ? t.emptyPendingFilter : t.emptyDoneFilter}
              </p>
              <button
                type="button"
                onClick={() => onChangeFilterMode('all')}
                className="min-h-[40px] px-4 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
              >
                {t.showAllItems}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredItems.map((item) => {
                const originalIndex = activeChecklist.items.findIndex((i) => i.id === item.id);
                const indexLabel = String(originalIndex + 1).padStart(2, '0');
                const isFirst = originalIndex === 0;
                const isLast = originalIndex === activeChecklist.items.length - 1;

                if (isEditMode) {
                  const isDragging = draggingIndex === originalIndex;
                  return (
                    <div
                      key={item.id}
                      ref={(el) => registerRow(originalIndex, el)}
                      className={`rounded-xl border px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 transition-colors ${
                        isDragging
                          ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 shadow-md ring-1 ring-emerald-500/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A23]'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                        <button
                          type="button"
                          onPointerDown={(e) => startDrag(originalIndex, e)}
                          aria-label={t.dragToReorder}
                          title={t.dragToReorder}
                          className="min-h-[44px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 touch-none select-none cursor-grab active:cursor-grabbing shrink-0"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>

                        <span className="text-xs font-mono-tabular text-slate-400 dark:text-slate-500 shrink-0 w-6 pt-3 sm:pt-0">
                          {indexLabel}
                        </span>

                        <button
                          type="button"
                          onClick={() => onOpenEditItem(item)}
                          className="flex-1 min-w-0 text-left py-1 cursor-pointer"
                        >
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {item.title}
                            </span>
                            {item.zone && (
                              <span className="text-xs font-mono-tabular text-slate-500 dark:text-slate-400">
                                {item.zone}
                              </span>
                            )}
                          </div>
                          {item.spec && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                              {item.spec}
                            </p>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-end gap-1 shrink-0 pl-10 sm:pl-0">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => onMoveItem(item.id, 'up')}
                          aria-label={t.moveUp}
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-25 cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => onMoveItem(item.id, 'down')}
                          aria-label={t.moveDown}
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-25 cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEditItem(item)}
                          aria-label={t.edit}
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          aria-label={t.remove}
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleItem(item.id)}
                    aria-pressed={item.checked}
                    className={`w-full text-left rounded-xl border px-4 py-3.5 min-h-[64px] flex items-start sm:items-center gap-3.5 transition-all duration-150 active:scale-[0.992] cursor-pointer ${
                      item.checked
                        ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-950/55 dark:border-emerald-500/80'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-[#131A23] dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`mt-0.5 sm:mt-0 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        item.checked
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 bg-transparent'
                      }`}
                    >
                      {item.checked && <Check className="w-4.5 h-4.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span
                          className={`text-xs font-mono-tabular ${
                            item.checked
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {indexLabel}
                        </span>
                        <span
                          className={`text-sm sm:text-[15px] font-semibold leading-snug ${
                            item.checked
                              ? 'text-emerald-900 dark:text-emerald-200'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.zone && (
                          <span
                            className={`text-xs font-mono-tabular ${
                              item.checked
                                ? 'text-emerald-700/80 dark:text-emerald-400/80'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            · {item.zone}
                          </span>
                        )}
                      </div>

                      {item.spec && (
                        <p
                          className={`text-xs sm:text-[13px] leading-relaxed ${
                            item.checked
                              ? 'text-emerald-800/90 dark:text-emerald-300/90'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.spec}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-right self-center pl-2">
                      {item.checked ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                            {t.verified}
                          </span>
                          {item.checkedAt && (
                            <span className="text-[11px] font-mono-tabular text-emerald-600/80 dark:text-emerald-400/80">
                              {item.checkedAt}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {t.tapToCheck}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
