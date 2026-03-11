import { test, expect, Locator } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});


test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


//page permite acceder a la funcionaldia de playwright
test('test meli busqueda', async ({ page }) => {
  //Vamos abrir un navgador iremos a MercadoLibre, buscador buscamos y veremos resultados de la busqueda
  //Primero abiremors un browser
  await page.goto('https://www.mercadolibre.cl/');

  //PW recomeinda este orden 
  /*
  getByRole - El mejor, más robusto
  getByLabel - Para formularios | getByPlaceholder - Para inputs
  getByText - Para texto visible | Alt | Title
  getByTestId - Para testing
  locator() CSS
  locator() XPath 
  */

  /* ELEMENTO A ANALIZAR
  <label class="nav-header-visually-hidden" for="cb1-edit">Ingresa lo que quieras encontrar</label>
  <input type="text" class="nav-search-input" id="cb1-edit" placeholder="Buscar productos, marcas y más…" 
  maxlength="120" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="off" 
  name="as_word" value="" aria-activedescendant="" aria-controls="sb-suggestions-1" aria-autocomplete="list" 
  aria-expanded="false" role="combobox">
  */
  //By Role busca el rol del elemento, en este caso el combobox
  //Y luego el NOMBRE ACCESIBLE del elemento. (un <label> asociado, aria-label, aria-labelledby)
  //Esta info (role y acesible name) puede obtenerse con devtools de CHrome e ir a accessibility.
  // El exact: true es para que debe ser equal al name (es decir sin diferncia de mayusculas y exacto), en false ignora mayusculas y puede ser parte (include) del name.
  // Por defeco el exact es false, asi que no es necesario ponerlo, pero lo pongo para que quede claro.
  //El click no es necesario, pero se pone para demostrar las acciones posibles
  //NOTA, tambien el "Name" peuede sacrse de un  hijo, si no lo tiene el padre. 
  // Por ejemplo, si hay quiero captura una fila (row) <tr> pero no tiene accesibilt name y dentro tiene muchas celdas <td> y una de esas celdas tiene el name, entonces el getByRole('row', {name: 'el name de la celda'}) va a capturar la fila, porque el name lo saca de la celda hija.
  await page.getByRole('combobox', { name: 'Ingresa lo que quieras encontrar', exact: true }).click();

  //GetByLabel es solo para los inputs, y busca el label asociado al input, o el aria-label o aria-labelledby
  //Similar al getByRole, el exact es para que sea igual al name del label, o puede ser parte del name.
  await page.getByLabel('ingresa lo que').fill('laptop');

  //El getByPlaceholder es para los inputs, y busca el placeholder del input, o el aria-placeholder
  //Similar al getByRole, el exact es para que sea igual al name del placeholder, o puede ser parte del name.
  //El .press es para simular el enter, o cualquier tecla, o combinacion de teclas.
  await page.getByPlaceholder('buscar productos').press('Enter');

  //Tambien puede usarse page.keyboard para simular el teclado, en este caso el enter, sin especificar el elemento, pero esto es menos recomendado, ya que no es tan robusto, ya que si hay otro elemento con foco, el enter se va a enviar a ese elemento.
  //await page.keyboard.press('Enter');

  //Una manera de guardar usarlo depsues es guardar el locator en una variable, y luego usar esa variable para hacer las aserciones.
  //Aqui usare xpath para ejemplificar locator
  const buscador = page.locator('//input[@id="cb1-edit"]');
  //lueego se usa (un expect) para hacer las aserciones, en este caso que el valor del input sea laptop.
  await expect(buscador).toHaveValue('laptop');

  //Aqui usamos locator, en este caso CSS. El punto es para indicar que es una clase de ese elemento (la ventaja con xpath, es q es con contains incluido, en xpath hay que especificar contains y queda mas verboso)
  //Como devuelve muchos, se usa el first() para obtener el primero, o el nth(0) para obtener el primero, nth(1) para el segundo, etc.
  const primerResultado: Locator = page.locator('li.ui-search-layout__item').first();
  const todosLosResultados: Locator = page.locator('li.ui-search-layout__item');

  //Aqui esperamos que el primer resultado sea visible, esto es importante para asegurarnos que el resultado se cargo antes de hacer las siguientes acciones, esto es importante para evitar errores de elementos no encontrados o no interactuables.
  await expect(primerResultado).toBeVisible();

  const tituloPrimerResultado = await primerResultado.locator('//h3').innerText();
  const todosLosTitulos = await todosLosResultados.locator('//h3').allInnerTexts();

  console.log('Titulo del primer resultado: ', tituloPrimerResultado);
  console.log('Cantidad de resultados: ', todosLosTitulos.length);


  //Ahora tambien podes iterar en todos los titulkso
  for (let titulo of todosLosTitulos) {
    //console.log('Titulo: ', titulo);
  }

  await primerResultado.click();

  //Aqui esperamos el state de carga del sitio, para asegurarnos que se cargo completamente antes de hacer las siguientes acciones, esto es importante para evitar errores de elementos no encontrados o no interactuables.
  await page.waitForLoadState('load');



});
