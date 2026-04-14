import { test, expect } from '@playwright/test';

test.describe('Todo - Complete', () => {

  test('user can complete todo', async ({ page }) => {
    await page.goto('/');

    // Esperar app
    await expect(page.getByText(/ToDo App/i)).toBeVisible({ timeout: 5000 });

    // Crear tarea
    const newTodoText = `Tarea-${test.info().project.name}-${Date.now()}`;

    await page.getByPlaceholder(/Título de la tarea/i).fill(newTodoText);
    await page.getByTestId('create-tarea-button').click();

    const todoItem = page.getByText(newTodoText);
    await expect(todoItem).toBeVisible({ timeout: 5000 });

    // COMPLETAR (checkbox)
    const checkbox = page.getByRole('checkbox', {
        name: new RegExp(newTodoText, 'i')
    });

    await checkbox.click();

    // Validar cambio (recomendado)
    await expect(checkbox).toHaveAttribute(
        'aria-label',
        /pendiente/i,
        { timeout: 5000 }
    );

    // Validación flexible (ajusta según tu UI)
    await expect(todoItem).toBeVisible({ timeout: 5000 }); // mínimo
    // Opcional si tienes clase:
    // await expect(todoItem).toHaveClass(/completed/);
  });
});