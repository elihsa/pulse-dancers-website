/** AppCheck regression config: runs the persisted regression suite in .appcheck/tests/regression */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '/home/eli/pulse-dancers-website/.appcheck/tests/regression',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'https://pulse-dancers-website.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  timeout: 90000,
  globalTimeout: 300000,
});