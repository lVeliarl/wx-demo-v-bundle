import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/file": {
        target: "http://192.168.0.232:9009",
        changeOrigin: true,
      },
      "/web": {
        target: "http://192.168.0.232",
        changeOrigin: true,
      },
    },
  },

  plugins: [
    dts({
      outDir: "dist/types",
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  build: {
    outDir: "dist",
    assetsDir: "",
    lib: {
      entry: ["src/index.ts"],
      name: "webixWidgets",
      fileName: "webix-widgets",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["@xbs/webix-pro"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          "@xbs/webix-pro": "webix",
        },
        assetFileNames: "webix-expand.css",
      },
    },
  },
});
