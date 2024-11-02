import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import vercel from 'vite-plugin-vercel'

import Components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// Temporarily disabled on demand load for supporting theme switch

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vercel(),
    vue(),
    // Components({
    //   resolvers: [
    //     AntDesignVueResolver(),
    //   ],
    // }),
  ],
  server: {
    port: 3001
  },
  css:{
    preprocessorOptions:{
      less:{
        javascriptEnabled: true,
        modifyVars: {},
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 2000
  }
})
