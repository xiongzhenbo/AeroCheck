import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface OfflineIndicatorProps {
  language: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();
  const t = TRANSLATIONS[language];

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed top-14 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{t.offlineBanner}</span>
    </div>
  );
};
