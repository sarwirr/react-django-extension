import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Enable JSX parsing in .js files
    loader: 'jsx',
    include: /\.(js|jsx)$/,
  },
});
