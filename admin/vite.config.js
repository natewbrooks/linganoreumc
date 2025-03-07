import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), tailwindcss()],
	base: '/admin/',
	server: {
		host: '0.0.0.0', // Allow access from Nginx/Docker
		port: 5173,
		strictPort: true,
		cors: true,
		hmr: {
			protocol: 'ws',
			host: 'localhost',
		},
		watch: {
			usePolling: true,
		},
		allowedHosts: ['localhost', 'admin', 'frontend'],
	},
});
