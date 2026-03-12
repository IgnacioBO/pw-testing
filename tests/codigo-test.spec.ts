import { test, expect } from '@playwright/test';

// Test automatizado para https://automationintesting.com/selenium/testpage/
test('Rellenar formulario y enviar (Playwright MCP)', async ({ page }) => {
  // Ir a la página
  await page.goto('https://automationintesting.com/selenium/testpage/');

  // Rellenar campos de texto
  await page.getByRole('textbox', { name: 'First name' }).fill('Juan');
  await page.getByRole('textbox', { name: 'Surname' }).fill('Pérez');

  // Seleccionar género
  await page.getByLabel('Gender -- select an option').selectOption(['Male']);

  // Seleccionar color favorito (Red)
  await page.locator('#red').click();

  // Seleccionar contacto por Email
  await page.getByRole('checkbox', { name: 'Email' }).click();

  // Rellenar campo "Tell me more!"
  await page.getByRole('textbox', { name: 'Tell me more!' }).fill('Esto es una prueba automatizada con Playwright MCP.');

  // Seleccionar continentes visitados (Europe, North America)
  await page.getByLabel('Which continents have you').selectOption(['Europe', 'North America']);

  // Tomar screenshot del formulario lleno
  await page.screenshot({ path: 'screenshots/form-filled.png', type: 'png' });

  // Esperar 1 segundo
  await page.waitForTimeout(1000);

  // Enviar el formulario (clic en "I do nothing!")
  await page.getByRole('button', { name: 'I do nothing!' }).click();

  // Puedes agregar aquí más validaciones si lo deseas
});
