import {test as setup, expect} from "@playwright/test";
import { env } from "./config/env";
import { LoginPage } from "./pageobjects/login-page";
//Aqui podemos configurar el login para que se ejecute antes de cada test, y asi no tener que repetir el login en cada test,
//y ademas aprovechar la funcionalidad de playwright de guardar el estado de autenticacion en un archivo .auth, para no tener que loguearnos cada vez que ejecutamos los tests, sino que solo la primera vez, y luego cargar ese estado en los siguientes tests.
const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({page}) => {
    let loginPage = new LoginPage(page);
    const user: string = process.env.TEST_USER || ""; 
    const pass: string = process.env.TEST_PASS || "";
    const url: string = env.urls.frontend;
    await loginPage.login(url, user, pass); 
    await loginPage.verifyLoginSuccess();

    //Con storageState podemos guardar el estado de autenticacion en un archivo,
    //  para luego cargarlo en los siguientes tests y no tener que loguearnos cada vez.
    //El path le pondremos authFile, osea guardara el estado de autenticacion en el archivo .auth/user.json, 
    // entonces la primera vez que ejecutemos los tests, se logueara y se guardara el estado en ese archivo, 
    // y luego en los siguientes tests, se cargara ese estado desde ese archivo y no se tendra que loguear cada vez.
    await page.context().storageState({path: authFile});

    //Se puede usar de varias maneras, 
    // 1) puede usarse en config.ts para que se ejecute antes de cada test, o puede usarse en un test especifico para que se ejecute solo en ese test, o puede usarse en un describe para que se ejecute antes de cada test dentro de ese describe.
    // 2) PAra usarl el storageStane en un describe se puede uusar:
    /*test.describe("Tests con autenticacion", () => {
    test.beforeEach(async ({page}) => {
        await page.context().storageState({path: authFile});
    });*/

    //3) Si se uso de manera global, en pw,config.ts y quero que no se use:
    //  entonces en el test especifico o describe especifico, se puede usar storageState: undefined, para que no se use el estado de autenticacion guardado en el archivo, y se tenga que loguear cada vez en ese test o describe.

});