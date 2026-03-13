import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
 import dotenv from 'dotenv';
 import path from 'path';

 //Constantes, primero es el env y el segundo el pais
 const envir = process.env.APP_ENV ?? 'qa'; 
 const country = process.env.COUNTRY ?? 'cl';
 const headed = process.env.HEADED === 'false' ? false : true;
 //Aqui leera el archivo que se defina al ejecutar (por ejemplo .env.qa.cl o .env.prod.pe) // APP_ENV=qa COUNTRY=cl npx playwright test
 dotenv.config({ path: path.resolve(__dirname, `.env.${envir}.${country}`) });
 //Se cargan .local para variables sensibles 
 dotenv.config({ path: path.resolve(__dirname, `.env.${envir}.${country}.local`), override: true }); 
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 5 : undefined,
  /* Reporter to use. If CI, use blob reporter. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'blob' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    //Para desactivar el headless
    headless: !headed,
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    //Este setup tiene un regex en testMatch para que solo ejecute los archivos que terminan con .setup.ts, 
    // asi podemos tener un archivo de setup para hacer el login antes de cada test,
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
     //   contextOptions: {
     //     storageState: 'playwright/.auth/user.json' //Aqui se le dice que cargue el estado de autenticacion desde ese archivo, entonces no se tendra que loguear cada vez, sino que se cargara ese estado y se podra ejecutar los tests directamente.
     //   }
       },
       dependencies: ['setup'] //Aqui ponemos setup, dice que antes de ejecutar los tests de este proyecto, ejecute el proyecto setup, que hara la autenticacion, lo hará una sola vez
    }/*,

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
