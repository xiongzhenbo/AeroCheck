import React, { useState } from 'react';
import { CheckCircle2, Download, ExternalLink, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface PWAInstallButtonProps {
  language: Language;
  compact?: boolean;
  showFallbackGuide?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language,
  compact = false,
  showFallbackGuide = false,
}) => {
  const { isInstallable, isInstalled, isIOS, isEdge, isInIframe, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const t = TRANSLATIONS[language];

  if (isInstalled) {
    if (!showFallbackGuide) return null;
    return (
      <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>{t.runningStandalone}</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer ${
          compact
            ? 'px-3 py-1.5 text-xs min-h-[36px]'
            : 'px-4 py-2.5 text-sm min-h-[44px] w-full sm:w-auto'
        }`}
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>{t.installNow}</span>
      </button>
    );
  }

  if (!showFallbackGuide && !isIOS) {
    return null;
  }

  return (
    <>
      {isInIframe ? (
        <a
          href={typeof window !== 'undefined' ? window.location.href : '/'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold min-h-[44px] hover:bg-emerald-500 transition-colors whitespace-nowrap"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>{t.openInNewTab}</span>
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-emerald-500/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            compact ? 'px-3 py-1.5 text-xs min-h-[36px]' : 'px-4 py-2.5 text-sm min-h-[44px]'
          }`}
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>{isIOS ? t.iosGuideBtn : t.androidGuideBtn}</span>
        </button>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#131A23] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {isIOS
                  ? t.iosGuideTitle
                  : isEdge
                    ? t.edgeGuideTitle
                    : t.androidGuideTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label={t.close}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>{t.iosStep1}</li>
                <li>{t.iosStep2}</li>
                <li>{t.iosStep3}</li>
              </ol>
            ) : (
              <ol className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>{t.androidStep1}</li>
                <li>{t.androidStep2}</li>
                <li>{t.androidStep3}</li>
                <li className="text-xs text-amber-600 dark:text-amber-400 pt-1">{t.androidTip}</li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              {t.gotIt}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
