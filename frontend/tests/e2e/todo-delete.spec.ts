import { test, expect } from '@playwright/test';

test.describe('Todo - Delete', () => {

  test('user can delete a todo', async ({ page }) => {
    await page.goto('/');

    // Asegurar login visible
    await expect(page.getByPlaceholder(/Email/i)).toBeVisible({ timeout: 5000 });

    // LOGIN
    await page.getByPlaceholder(/Email/i).fill('test@test.com');
    await page.getByPlaceholder(/Password/i).fill('Test123');
    await page.getByTestId('login-button').click();

    // Esperar app
    await expect(page.getByText(/ToDo App/i)).toBeVisible({ timeout: 5000 });

    // Crear tarea única
    const newTodoText = `Tarea-${test.info().project.name}-${Date.now()}`;

    await page.getByPlaceholder(/Título de la tarea/i).fill(newTodoText);
    await page.getByTestId('create-tarea-button').click();

    const todoItem = page.getByTestId('todo-item').filter({ hasText: newTodoText });
    await expect(todoItem).toBeVisible({ timeout: 5000 });

    // ELIMINAR (botón eliminar asociado a la tarea)
    const deleteButton = todoItem.getByRole('button', {name: /eliminar tarea/i});

    await deleteButton.click();

    // MODAL DE CONFIRMACIÓN
    const confirmButton = page.getByRole('button', {
      name: /Confirmar/i
    });

    await expect(confirmButton).toBeVisible({ timeout: 5000 });
    await confirmButton.click();

    // Validar que desaparece
    await expect(page.getByText(newTodoText)).not.toBeVisible({ timeout: 5000 });
  });

});