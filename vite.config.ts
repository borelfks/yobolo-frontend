import { fileURLToPath, URL } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Les pages sont chargées à la demande : sans cette liste, Vite découvre ces
  // bibliothèques en cours de navigation, refait sa pré-compilation et sert
  // deux copies de React (« Invalid hook call »).
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router',
      'lucide-react',
      'recharts',
      'sonner',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'react-hook-form',
      'zod',
      '@hookform/resolvers/zod',
    ],
  },
})
