import { test, expect } from '@playwright/test';
test('get-started shows pip install and from-source steps', async ({ page }) => {
  await page.goto('/get-started');
  await expect(page.locator('body')).toContainText('pip install aidrin');
  await page.getByText('From source').first().click();
  await expect(page.locator('body')).toContainText('conda create -n aidrin-env');
});
