import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid', // Upgrade to hybrid for D1 DB API routes
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    tailwind(), 
    react()
  ],
  vite: {
    build: {
      cssCodeSplit: false, 
    },
  },
});
