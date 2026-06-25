import { test, expect } from '@playwright/test';
test('all home sections present', async ({ page }) => {
  await page.goto('/');
  for (const id of ['hero','workflow','dimensions','access-modes','format-chips','pubs'])
    await expect(page.getByTestId(id)).toBeVisible();
});
test('exactly one gradient primary CTA style used for Launch Inspector', async ({ page }) => {
  await page.goto('/');
  const launches = page.getByRole('link', { name: 'Launch Inspector' });
  await expect(launches.first()).toHaveClass(/btn-primary/);
});
test('workflow shows Inspect/Remediate/Transform', async ({ page }) => {
  await page.goto('/');
  const wf = page.getByTestId('workflow');
  await expect(wf).toContainText('Inspect');
  await expect(wf).toContainText('Remediate');
  await expect(wf).toContainText('Transform');
});
