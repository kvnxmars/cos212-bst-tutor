import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the app from https://<user>.github.io/cos750-exam/ (must match the repo name exactly)
const base = process.env.VERCEL === '1' ? '/' : '/cos750-exam/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
