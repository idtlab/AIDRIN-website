import { test, expect } from '@playwright/test';
test('features lists 6 dimensions', async ({ page }) => {
  await page.goto('/features');
  await expect(page.getByTestId('dimensions').locator('> div')).toHaveCount(6);
});
