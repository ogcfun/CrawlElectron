import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'
const pathSrc = path.resolve(__dirname, 'src/renderer/src')

// 自动导入 ref 以及 组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// 自动导入 ElementPlus
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 自动导入svg图标
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 9000
    },
    plugins: [
      vue(),
      ElementPlus({
        useSource: true,
        defaultLocale: 'zh-cn'
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/renderer/src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        resolvers: [ElementPlusResolver()],
        imports: ['vue'],
        eslintrc: {
          enabled: true, // 是否自动生成 eslint 规则，建议生成之后设置 false
          filepath: './.eslintrc-auto-import.json' // 指定自动导入函数 eslint 规则的文件
        },
        dts: path.resolve(pathSrc, 'types', 'auto-imports.d.ts') // 指定自动导入函数TS类型声明文件路径
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(pathSrc, 'types', 'components.d.ts') // 指定自动导入组件TS类型声明文件路径
      })
    ],
    css: {
      // scss
      preprocessorOptions: {
        //define global scss variable
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@renderer/styles/mixin.scss" as *;`
        }
      }
    }
  }
})
