import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist', // ou 'public' selon la structure de ton projet
  },
  server: {
    port: 3000, // Port pour le serveur de développement
  },
  define: {
    'process.env': {},
  },
  // Ajouter cette section pour spécifier que les fichiers .js doivent être traités en tant que JSX
  esbuild: {
    loader: 'jsx', // Définir le loader à 'jsx' pour les fichiers .js contenant du JSX
  },
});
