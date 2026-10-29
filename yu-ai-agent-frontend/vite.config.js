import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
/*
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    cors: true
  }
})
*/

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        port: 3000,
        cors: true,
        // 👇 重点在这里：添加代理配置
        proxy: {
            '/api': {
                target: 'http://localhost:8123', // ⚠️ 这里改成你后端的真实端口！如果是8080就改成8080
                changeOrigin: true,              // 允许跨域
                // 针对 SSE 流式接口，增加超时时间并禁用缓冲，防止连接断掉
                timeout: 300000,
                proxyTimeout: 300000,
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // 如果请求的是流式接口（路径里包含 sse），则告诉 Nginx/Vite 不要缓存
                        if (req.url.includes('sse') || req.url.includes('chat')) {
                            proxyReq.setHeader('Cache-Control', 'no-cache');
                            proxyReq.setHeader('Connection', 'keep-alive');
                        }
                    });
                }
            }
        }
    }
})
