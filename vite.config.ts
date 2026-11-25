import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        // Загружает переменные автоматически во все scss файлы проекта
        // Обратите внимание на использование нового синтаксиса @use вместо @import
        additionalData: `@use "@/styles/variables" as *;`
      }
    }
  },
    server: {
    proxy: {
      // Когда React видит запрос, начинающийся с /api, он перенаправляет его на бэкенд
      '/api': {
        target: 'https://travelblog.skillbox.cc',
        changeOrigin: true,
        secure: false,
      },
      // Перенаправление запросов к картинкам 
      '/images': {
        target: 'https://travelblog.skillbox.cc',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
