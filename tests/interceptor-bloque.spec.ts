import {test, expect, Locator} from '@playwright/test';
import { LoginPage } from './pageobjects/login-page';
import { HomePage } from './pageobjects/home-page';
import { ProductPage } from './pageobjects/product-page';
import { CartPage } from './pageobjects/cart-page';
import { CheckoutPage } from './pageobjects/checkout-page';
import { env } from './config/env';
import { Product } from './models/product';

test('comprar un producto', {tag: "@lol"}, async ({page}, testInfo) => {
    
    const user: string = process.env.TEST_USER || ""; 
    const pass: string = process.env.TEST_PASS || "";
    const url: string = env.urls.frontend;
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    let productoRandomSel: Product; 
 
    //Aqui el page.on permite escuchar todos los eventos de distitno tipo
    //En este caso es "request" que es cada vez que se hace una peticion http, entonces se imprime la url de cada peticion
    await page.on("request", req =>{
        console.log(req.url());
    }) //Aqui imprmie varias request entre ellas varias imagenes.
    //Puedo bloquearlas
    // Por ejmeplo esta https://www.saucedemo.com/static/media/sauce-backpack-1200x1500.0a0b85a385945026062b.jpg

    //page.route permite interceptar las peticiones y decidir que hacer con ellas, por ejemplo bloquearlas, 
    // o modificarlas, o simplemente escuchar la respuesta.
    //page.route('puede ser un url exacta o un patron con * o regex', async (route, request) => {
    await page.route("https://www.saucedemo.com/static/media/sauce-backpack-1200x1500.0a0b85a385945026062b.jpg", 
        async (route) => {
        //Bloquear la imagen
        await route.abort();
    });

    //Bloquear com regex: **/*.{png,jpg,jpeg}
    //ese regexx bloquea todas las imagenes png, jpg y jpeg de cualquier url
    await page.route("**/*.{png,jpg,jpeg}", async (route) => {
        await route.abort();
    });

    //Aqui podemos bloquear hasta css u otras cosas.
    //await page.route('**/*.{css}', async (route) => {
   //     await route.abort();
   // });




    await loginPage.login(url, user, pass);
    //Se recomienda dejar la asercion separada del metodo de accion asi que
    await loginPage.verifyLoginSuccess();
    //otros literal es hacer la asercion directo en el test, y dejar el metodo de login solo para la accion de login, sin aserciones, y la asercion hacerla aca sin un metodo
    /*const headerText = await page.locator(".app_logo");
    await expect(headerText).toContainText('Swag Labs');*/
    
    await page.screenshot({path: 'screenshots/homepage-sinimg.png', fullPage: true});

    productoRandomSel = await homePage.clickOneRandomProduct();
    console.log(`Producto random elegido: ${JSON.stringify(productoRandomSel)}`);

    await productPage.verifyProductDetails(productoRandomSel);
    await productPage.addToCart();

    await cartPage.verifyPageLoaded();
    await cartPage.verifyIfProductInCart(productoRandomSel);
    //Guardar ss en carpeta
    await page.screenshot({path: 'screenshots/product-in-cart.png'});

    //Guardar ss en reporte
    await testInfo.attach('producto-en-carrito', {
        body: await page.screenshot({path: 'screenshots/product-in-cart2.png'}),
        contentType: 'image/png'
    });
    await cartPage.screenshotCartItems();
    await cartPage.goToCheckout();

    await checkoutPage.fillCheckoutForm('Juan', 'Perez', '12345');
    await checkoutPage.continueCheckoutPt2();
    //SS completa sin scroll
    await page.screenshot({path: 'screenshots/product-in-checkout.png', fullPage: true});
    await checkoutPage.verifyIfProductInCheckout(productoRandomSel);
    await checkoutPage.verifySubTotalPrice(productoRandomSel);
    await checkoutPage.finishCheckout();
    
    await page.waitForTimeout(1000);

});