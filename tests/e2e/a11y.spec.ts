import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('no serious a11y violations on the landing page', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const serious = results.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''));
  expect(serious, JSON.stringify(serious.map(v => v.id))).toEqual([]);
});

test('has exactly one main landmark and at least one h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1').first()).toBeVisible();
});
