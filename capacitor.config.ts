import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aerocheck.ecl',
  appName: '机务检查单',
  webDir: 'dist',
  backgroundColor: '#0D1117',
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
      style: 'DEFAULT',
    },
  },
};

export default config;
