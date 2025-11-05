import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0329537b18ca4b528afdbff7c71b4186',
  appName: 'Climate Wardrobe Buddy',
  webDir: 'dist',
  server: {
    url: 'https://0329537b-18ca-4b52-8afd-bff7c71b4186.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
