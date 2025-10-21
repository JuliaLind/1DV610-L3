# Testrapport

API endpoints har end-2-end tests och service-klasserna som används av web-applikationen har enhetstestats med hjälp av mocha/chai ramverk tillsammans med modulerna sinon (för mockning) samt supertest (för mer läsbara assert konstruktioner i e2e tester). Kodtäckningstabellen är beräknad med c8.   


Efter att du klonat ner repot, installera beroenden (testramverk + eslint):  

```bash
npm install
```

Kör därefter testerna med:

```bash
npm run test
```

## Test specifikation och kodtäckningsrapport

![test specification part 1](.readme/test-results_pt1.png)

![test specification part 2](.readme/test-results_pt2.png)


Testsviterna finns i ./test/routes respektive .test/webapp-services katalogerna.

Lanuella tester av webapplikationen. 

### Test case 1:
1. i Amount-fältet fyll i 100,75
2. i Base Currency listan väld EUR
3. i Target currencies listan bocka i AUD, BGN, samt BRL  
4. Klicka på Convert-knappen  

Resultatet ska visas i en tabell under knappen enligt:

![manual test 1](.readme/test-results_pt1.png)  

### Test case 1:
1. i Amount-fältet fyll i -80
2. i Base Currency listan väld AUD
3. i Target currencies listan bocka i BDT, samt BGN  
4. Klicka på Convert-knappen  

Resultatet ska visas i en tabell under knappen enligt:

![manual test 2 2](.readme/test-results_pt2.png)

