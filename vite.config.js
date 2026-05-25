import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/BNextPresentation-May25/',
  publicDir: 'Public',
  plugins: [react()],
});
