import path from 'path'
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
}