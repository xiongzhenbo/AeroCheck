import { App as CapApp } from '@capacitor/app';
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { useEffect, useRef, useState } from 'react';
import { Edit3, Moon, Plus, RotateCcw, Sun, Undo2 } from 'lucide-react';
import { BackupInstallModal } from './components/BackupInstallModal';
import { ChecklistModal } from './components/ChecklistModal';
import { ChecklistOrderModal } from './components/ChecklistOrderModal';
import { ChecklistWorkspace } from './components/ChecklistWorkspace';
import { InsertPosition, ItemModal } from './components/ItemModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DEFAULT_CHECKLISTS, getDefaultChecklists } from './data/defaultChecklists';
import { TRANSLATIONS } from './i18n/translations';
import { AppSettings, ChecklistItem, ChecklistTemplate } from './types/checklist';

const STORAGE_CHECKLISTS_KEY = 'aerocheck_checklists_v1';
const STORAGE_ACTIVE_ID_KEY = 'aerocheck_active_id_v1';
const STORAGE_SETTINGS_KEY = 'aerocheck_settings_v1';

function loadInitialChecklists(): ChecklistTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_CHECKLISTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to defaults
  }
  return DEFAULT_CHECKLISTS;
}

function loadInitialSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        theme: parsed?.theme === 'light' ? 'light' : 'dark',
        language: parsed?.language === 'en' ? 'en' : 'zh',
      };
    }
  } catch {
    // Fallback
  }
  return { theme: 'dark', language: 'zh' };
}

