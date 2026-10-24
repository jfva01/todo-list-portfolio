import { test, expect } from '@playwright/test';

test.describe('Todo - Create', () => {
  test('user can create a new todo', async ({ page }, testInfo) => {
    // Arrange: Abrir la app (la sesión viene del storageState del proyecto)
    // y definir un título único por navegador y por ejecución.
    await page.goto('/');
    const titulo = `Aprender Playwright-${testInfo.project.name}-${Date.now()}`;
    
    // Act: Crear la tarea desde el formulario
    await page.getByPlaceholder(/Título de la tarea/i).fill(titulo);
    await page.getByTestId('create-tarea-button').click();

    // Assert: La tarea aparece en la lista
    await expect(page.getByText(titulo)).toBeVisible();
  });
});