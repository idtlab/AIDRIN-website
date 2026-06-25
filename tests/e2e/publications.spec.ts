import { test, expect } from '@playwright/test';
test('publications lists all 5 papers, newest first', async ({ page }) => {
  await page.goto('/publications');
  const items = page.getByTestId('pub-list').locator('li');
  await expect(items).toHaveCount(5);
  await expect(items.first()).toContainText('2025');
});