function formatTimeHM(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export default function App() {
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>(loadInitialChecklists);
  const [activeId, setActiveId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
      if (saved) return saved;
    } catch {
      // Ignore storage access errors
    }
    return DEFAULT_CHECKLISTS[0].id;
  });
  const [settings, setSettings] = useState<AppSettings>(loadInitialSettings);

  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'done'>('all');
  const [isEditMode, setIsEditMode] = useState(false);

  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistTemplate | null>(null);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);

  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const [undoSnapshot, setUndoSnapshot] = useState<{
    checklistId: string;
    checklistName: string;
    previousItems: ChecklistItem[];
  } | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const [showBackExitToast, setShowBackExitToast] = useState(false);
  const backConfirmTimerRef = useRef<number | null>(null);
  const overlayStateRef = useRef({
    hasModal: false,
    isEditMode: false,
  });

  const t = TRANSLATIONS[settings.language];

  const activeChecklist =
    checklists.find((c) => c.id === activeId) || checklists[0] || DEFAULT_CHECKLISTS[0];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHECKLISTS_KEY, JSON.stringify(checklists));
    } catch {
      // Ignore quota errors
    }
  }, [checklists]);

  useEffect(() => {
    if (activeChecklist) {
      try {
        localStorage.setItem(STORAGE_ACTIVE_ID_KEY, activeChecklist.id);
      } catch {
        // Ignore quota errors
      }
    }
  }, [activeChecklist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore
    }
    const root = document.documentElement;
    root.classList.toggle('dark', settings.theme === 'dark');
    root.lang = settings.language === 'en' ? 'en' : 'zh-CN';
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', settings.theme === 'dark' ? '#0D1117' : '#F8FAFC');
    }
    if (Capacitor.isNativePlatform()) {
      SystemBars.setStyle({
        style: settings.theme === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
      }).catch(() => {});
    }
  }, [settings]);

  useEffect(() => {
    overlayStateRef.current = {
      hasModal: checklistModalOpen || itemModalOpen || backupModalOpen || orderModalOpen,
      isEditMode,
    };
  }, [checklistModalOpen, itemModalOpen, backupModalOpen, orderModalOpen, isEditMode]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      let backArmed = false;
      let removed = false;
      let listenerHandle: { remove: () => Promise<void> } | null = null;

      CapApp.addListener('backButton', ({ canGoBack }) => {
        const { hasModal, isEditMode: editing } = overlayStateRef.current;
        if (hasModal) {
          setChecklistModalOpen(false);
          setEditingChecklist(null);
          setItemModalOpen(false);
          setEditingItem(null);
          setBackupModalOpen(false);
          setOrderModalOpen(false);
          return;
        }
        if (editing) {
          setIsEditMode(false);
          return;
        }
        if (canGoBack) {
          window.history.back();
          return;
        }
        if (backArmed) {
          backArmed = false;
          if (backConfirmTimerRef.current) {
            window.clearTimeout(backConfirmTimerRef.current);
            backConfirmTimerRef.current = null;
          }
          setShowBackExitToast(false);
          CapApp.minimizeApp().catch(() => {});
          return;
        }
        backArmed = true;
        setShowBackExitToast(true);
        if (backConfirmTimerRef.current) {
          window.clearTimeout(backConfirmTimerRef.current);
        }
        backConfirmTimerRef.current = window.setTimeout(() => {
          backArmed = false;
          setShowBackExitToast(false);
        }, 2500);
      }).then((handle) => {
        if (removed) {
          handle.remove().catch(() => {});
        } else {
          listenerHandle = handle;
        }
      });

      return () => {
        removed = true;
        listenerHandle?.remove().catch(() => {});
        if (backConfirmTimerRef.current) {
          window.clearTimeout(backConfirmTimerRef.current);
        }
      };
    }

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (!isStandalone) return;

    const armGuard = () => {
      try {
        if (!window.history.state?.aeroGuard) {
          window.history.pushState({ aeroGuard: true }, '');
        }
      } catch {
        // Ignore restricted history APIs
      }
    };

    const handleUserGesture = () => {
      if (backConfirmTimerRef.current) {
        window.clearTimeout(backConfirmTimerRef.current);
        backConfirmTimerRef.current = null;
      }
      setShowBackExitToast(false);
      armGuard();
    };

    const handlePopState = () => {
      const { hasModal, isEditMode: editing } = overlayStateRef.current;
      if (hasModal) {
        setChecklistModalOpen(false);
        setEditingChecklist(null);
        setItemModalOpen(false);
        setEditingItem(null);
        setBackupModalOpen(false);
        setOrderModalOpen(false);
        armGuard();
        return;
      }

      if (editing) {
        setIsEditMode(false);
        armGuard();
        return;
      }

      // First back-swipe on main screen lands at index 0 and shows confirmation toast;
      // an immediate second swipe exits natively, while tapping anywhere re-arms the guard.
      setShowBackExitToast(true);
      if (backConfirmTimerRef.current) {
        window.clearTimeout(backConfirmTimerRef.current);
      }
      backConfirmTimerRef.current = window.setTimeout(() => {
        setShowBackExitToast(false);
        armGuard();
      }, 2500);
    };

    window.addEventListener('pointerdown', handleUserGesture, { passive: true });
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('popstate', handlePopState);
      if (backConfirmTimerRef.current) {
        window.clearTimeout(backConfirmTimerRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const toggleLanguage = () => {
    setSettings((prev) => ({
      ...prev,
      language: prev.language === 'zh' ? 'en' : 'zh',
    }));
  };

  const handleToggleItem = (itemId: string) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore unsupported vibration
      }
    }
    const nowTime = formatTimeHM(new Date());
    setChecklists((prev) =>
      prev.map((tpl) => {
        if (tpl.id !== activeChecklist.id) return tpl;
        return {
          ...tpl,
          updatedAt: new Date().toISOString(),
          items: tpl.items.map((item) => {
            if (item.id !== itemId) return item;
            const nextChecked = !item.checked;
            return {
              ...item,
              checked: nextChecked,
              checkedAt: nextChecked ? nowTime : undefined,
            };
          }),
        };
      })
    );
  };

  const handleResetChecklist = () => {
    const hasChecked = activeChecklist.items.some((i) => i.checked);
    if (!hasChecked) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([12, 30, 12]);
      } catch {
        // Ignore
      }
    }

    const snapshotItems = activeChecklist.items.map((i) => ({ ...i }));
    setUndoSnapshot({
      checklistId: activeChecklist.id,
      checklistName: activeChecklist.name,
      previousItems: snapshotItems,
    });

    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
    }
    undoTimerRef.current = window.setTimeout(() => {
      setUndoSnapshot(null);
    }, 5500);

    setChecklists((prev) =>
      prev.map((tpl) => {
        if (tpl.id !== activeChecklist.id) return tpl;
        return {
          ...tpl,
          updatedAt: new Date().toISOString(),
          items: tpl.items.map((item) => ({
            ...item,
            checked: false,
            checkedAt: undefined,
          })),
        };
      })
    );
    setFilterMode('all');
  };

  const handleUndoReset = () => {
    if (!undoSnapshot) return;
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
    }
    setChecklists((prev) =>
      prev.map((tpl) => {
        if (tpl.id !== undoSnapshot.checklistId) return tpl;
        return {
          ...tpl,
          updatedAt: new Date().toISOString(),
          items: undoSnapshot.previousItems,
        };
      })
    );
    setActiveId(undoSnapshot.checklistId);
    setUndoSnapshot(null);
  };

  const handleSaveChecklistMeta = (data: {
    name: string;
    code: string;
    aircraftModel: string;
    description: string;
  }) => {
    const now = new Date().toISOString();
    if (editingChecklist) {
      setChecklists((prev) =>
        prev.map((tpl) =>
          tpl.id === editingChecklist.id
            ? {
                ...tpl,
                ...data,
                updatedAt: now,
              }
            : tpl
        )
      );
    } else {
      const newTpl: ChecklistTemplate = {
        id: `tpl-${Date.now()}`,
        ...data,
        items: [],
        updatedAt: now,
      };
      setChecklists((prev) => [...prev, newTpl]);
      setActiveId(newTpl.id);
      setIsEditMode(false);
    }
    setChecklistModalOpen(false);
    setEditingChecklist(null);
  };

  const handleDuplicateChecklist = (id: string) => {
    const source = checklists.find((c) => c.id === id);
    if (!source) return;
    const copySuffix = settings.language === 'en' ? ' (Copy)' : ' (副本)';
    const copy: ChecklistTemplate = {
      ...source,
      id: `tpl-${Date.now()}`,
      name: `${source.name}${copySuffix}`,
      updatedAt: new Date().toISOString(),
      items: source.items.map((item, idx) => ({
        ...item,
        id: `item-${Date.now()}-${idx}`,
        checked: false,
        checkedAt: undefined,
      })),
    };
    setChecklists((prev) => [...prev, copy]);
    setActiveId(copy.id);
    setChecklistModalOpen(false);
    setEditingChecklist(null);
  };

  const handleDeleteChecklist = (id: string) => {
    if (checklists.length <= 1) return;
    const remaining = checklists.filter((c) => c.id !== id);
    setChecklists(remaining);
    if (activeId === id && remaining.length > 0) {
      setActiveId(remaining[0].id);
    }
    setChecklistModalOpen(false);
    setEditingChecklist(null);
  };

  const handleMoveChecklist = (id: string, direction: 'up' | 'down' | 'top') => {
    setChecklists((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      if (direction === 'top') {
        next.unshift(moved);
      } else {
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;
        next.splice(targetIdx, 0, moved);
      }
      return next;
    });
  };

  const handleReorderChecklists = (fromIndex: number, toIndex: number) => {
    setChecklists((prev) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length ||
        fromIndex === toIndex
      ) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleSaveSingleItem = (
    data: { title: string; spec: string; zone: string },
    keepOpen: boolean,
    position: InsertPosition
  ) => {
    const now = new Date().toISOString();
    setChecklists((prev) =>
      prev.map((tpl) => {
        if (tpl.id !== activeChecklist.id) return tpl;
        if (editingItem) {
          return {
            ...tpl,
            updatedAt: now,
            items: tpl.items.map((it) =>
              it.id === editingItem.id
                ? {
                    ...it,
                    title: data.title,
                    spec: data.spec,
                    zone: data.zone,
                  }
                : it
            ),
          };
        }
        const newItem: ChecklistItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: data.title,
          spec: data.spec,
          zone: data.zone,
          checked: false,
        };
        return {
          ...tpl,
          updatedAt: now,
          items: position === 'top' ? [newItem, ...tpl.items] : [...tpl.items, newItem],
        };
      })
    );
    if (!keepOpen) {
      setItemModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleBatchAddItems = (
    itemsToAdd: Array<{ title: string; spec: string; zone: string }>,
    position: InsertPosition
  ) => {
    const now = new Date().toISOString();
    const newItems: ChecklistItem[] = itemsToAdd.map((entry, idx) => ({
      id: `item-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      title: entry.title,
      spec: entry.spec,
      zone: entry.zone,
      checked: false,
    }));
    setChecklists((prev) =>
      prev.map((tpl) =>
        tpl.id === activeChecklist.id
          ? {
              ...tpl,
              updatedAt: now,
              items: position === 'top' ? [...newItems, ...tpl.items] : [...tpl.items, ...newItems],
            }
          : tpl
      )
    );
    setItemModalOpen(false);
    setEditingItem(null);
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    setChecklists((prev) =>
      prev.map((tpl) => {
        if (tpl.id !== activeChecklist.id) return tpl;
        const idx = tpl.items.findIndex((i) => i.id === itemId);
        if (idx === -1) return tpl;
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= tpl.items.length) return tpl;
        const nextItems = [...tpl.items];
        const [moved] = nextItems.splice(idx, 1);
        nextItems.splice(targetIdx, 0, moved);
        return {
          ...tpl,
          updatedAt: new Date().toISOString(),
          items: nextItems,
        };
      })
    );
  };

  const handleReorderItems = (fromIndex: number, toIndex: number) => {
    setChecklists((prev) =>
      prev.map((tpl) => {
        if (tpl.id !== activeChecklist.id) return tpl;
        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= tpl.items.length ||
          toIndex >= tpl.items.length ||
          fromIndex === toIndex
        ) {
          return tpl;
        }
        const nextItems = [...tpl.items];
        const [moved] = nextItems.splice(fromIndex, 1);
        nextItems.splice(toIndex, 0, moved);
        return {
          ...tpl,
          updatedAt: new Date().toISOString(),
          items: nextItems,
        };
      })
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setChecklists((prev) =>
      prev.map((tpl) => {
        if (tpl.id !== activeChecklist.id) return tpl;
        return {
          ...tpl,
          updatedAt: new Date().toISOString(),
          items: tpl.items.filter((i) => i.id !== itemId),
        };
      })
    );
  };

  const checkedCount = activeChecklist.items.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0D1117] dark:text-slate-100 flex flex-col">
      <OfflineIndicator language={settings.language} />

      {/* Top Navigation Bar (Strict 3-Zone Contract, 52px height + safe-area top) */}
      <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-md">
        <div className="mx-auto h-[52px] max-w-6xl px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">
            <span className="sm:hidden">{t.brandShort}</span>
            <span className="hidden sm:inline">{t.brandName}</span>
          </span>

          {/* Zone 2: Clean single-line text links */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => {
                setEditingChecklist(null);
                setChecklistModalOpen(true);
              }}
              className="hidden sm:inline-block hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.navNewType}
            </button>
            <button
              type="button"
              onClick={() => setBackupModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.navBackupInstall}
            </button>
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={t.langSwitchAria}
              className="font-mono-tabular hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.langSwitchLabel}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Day / Night Mode Toggle) */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle day/night mode"
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#161E29] text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {settings.theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{t.themeLight}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>{t.themeDark}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1">
        <ChecklistWorkspace
          language={settings.language}
          checklists={checklists}
          activeChecklist={activeChecklist}
          filterMode={filterMode}
          isEditMode={isEditMode}
          onSelectChecklist={(id) => {
            setActiveId(id);
            setIsEditMode(false);
            setFilterMode('all');
          }}
          onChangeFilterMode={setFilterMode}
          onToggleEditMode={() => setIsEditMode((v) => !v)}
          onToggleItem={handleToggleItem}
          onResetChecklist={handleResetChecklist}
          onOpenNewChecklist={() => {
            setEditingChecklist(null);
            setChecklistModalOpen(true);
          }}
          onOpenEditChecklist={(tpl) => {
            setEditingChecklist(tpl);
            setChecklistModalOpen(true);
          }}
          onOpenOrderModal={() => setOrderModalOpen(true)}
          onOpenAddItem={() => {
            setEditingItem(null);
            setItemModalOpen(true);
          }}
          onOpenEditItem={(item) => {
            setEditingItem(item);
            setItemModalOpen(true);
          }}
          onMoveItem={handleMoveItem}
          onReorderItems={handleReorderItems}
          onDeleteItem={handleDeleteItem}
          onOpenBackupModal={() => setBackupModalOpen(true)}
        />
      </div>

      {/* Back-Swipe Exit Guard Toast */}
      {showBackExitToast && !undoSnapshot && (
        <div
          role="status"
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100%-2rem)] rounded-xl bg-slate-900/95 dark:bg-slate-800/95 border border-slate-700 text-white px-4 py-2.5 shadow-2xl text-xs font-medium text-center"
        >
          {t.backExitToast}
        </div>
      )}

      {/* Undo Reset Toast */}
      {undoSnapshot && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm truncate">
            {t.undoResetMsg(undoSnapshot.checklistName)}
          </span>
          <button
            type="button"
            onClick={handleUndoReset}
            className="inline-flex items-center gap-1 min-h-[36px] px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 shrink-0 cursor-pointer whitespace-nowrap"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>{t.undoBtn}</span>
          </button>
        </div>
      )}

      {/* Mobile Sticky Bottom Thumb Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md px-3 pt-1.5 pb-safe">
        <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
          <button
            type="button"
            onClick={handleResetChecklist}
            disabled={checkedCount === 0}
            className="min-h-[44px] rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>{t.resetShort}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditMode((v) => !v)}
            className={`min-h-[44px] rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              isEditMode
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-[#161E29] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Edit3 className="w-4 h-4 shrink-0" />
            <span>{isEditMode ? t.doneEditShort : t.editItemsShort}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setItemModalOpen(true);
            }}
            className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-[#161E29] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>{t.addItemShort}</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ChecklistModal
        language={settings.language}
        isOpen={checklistModalOpen}
        editingChecklist={editingChecklist}
        canDelete={checklists.length > 1}
        onClose={() => {
          setChecklistModalOpen(false);
          setEditingChecklist(null);
        }}
        onSave={handleSaveChecklistMeta}
        onDuplicate={handleDuplicateChecklist}
        onDelete={handleDeleteChecklist}
      />

      <ItemModal
        language={settings.language}
        isOpen={itemModalOpen}
        editingItem={editingItem}
        checklistName={activeChecklist.name}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
        }}
        onSaveSingle={handleSaveSingleItem}
        onBatchAdd={handleBatchAddItems}
      />

      <BackupInstallModal
        language={settings.language}
        isOpen={backupModalOpen}
        checklists={checklists}
        onClose={() => setBackupModalOpen(false)}
        onImportChecklists={(imported) => {
          setChecklists(imported);
          setActiveId(imported[0].id);
        }}
        onRestoreDefaults={() => {
          const defaults = getDefaultChecklists(settings.language);
          setChecklists(defaults);
          setActiveId(defaults[0].id);
        }}
      />

      <ChecklistOrderModal
        language={settings.language}
        isOpen={orderModalOpen}
        checklists={checklists}
        activeChecklistId={activeChecklist.id}
        onClose={() => setOrderModalOpen(false)}
        onMoveChecklist={handleMoveChecklist}
        onReorderChecklists={handleReorderChecklists}
      />
    </div>
  );
}
