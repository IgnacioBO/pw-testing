Como actualizar pw?
1) Verificar version con npm outdated @playwright/test
2) npm install -D @playwright/test@latest
3) Luego hay que actualizar browser (generalmetne estan en user/name/AppData/Local/ms-playwright)
4) Para obtener todos los nuevos browser ir a npx playwright install


Ahora para usar env
1) npm i dotenv --save-dev
2) Luego yua esta en package.json
3) Ir a playwright.congfig.ts y descomentar estas lineas
    import dotenv from 'dotenv';
    import path from 'path';
    dotenv.config({ path: path.resolve(__dirname, '.env') });
4) Una manera de configurarlo seria asi, para que sea por env + pais y tener .env.qa.cl o .env.prod.pe
 //Constantes, primero es el env y el segundo el pais
 const envir = process.env.APP_ENV ?? 'qa'; 
 const country = process.env.COUNTRY ?? 'cl';
 //Aqui leera el archivo que se defina al ejecutar (por ejemplo .env.qa.cl o .env.prod.pe) // APP_ENV=qa COUNTRY=cl npx playwright test
 dotenv.config({ path: path.resolve(__dirname, `.env.${envir}.${country}`) });
 5) Pusara usar estas variables con process.env.NOBMREVARIABLE
 6) Ahora ejecutar segun plat
 - bash: APP_ENV=qa COUNTRY=cl npx playwright test
 - powershell: $env:APP_ENV="qa"; $env:COUNTRY="cl"; npx playwright test
 - cmd windows: set "APP_ENV=qa" && set "COUNTRY=cl" && npx playwright test
 7) Para ejecutar tests especificos puede ponerse despues de 'test':
 - si quiero un archivo en especifico con todos sus test: tests/saucedemo.spec.ts
 - si quiero por PARTE del nombre de test (no exacto): -g "comprar un producto"
 - si quiero QUE ejecute los que NO tienen texto: --grep-invert "comprar un producto"
 - si quiero ejecutar por un test en una LINEA especifica de un archivo: tests/checkout.spec.ts:25
 - combinar filtros, por ejemplo archivo + nombre: tests/checkout.spec.ts -g "comprar un producto"
 - usar tags y usar logicas de or (|) and ('=.) y not (--grep-invert), para eso los test deben tener el campo tag: 
    ejemplo de uso de tag en test: test('comprar un producto', { tag: ['@smoke', '@checkout'] }, async ({ page }) => {...})
    # smoke o checkout
    npx playwright test -g "@smoke|@checkout"
    # smoke y checkout
    npx playwright test -g "(?=.*@smoke)(?=.*@checkout)"
    # smoke pero no checkout
    npx playwright test -g "@smoke" --grep-invert "@checkout"

 - tambien puede usarse un comando para repetir la prueba una X cantidad de veces --repeat-each 5 
 - tambien si pongo --debug al final se ejecuta en modo debug e ir linea por linea en cada await
 8) Como extra se cree un config/env.ts que permite ordnar un poco las variables y usarlas directametne, 
   Primero se importando con import { env } from './config/env'; y luego se usa con env.xxxx.xxx
   Hay que tener ojo pq puede dar error si no esta definido un env por defecto o falta definir una variable dentro de el archivo .env


Para sacar screenshots:
A) Puede usarse el comanod  await page.screenshot(); para sacar SS a la pagina actual, ahi puede ponerse el path donde queremos guardar:
  await page.screenshot({path: 'screenshots/product-in-checkout.png', fullPage: true});
B) Tambien puede sacarse screenshot a un element especifico con
  await page.locator('#countries').screenshot({path: 'screenshots/countries.png'});
C) Otra manera es que puede configurarse en playwright.config.ts, dentro de use:{} agregar screenshot:
  - on: saca screenshot al final
  - only-on-failure: al fallar
  Lo bueno de usarlo en playwright.config.ts es que queda guardado en el reporte
D) Lo otro es agregar las screenshot personalizadas al reporte usando:
  - Primero agregar testInfo despues de la llave de {page} en el test:
    test('comprar un producto', {tag: "@POM"}, async ({page}, testInfo)
  - Luego puedo agergar esto
   await testInfo.attach('producto-en-carrito', {
        body: await page.screenshot(),
        contentType: 'image/png'
    });
    - Le pongo un nombre al ss, luego en el body pongo el screehsnot, contenty type imagen.
      tambien puede ponerse un path en el screesnhot () para que la guarde tambien, aparrtt de adjuntar
    await testInfo.attach('producto-en-carrito', {
        body: await page.screenshot({path: 'screenshots/product-in-cart2.png'}),
        contentType: 'image/png'
    });

    - Tambien puede usarse la propiedad "path" para sacar una ss que saque antes en el codigo:
    await page.screenshot({ path: 'screenshots/product-in-cart.png' });
    await testInfo.attach('product-in-cart', {
      path: 'screenshots/product-in-cart.png',
    });

    - Por ultm tambien pueden usarse variables:
    const shot = await page.screenshot({ fullPage: true });
    await testInfo.attach('checkout-fullpage', {
      body: shot,
      contentType: 'image/png',
    });


Usar UI MOD
1) Permite ejecutar cada test y luego inspeccionar cada paso, los elementos, obtener locators, los tiempos, el dom, logs internos, errores, network, etc
npx playwright test --ui
Si no cargan prueba haciando cd a la carpeta de los tests (sepc.ts) y ahi ejecutando

USAR trace on
1) Con Trace on es posible revisar el test completo paso por paso, revisando cada paso, cada elemento del dom, la pagina como estaba, etc.
Para activar usar --trace on
Luego usar npx playwright show-report para poder ir al repote y luego ir a "View Trace"npx playwright test --ui





EXTRAS
- Una manera de evitar que playwright se reconozca como bot y bloquee:
  // --- Stealth: Ocultar webdriver ---
  await page.addInitScript(() => {
    // Ocultar webdriver
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });


- Insturaccion ejemplo para usar MCP de Playwright:
"Usa obligatoriamente las herramientas del servidor MCP de Playwright para navegar el sitio real antes de responder.
Generame un script usando Playwright MCP, tienes que ir a esta pagina. iniciar sesion con user: 180197354 y pas:s Sept.20212021
Luego esperara a que inicie sesion y vuelva a la pagina principal, buscar un producto por su sku (por ejmeplo "MPM20000231770"), luego seleccionar un color (si lo hay para seleccionar) y/o taalla y luego agregarlo al carrito, finalmente ir al carrito y checkear que el mismo producot que agregue. Luego ir al pago, seleccionar Webpay y proceder al pago. En la pagina del pago selccionar tarjetas, poner este numero de tarjeta 4051885600446623 el CV es 123 y fecha expieracio 09/30, en el pago final poner estas credeciales rut 111111111 y pass 123 y aceptar transaccion, al fina ldebe aparecer una pagina con la orden de comrpa generada, obtenerla e imprimrla por consola
La pagina es https://pvalenzuelag@ripley.com:pvalenzuelag@ripley.com@nav-simplest.ripley.cl/"

- Luego otro promppt al finalizar:
"Quiero que sea TS, en formato Page object Model, ordenadito, donde primero se ponen los locator (por ejemplo private readonly userNameTextBox: Locator;) , loeugo cosntructor (que se inicia el locator, por ejemplo this.userNameTextBox = page.getByRole('textbox', { name: 'Username' });) y luegos los metodos."