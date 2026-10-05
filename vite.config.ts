import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // На GitHub Pages сайт живёт по адресу https://<user>.github.io/phone-landing/
  base: command === 'build' ? '/phone-landing/' : '/',
}))
