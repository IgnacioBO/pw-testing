import test from '@playwright/test';
import { env } from './config/env';
import { Product } from './models/product';
import { CartPage } from './pageobjects/cart-page';
import { CheckoutPage } from './pageobjects/checkout-page';
import { HomePage } from './pageobjects/home-page';
import { LoginPage } from './pageobjects/login-page';
import { ProductPage } from './pageobjects/product-page';

test('modificar respusta libros', {tag: "@lol"}, async ({page}, testInfo) => {
    //Esta pagina cuando carga le pega a una api: https://demoqa.com/BookStore/v1/Books
    //Esta devuelve un json con libos, entonces podemos escuchar esa peticion y modificar la respuesta para que nos devuelva un libro diferente o vacio o lo que queramos

    //Primero hacemos que cuando se haga la peticion a esa url, se ejecute esta funcion de adentro
    await page.route('https://demoqa.com/BookStore/v1/Books', async (route) => {
        //route.fulfill permite modificar la respuesta de esa peticion, entonces le podemos pasar un json con los libros que queramos, por ejemplo vacio o con un libro random
        //primero dejaremos el satuts y headers originales
        //Luego el body lo cambiartemos
        //Fulfill reemplaza la respuesta original por la que nosotros le pasemos, entonces en este caso aunque la pagina intente cargar los libros originales, como nosotros le decimos que la respuesta de esa peticion es otra, entonces la pagina va a cargar el libro que nosotros le pasamos en el body, y no los libros originales.
        //Y si quiero modificar solo parte de la respuesta original, por ejemplo agregar un libro a la respuesta original, entonces primero hago un route.fetch() para obtener la respuesta original, luego la modifico y luego hago el route.fulfill() con la respuesta modificada.
        route.fulfill({
            status: 304,
            headers: {
                'Content-Type': 'application/json'
            },
            body: `{
        "books": [
            {
                "isbn": "9781449325862",
                "title": "Mi libro loco",
                "subTitle": "A Working Introduction",
                "author": "Richard E. Silverman",
                "publish_date": "2020-06-04T08:48:39.000Z",
                "publisher": "O'Reilly Media",
                "pages": 234,
                "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git exp",
                "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
        }]
        }` 
        })

    });



    
    await page.waitForTimeout(3000);

    await page.goto('https://demoqa.com/books');
    await page.waitForLoadState('networkidle');

    await page.screenshot({path: 'screenshots/books1.png', fullPage: true});

    await page.waitForTimeout(6000);
});

test('obtener y modificar la respuesta de libros', {tag: "@lol"}, async ({page}, testInfo) => {
    //Esta pagina cuando carga le pega a una api: https://demoqa.com/BookStore/v1/Books
    //Esta devuelve un json con libos, entonces podemos escuchar esa peticion y modificar la respuesta para que nos devuelva un libro diferente o vacio o lo que queramos

    //Ahora lo mismo pero usando fetch() para obtener la respuesta original y modificarla
    await page.route('https://demoqa.com/BookStore/v1/Books', async (route) => {
        const response = await route.fetch();
        //Esto es agregado mio, ponemos json de tipo {books: any[]} porque la respuesta original es un json con una propiedad books que es un array de libros
        //Asi intellisense me reconoce que json.books es un array y me da las opciones de array, como el push, pop, etc.
        const json: {books: any[]} = await response.json();
        let a = [0,1,2];
        //Ahora modificamos el json original, por ejemplo agregamos un libro a la respuesta original al principio del array
        json.books.unshift({
            "isbn": "9781449325862",
            "title": "Mi libro loco",
            "subTitle": "A Working Introduction",
            "author": "Richard E. Silverman",
            "publish_date": "2020-06-04T08:48:39.000Z",
            "publisher": "O'Reilly Media",
            "pages": 234,
            "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git exp",
            "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
        });
        //Ahora hacemos un fulfill con la respuesta modificada
        route.fulfill({
            //Aqui ponemos solo response y body, porque si ponemos status y headers, se sobreescriben los originales, entonces para mantener los originales solo ponemos el body modificado y el response original, asi mantenemos el status y headers originales.
            //Al ponser response, el fulfill mantiene el status y headers originales, y al poner body, se reemplaza solo el body.
            response,
            body: JSON.stringify(json)
        });
    });



    await page.waitForTimeout(3000);

    await page.goto('https://demoqa.com/books');
    await page.waitForLoadState('networkidle');
    await page.screenshot({path: 'screenshots/books2.png', fullPage: true});

    await page.waitForTimeout(6000);
});


test('libros base', {tag: "@lol"}, async ({page}, testInfo) => {
    //Esta pagina cuando carga le pega a una api: https://demoqa.com/BookStore/v1/Books
    //Esta devuelve un json con libos, entonces podemos escuchar esa peticion y modificar la respuesta para que nos devuelva un libro diferente o vacio o lo que queramos
    
    await page.waitForTimeout(3000);

    await page.goto('https://demoqa.com/books');
    await page.waitForLoadState('networkidle');
 // await page.screenshot({path: 'screenshots/books.png', fullPage: true});

    await page.waitForTimeout(6000);
}); 
