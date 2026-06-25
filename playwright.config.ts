import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  webServer: { command: 'npm run preview', url: 'http://localhost:4321', reuseExistingServer: true, timeout: 120000 },
  use: { baseURL: 'http://localhost:4321' },
});
