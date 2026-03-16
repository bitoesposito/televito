import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
	],
	server: {
		host: true,
		port: 4173,
		allowedHosts: true,
	},
	preview: {
		host: true,
		port: 4173,
		allowedHosts: true,
	},
	build: {
		minify: 'esbuild',
		rollupOptions: {
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom'],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
})