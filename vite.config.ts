import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@ionic/core',
      '@ionic/core/loader',
      '@ionic/core/dist/esm/ionic-global.js',
      '@ionic/core/dist/esm/ionic-global.js?ionic:global'
    ]
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Completely suppress all Ionic-related warnings
        if (warning.code === 'DYNAMIC_IMPORT_ASSERTIONS' || 
            warning.message.includes('dynamic import cannot be analyzed') ||
            warning.message.includes('ion-app_8.entry.js') ||
            warning.message.includes('ion-refresher_2.entry.js') ||
            warning.message.includes('optimize deps directory') ||
            warning.message.includes('glob pattern import') ||
            warning.message.includes('@stencil/core') ||
            warning.message.includes('entry.js')) {
          return;
        }
        warn(warning);
      }
    }
  },
  define: {
    // Suppress Vite warnings about dynamic imports
    __VITE_IGNORE_DYNAMIC_IMPORTS__: true
  },
  logLevel: 'error' // Only show errors, suppress warnings
}); 