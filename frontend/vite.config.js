// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Esto puede ayudar a manejar dependencias mixtas CJS/ESM
    },
  },
  // Asegúrate de tener correctamente la URL de tu backend en las variables de entorno
  define: {
    'process.env': {
      VITE_BACKEND_URL: JSON.stringify(process.env.VITE_BACKEND_URL),
    },
  },
})
