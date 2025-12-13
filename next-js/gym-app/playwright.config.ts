// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 120000,
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    viewport: { width: 1920, height: 1080 }, // keeps the screenshots comparisons test-friendly
    deviceScaleFactor: 1,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run dev',              // start Next.js dev server
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,                 // wait up to 2 minutes for server
  },
});
