import { test, expect } from '@playwright/test';
test('home renders wordmark and theme toggles', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('placeholder')).toHaveText('AIDRIN');
  const html = page.locator('html');
  const before = await html.getAttribute('class');
  await page.getByLabel('Toggle dark mode').click();
  await expect(html).not.toHaveClass(before ?? '');
});
