import { test, expect } from '@playwright/test';

test('authenticated user sees the task app, not the login', async ({ page }) => {
  // Arrange / Act: abrir la app (la sesión viene del storageState del proyecto)
  await page.goto('/');

  // Assert: elementos que solo existen con sesión iniciada...
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  await expect(page.getByTestId('create-tarea-button')).toBeVisible();

  // ...y ausencia del formulario de login
  await expect(page.getByPlaceholder(/Email/i)).toHaveCount(0);
});