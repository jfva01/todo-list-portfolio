import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder(/Email/i).fill('test@test.com');
  await page.getByPlaceholder(/Password/i).fill('Test123');
  await page.getByTestId('login-button').click();

  await expect(page.getByText(/ToDo App/i)).toBeVisible();

  // Guardar sesión
  await page.context().storageState({ path: 'storageState.json' });
});