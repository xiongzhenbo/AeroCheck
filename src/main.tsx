import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

// Defer service worker registration so it never blocks first render on PWA resume
if (typeof window !== 'undefined') {
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
