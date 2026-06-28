import { test, expect } from '@playwright/test';
test('home renders wordmark and theme toggles', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'AIDRIN' }).first()).toBeVisible();
  const hadDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
  await page.getByLabel('Toggle dark mode').first().click();
  await expect.poll(() => page.locator('html').evaluate(el => el.classList.contains('dark'))).toBe(!hadDark);
});
