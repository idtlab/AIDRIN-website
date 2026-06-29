import { test, expect } from '@playwright/test';
test('exactly one primary CTA in nav, pointing to inspector', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('cta-primary');
  await expect(cta).toHaveCount(1);
  await expect(cta).toHaveText('Demo');
  await expect(cta).toHaveAttribute('href', 'https://demo.aidrin.org');
});
test('footer shows institutional acknowledgement logos', async ({ page }) => {
  await page.goto('/');
  const ack = page.locator('footer .ack-strip');
  await expect(ack.locator('img.ack-logo')).toHaveCount(4);
  await expect(ack.locator('img[alt*="Argonne"]')).toBeVisible();
  await expect(ack.locator('img[alt*="Office of Science"]')).toBeVisible();
});
