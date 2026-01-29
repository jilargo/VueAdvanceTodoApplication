//This is a helper from Playwright to define the configuration with proper typings
import { defineConfig } from "@playwright/test";   

export default defineConfig({
  testDir: "./test",
  timeout: 60000,
  workers: 1,
    use: {
        baseURL: 'http://localhost:5173',
        headless: true,
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
        video: 'retain-on-failure',
        // launchOptions: {
        //   slowMo: 500,
        // },
    },
    reporter: [['html', { open: 'never' }], ['list']],
});