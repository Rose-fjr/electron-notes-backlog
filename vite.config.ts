import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import buildElectron from '@bin-tools/build-electron'
// import buildElectron from './src/plugins/build-electron'


const vueOutDir = "./release/bundle";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), buildElectron()],
  base: './',
  build: {
    outDir: vueOutDir,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router'],
          moment: ['moment']
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
      "@app": path.resolve(__dirname, 'src/app'),
      "@pages": path.resolve(__dirname, 'src/app/pages'),
      "@common": path.resolve(__dirname, 'src/common'),
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true;@import (reference) "${path.resolve('src/app/index.less')}";`
        },
        javascriptEnabled: true,
      }
    }
  },
  // @ts-ignore 打包electron配置
  electron: {
    // 打包的入口文件
    entry: path.join(process.cwd(), 'src/main/index.ts'),
    // 输出的文件路径 使用 vite中的配置 build.outDir
    // 输出的文件名
    outPut: 'entry.js',
    // electron-builder  参考 https://github.com/electron-userland/electron-builder 配置
    builderOptions: {
      config: {
        directories: {
          output: './release/release',
          app: vueOutDir
        },
        files: ['**'],
        productName: "便签",
        appId: "com.bianqian.binbin",
        asar: true,
        extraResources: './resource/release',
        win: {
          target: ['zip', 'nsis'],
          icon: "./public/logo.ico"
        },
        mac: {
          icon: "./public/logo.ico",
          category: "public.app-category-productivity",
          artifactName: "${productName}_${version}.${ext}",// 应用程序包名
          target: ["dmg", "zip"]
        }
      },
      projectDir: process.cwd(),
    },
    // 静态资源拷贝
    staticDir: [{
      // 源文件夹路径
      src: "src/static",
      // 目标文件夹路径
      dest: vueOutDir.substring(2, vueOutDir.length) + '/static',
    }]
  }
})
