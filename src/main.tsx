import { Capacitor } from '@capacitor/core';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

// Only register Web Service Worker outside native Capacitor APK builds
if (typeof window !== 'undefined' && !Capacitor.isNativePlatform()) {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const container = document.getElementById('root');
      if (!container || container.childElementCount === 0 || document.getElementById('boot-fallback')) {
        window.location.reload();
      }
    }
  });

  window.setTimeout(() => {
    registerSW({ immediate: true });
  }, 150);
}
