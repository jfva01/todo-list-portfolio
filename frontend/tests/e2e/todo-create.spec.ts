import { test, expect } from '@playwright/test';

test.describe('Todo - Create', () => {

  test('user can create a new todo', async ({ page }) => {
    await page.goto('/');

    // Esperar que cargue la app de tareas
    await expect(page.getByText(/ToDo App/i)).toBeVisible();

    // Crear tarea
    const newTodoText = 'Aprender Playwright';
    
    await page.getByPlaceholder(/Título de la tarea/i).fill(newTodoText);
    await page.getByTestId('create-tarea-button').click();

    await expect(page.getByText(newTodoText)).toBeVisible({ timeout: 5000 });
  });

});