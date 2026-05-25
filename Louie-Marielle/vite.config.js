import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: mode === 'production' ? '/Louie-Marielle/' : '/',
    build: {
      outDir: '../docs',
      emptyOutDir: true,
    },
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    define: {
      __ADMIN_USERNAME__: JSON.stringify(env.username ?? ''),
      __ADMIN_PASSWORD__: JSON.stringify(env.password ?? ''),
    },
  }
})
