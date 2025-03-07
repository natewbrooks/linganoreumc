import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: '/',
	server: {
		host: '0.0.0.0', // Allow access from Nginx/Docker
		port: 5174,
		strictPort: true,
		watch: {
			usePolling: true,
		},
		cors: true,
		hmr: {
			protocol: 'ws',
			host: 'localhost',
		},
		allowedHosts: ['localhost', 'admin', 'frontend'],
	},
});
