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
		allowedHosts: ['*.vitoesposito.it', 'tv.vitoesposito.it'],
	},
	preview: {
		host: true,
		port: 4173,
		allowedHosts: ['*.vitoesposito.it', 'tv.vitoesposito.it'],
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