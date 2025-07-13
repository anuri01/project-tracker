import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // 'describe', 'it' 등을 import 없이 사용하게 해줍니다.
    globals: true,
    // 테스트 환경을 브라우저처럼 만들어주는 'jsdom'을 사용합니다.
    environment: 'jsdom',
    // 모든 테스트가 실행되기 전에 이 파일을 먼저 실행합니다.
    setupFiles: './src/setupTests.js', 
  },
})
