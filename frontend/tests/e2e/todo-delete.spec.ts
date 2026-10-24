import { test, expect } from '@playwright/test';

test.describe('Todo - Delete', () => {
  test('user can delete a todo', async ({ page }, testInfo) => {
  // Arrange: El usuario puede eliminar una tarea.

    await page.goto('/');
    const titulo = `Tarea-${testInfo.project.name}-${Date.now()}`;

    // Act: Crear la tarea desde el formulario
    await page.getByPlaceholder(/Título de la tarea/i).fill(titulo);
    await page.getByTestId('create-tarea-button').click();

    const todoItem = page.getByTestId('todo-item').filter({ hasText: titulo });
    await expect(todoItem).toBeVisible();

    // Assert: Eliminar la tarea de la lista
    await todoItem.getByRole('button', { name: /eliminar tarea/i }).click();
    // Patrón real: eliminación inmediata + toast con opción de deshacer
    await expect(todoItem).toHaveCount(0);
  });
});