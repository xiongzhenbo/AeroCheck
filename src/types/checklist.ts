import { Language } from '../i18n/translations';

export interface ChecklistItem {
  id: string;
  title: string;
  spec: string;
  zone?: string;
  checked: boolean;
  checkedAt?: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  code: string;
  aircraftModel?: string;
  description?: string;
  items: ChecklistItem[];
  updatedAt: string;
}

export type ThemeMode = 'dark' | 'light';

export interface AppSettings {
  theme: ThemeMode;
  language: Language;
}
