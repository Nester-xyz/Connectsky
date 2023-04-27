// vite.config.ts
import { defineConfig } from "file:///C:/Users/Nitro-5/Desktop/projects/ankit/extensions/unnamed/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Nitro-5/Desktop/projects/ankit/extensions/unnamed/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\Nitro-5\\Desktop\\projects\\ankit\\extensions\\unnamed";
var vite_config_default = defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        welcome: "public/welcome.tsx",
        background: "public/background.tsx",
        main: resolve(__vite_injected_original_dirname, "index.html")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].[hash].js",
        format: "esm",
        dir: "dist"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxOaXRyby01XFxcXERlc2t0b3BcXFxccHJvamVjdHNcXFxcYW5raXRcXFxcZXh0ZW5zaW9uc1xcXFx1bm5hbWVkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxOaXRyby01XFxcXERlc2t0b3BcXFxccHJvamVjdHNcXFxcYW5raXRcXFxcZXh0ZW5zaW9uc1xcXFx1bm5hbWVkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9OaXRyby01L0Rlc2t0b3AvcHJvamVjdHMvYW5raXQvZXh0ZW5zaW9ucy91bm5hbWVkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6IFwiZGlzdFwiLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBpbnB1dDoge1xyXG4gICAgICAgIHdlbGNvbWU6IFwicHVibGljL3dlbGNvbWUudHN4XCIsXHJcbiAgICAgICAgYmFja2dyb3VuZDogXCJwdWJsaWMvYmFja2dyb3VuZC50c3hcIixcclxuICAgICAgICBtYWluOiByZXNvbHZlKF9fZGlybmFtZSwgXCJpbmRleC5odG1sXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJbbmFtZV0uanNcIixcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJjaHVua3MvW25hbWVdLltoYXNoXS5qc1wiLFxyXG4gICAgICAgIGZvcm1hdDogXCJlc21cIixcclxuICAgICAgICBkaXI6IFwiZGlzdFwiLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnWCxTQUFTLG9CQUFvQjtBQUM3WSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxZQUFZO0FBQUEsUUFDWixNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQ3ZDO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixRQUFRO0FBQUEsUUFDUixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
