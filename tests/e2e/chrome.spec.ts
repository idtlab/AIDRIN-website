import { test, expect } from '@playwright/test';
test('exactly one primary CTA in nav, pointing to inspector', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('cta-primary');
  await expect(cta).toHaveCount(1);
  await expect(cta).toHaveText('Launch Inspector');
  await expect(cta).toHaveAttribute('href', 'https://aidrin.org/inspector');
});
test('footer has funding line', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toContainText('National Science Foundation');
});
