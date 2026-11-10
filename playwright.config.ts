import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:4173/quiz_user_gillian93/', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    // Safari engine: catches iOS-only rendering issues (3D flip, focus, media).
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: { command: 'npm run preview -- --port 4173', url: 'http://127.0.0.1:4173/quiz_user_gillian93/', reuseExistingServer: !process.env.CI },
})
