import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp}',
          'images/**/*',
          'icons/**/*',
          'screenshots/**/*',
        ],
        maximumFileSizeToCacheInBytes: 5000000,
      },
      includeAssets: [
        'favicon.png',
        'images/logo-x144.png',
        'images/logo.png',
        'images/maskable-logo-x48.png',
        'images/maskable-logo-x96.png',
        'images/icons/*.png',
        'images/screenshots/*.png',
      ],
      manifest: {
        name: 'User Stories',
        short_name: 'UserStories',
        description: 'A platform to share your stories',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'images/logo-x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'images/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'images/icons/maskable-logo-x96.png',
            type: 'image/png',
            sizes: '96x96',
            purpose: 'maskable',
          },
          {
            src: 'images/icons/maskable-logo-x48.png',
            type: 'image/png',
            sizes: '48x48',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'images/screenshots/UserStories_SS1.png',
            sizes: '1919x863',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'images/screenshots/UserStories_SS2.png',
            sizes: '1919x863',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'images/screenshots/UserStories_SS3.png',
            sizes: '1919x863',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
      },
    }),
  ],
});
