import eslintPlugin from 'vite-plugin-eslint'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
import http from 'http'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [
      ...createVitePlugins(env, command === 'build'),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue'],
        exclude: ['./node_modules']
      })
    ],
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // vite 相关配置
    server: {
      port: 82,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev-api': {
          // target: 'http://10.100.1.104:30384', // 废弃
          // target: 'http://10.100.1.104:30048/prod-api', // 废弃
          // target: 'http://192.168.11.102:20553', // 联调王骁
          target: 'http://172.16.8.181:5050', // 开发
          // target: 'http://192.168.11.102:20745/prod-api', // 测试
          changeOrigin: true,
          rewrite: p => p.replace(/^\/dev-api/, ''),
          agent: new http.Agent({ keepAlive: true, keepAliveMsecs: 20000 })
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          // 静态资源分类打包
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js'
          // assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    // fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: atRule => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    }
  }
})
