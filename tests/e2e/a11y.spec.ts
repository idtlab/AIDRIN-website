import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const path of ['/', '/features', '/integrations', '/get-started', '/publications']) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze();
    const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact ?? ''));
    expect(serious, JSON.stringify(serious.map(v=>v.id))).toEqual([]);
  });
}
