import { test, expect } from '@playwright/test';
test('integrations page lists 6 access modes and advanced integrations', async ({ page }) => {
  await page.goto('/integrations');
  await expect(page.getByTestId('access-modes').locator('> div')).toHaveCount(6);
  await expect(page.getByTestId('integrations')).toContainText('OpenTelemetry');
  await expect(page.getByTestId('integrations')).toContainText('APPFL');
});
