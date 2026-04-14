import { test, expect } from '@playwright/test';

test('app loads correctly', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /todo/i })
  ).toBeVisible();
});