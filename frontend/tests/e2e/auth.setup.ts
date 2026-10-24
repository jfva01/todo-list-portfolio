import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder(/Email/i).fill('test@test.com');
  await page.getByPlaceholder(/Password/i).fill('Test321');

  // La espera se registra antes del clic para no perder la respuesta
  const loginResponse = page.waitForResponse(
    (r) => r.url().includes('/api/auth/login') && r.request().method() === 'POST'
  );

  await page.getByTestId('login-button').click();
  expect((await loginResponse).ok()).toBeTruthy();

  // Elemento que solo existe con sesión iniciada
  await expect(page.getByTestId('create-tarea-button')).toBeVisible();

  // Guardar sesión
  await page.context().storageState({ path: 'storageState.json' });
});