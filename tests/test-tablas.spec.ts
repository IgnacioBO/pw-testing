import { test, expect } from '@playwright/test';
import { TablePage } from './pageobjects/table-page';
import { CountryVisited } from './models/country-visited';

test('test tablas', async ({ page }) => {
    let countryVisited: CountryVisited[];

    const tablePage = new TablePage(page);
    await tablePage.goTo();
    await tablePage.validateTitle();
    await tablePage.getColumnIndexByName();
    await tablePage.checkRadomCountryVisited(30);
    
   // await tablePage.imprimirTabla();

    countryVisited = await tablePage.guardarTablaEnInterface();
    
   /* for (const country of countryVisited) {
        console.log(country);
    }*/

    //const countriesWherePeopleSpeakSpanish = countryVisited.filter(c => c.language.includes('Spanish'));
    //const countriesWherePeopleSpeakSpanish = countryVisited.filter(c => c.language.some(oneLang => oneLang.toLocaleLowerCase().includes('spanish')));
    const countriesWherePeopleSpeakSpanish = countryVisited.filter(c => c.language.toString().toLocaleLowerCase().includes('spanish'));
    console.log('Countries where people speak Spanish:');
    for (const country of countriesWherePeopleSpeakSpanish) {
        console.log(country);
    }

});