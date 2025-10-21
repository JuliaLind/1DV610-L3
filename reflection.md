# Reflektion  

Efter att ha analyserat koden i L2 och fått feedback från medstudenter genomförde jag en ganska omfattande refaktorering av merparten av de privata delarna i L2-modulen, samt vissa publika metoder. Jag har förstås sett till att nya versioner som jag publicerat på npm följt principerna för semantic versioning, där ändringar i publika metoder som påverkar bakåtkompatibiliteten medfört publicering av en ny major version av modulen.

## Kapitel 2  - Meaningful Names

Jag har skrivit om onödiga förkortningar i modulen till längre, mer beskrivande namn som gör koden lättare för andra att förstå. Till exempel har jag ändrat metodnamnet #prep() till #prepareRates(). I vissa fall har jag dock behållit förkortningar där de känts vedertagna och tydliga i sammanhanget.  

Jag har även ändrat på namn som kunde vara missvisande. Till expempel hade jag en metod som hette #isReady(), men den returnerade inte en boolean, utan kastade ett fel om klassen inte var redo. Jag misstänker att jag ursprungligen tänkte att den skulle returnera ett booleanvärde, men ändrade mig under arbetets gång. Metoden bytte jag därför namn på till #alertIfNotReady(), vilket tydligare visar att den utför en handling i stället för att returnera ett värde.    

Överlag tycker jag att min kod följer bokens namngivningsregler väl. Även om jag ibland tycker att det är svårt att hitta namn som är både korta och beskrivande (kanske på grund av begränsat ordförråd eller fantasi), har jag varit noga med att följa de övriga principerna: inga onödiga prefix, interna termer eller förkortningar, ingen typinformation i variabelnamn, samt namn som är sökbara och konsekventa.  

Jag undviker generellt korta namn, även i lokala block föredrar jag att använda tydliga variabelnamn, till och med i for-loopar. Det handlar inte bara om sökbarhet, utan också om att det annars kan bli svårt att hålla isär vad man faktiskt itererar över, särskilt i kod med flera loopar eller nästlade strukturer. Det märktes extra tydligt i denna uppgift, eftersom Norges API har en ganska komplex och nästlad svarstruktur.  

Just det här med prefix funderade jag extra på när jag skapade egna komponenter. Custom components måste bestå av minst två ord med bindestreck mellan, för att undvika framtida konflikter med eventuella nya html element. I tidigare kurser har vi fått lära oss att ett sätt att undvika krockar är att prefixa sina komponenter, till exempel med sina initialer, som jl-table. På så sätt minskar man risken att ens egna element krockar med andras. Samtidigt motsäger det regeln om att undvika prefix, vilket gör det lite klurigt att avgöra vad som är mest konsekvent. I denna uppgift valde jag att följa bokens rekommendationer och inte använda prefix.   

Jag har även försökt följa regeln om "one word per concept", men kom flera gånger på mig själv med att fundera över om vissa ord egentligen beskriver samma koncept eller om det är olika koncept.  Ett exempel är fetch och get. get används normalt sett för att hämta värden från privata attribut (accessors), men i tidigare kurser har vi lärt oss att controller-metoder ofta döps efter de http-anrop de hanterar, till exempel get för get-request och post för post-request. När jag har metoder som anropar ett API känns det mest naturligt att använda fetch. Men om jag ska hämta data och bara anropar API:et om datan inte redan finns cachad, ska det då heta get eller fetch? Likaså, om metoden gör en get-request till API:et kanske den bör heta get, även om det är den enda metoden som kommunicerar med API:et. Då undviker man att behöva döpa om den i framtiden om det tillkommer en post-metod. Å andra sidan skulle det kanske vara ett tillfälle att använda polymorfism, där Get och Post är två klasser som båda har en metod som heter fetch. På så sätt blir begreppet mer enhetligt, samtidigt som implementationen skiljer sig åt beroende på kontext. Just get och fetch har jag nog inte varit helt konsekvent med i denna uppgift (och i tidigare uppgifter), även om jag har försökt att tänka att jag skulle vara det.


## Kapitel 3  - Functions

Jag har justerat abstraktionsnivån i min kod genom att plocka ut delar som låg på en annan nivå än övriga delar i metoden. Till exempel har:

```js
  /**
   * Prepares the converter by fetching and normalizing rates.
   *
   * @returns {Promise<void>} - A promise that resolves when preparation is complete.
   */
  async #prep () {
    if (this.#normalizer.hasCachedRates()) {
      return
    }

    this.#isReady()
    this.#fetcher.setCurrencies([this.#fromCurrency, ...this.#toCurrencies])
    const rates = await this.#fetcher.fetchLatest()

    this.#normalizer.setFromCurrency(this.#fromCurrency)
    this.#normalizer.setToCurrencies(this.#toCurrencies)
    this.#normalizer.normalize(rates)
  }
```

blivit:

```js
  /**
   * Prepares the converter by fetching and normalizing rates.
   *
   * @returns {Promise<void>} - A promise that resolves when preparation is complete.
   */
  async #prepareRates () {
    if (!this.#normalizer.hasCachedRates()) {
      await this.#getRatesFromApi()
    }
  }

  /**
   * Fetches rates from the API.
   */
  async #getRatesFromApi () {
    this.#alertIfNotReady()
    this.#assignCurrencies()
    await this.#fetchRates()
  }

  /**
   * Assigns the base and target currencies to the fetcher and normalizer.
   */
  #assignCurrencies () {
    this.#normalizer.setBaseCurrency(this.#baseCurrency)
    this.#normalizer.setTargetCurrencies(this.#targetCurrencies)
  }

  /**
   * Fetches latest exchange rates
   * from the external API.
   */
  async #fetchRates () {
    const rates = await this.#fetcher.fetchLatest(this.#getRequestParams())

    this.#normalizer.normalize(rates)
  }
```
Den här refaktoreringen gör att varje metod följer signle-responsibility principle - "Do one thing" ur boken. Den nya strukturen gör också att koden kan läsas uppifrån och ned som en berättelse, vilket ligger helt i linje med författarens Step-Down regel.  

Jag har även funderat över när det är mest lämpligt att använda argument respektive medlemsvariabler. Jag kom fram till att om en variabel behöver nås från flera metoder, ska den sättas som attribut. Men om den bara används i en enskild metod och antalet argument är rimligt, blir det enligt min mening renare och tydligare att skicka in den som parameter.

Till exempel tycker jag att följande variant:

```js
const rates = await this.#fetcher.fetchLatest(this.#getRequestParams())
```

är bättre än:

```js
    this.#fetcher.setCurrencies([this.#fromCurrency, ...this.#toCurrencies])
    const rates = await this.#fetcher.fetchLatest()
```

I det första exemplet får metoden allt den behöver direkt, utan att förlita sig på att en annan metod har anropats i förväg.  

Med det tänket i bakhuvudet är jag nöjd med den refaktorering jag gjort. Ibland har jag bytt från attribut till inparametrar och ibland tvärtom. Överlag blev koden betydligt mer läsbar när jag såg till helheten i stället för att strikt följa bokens rekommendation om att antal argument helst ska vara 0.  

En metod som jag upplevde som särskilt svår att skriva om var den som hanterar normalisering av valutakurser. Där löste jag det genom att tilldela rates (dvs initiala valutakurser) som ett attribut. Det gjorde det möjligt att dela upp logiken i flera mindre metoder utan att behöva "släpa med" parametrar mellan anrop.

Ursprunglig kod:  

```js
  /**
   * Normalizes the fetched exchange rates.
   *
   * @param {object} rates - The fetched exchange rates.
   */
  normalize (rates) {
    const baseRate = Object.values(rates[this.#baseCurrency])[0]
    const normalized = {}

    for (const currency of this.#targetCurrencies) {
      const targetRate = this.#getTargetRate(currency, rates)

      normalized[currency] = this.#normalizeOne(targetRate, baseRate)
    }

    this.#normalizedRates = normalized
  }
```  

Efter refaktorering:  

```js
 /**
   * Normalizes the fetched exchange rates.
   *
   * @param {object} rates - The fetched exchange rates.
   */
  normalize (rates) {
    this.reset()
    this.#setOriginalRates(rates)
    this.#rebaseRates(this.#getBaseRate())
  }

  /**
   * Resets the cached normalized rates.
   */
  reset () {
    this.#normalizedRates = {}
    this.#originalRates = {}
  }

  /**
   * Sets the original exchange rates.
   *
   * @param {object} rates - the original exchange rates
   */
  #setOriginalRates (rates) {
    this.#originalRates = { ...rates }
  }

  /**
   * Gets the base exchange rate for the current base currency.
   *
   * @returns {number} - the base rate
   */
  #getBaseRate () {
    return Object.values(this.#originalRates[this.#baseCurrency])[0]
  }

  /**
   * Rebases the exchange rates based on the base rate.
   *
   * @param {number} baseRate - the exchange rate to use as base for conversion
   */
  #rebaseRates (baseRate) {
    for (const currency of this.#targetCurrencies) {
      const targetRate = this.#getTargetRate(currency)

      this.#normalizedRates[currency] = this.#normalizeOne(targetRate, baseRate)
    }
  }

  /**
   * Gets the target exchange rate for a specific currency.
   *
   * @param  {string} currency - The currency code to get the target rate for.
   * @returns {number} - The target exchange rate.
   */
  #getTargetRate (currency) {
    if (currency === this.#ORIGINAL_BASE) {
      return 1
    }

    return Object.values(this.#originalRates[currency])[0]
  }


```

Man kan förstås argumentera för att #setOriginalRates() och #getBaseRate() ligger på en något lägre abstraktionsnivå än reset() och #rebaseRates(), men jag ser ingen rimlig väg att abstrahera bort dessa ytterligare utan att försämra tydligheten.  

När det gäller metodstorlek och komplexitet tycker jag att min kod nu ligger bra till. Jag har inga långa metoder och sällan mer än två indrag. Efter inlämningen skrev jag dessutom om delar av koden från loopar med if/else till att använda moderna metoder som map, find och filter. Det minskar antalet förgreningar och gör koden mer deklarativ och lättläst.  

Till exempel:  

```js
  /**
   * Get the currencies from the data.
   *
   * @returns {Array} currencies - Array of currency objects from BASE_CUR dimension
   */
  #getCurrencies () {
    for (const dim of this.#data.structure.dimensions.series) {
      if (dim.id === 'BASE_CUR') {
        return dim.values
      }
    }

    throw new Error('No BASE_CUR dimension found in data')
  }

```


blev

```js
  /**
   * Sets the target currencies from the API data.
   *
   * @param {object} data - the structure part of data returned by API, to extract target currencies from
   */
  #setTargetCurrencies (data) {
    this.#targetCurrencies = data.dimensions.series.find(dimension => this.#isTargetCurrency(dimension)).values
  }

  /**
   * Checks if the dimension is the target currency dimension.
   *
   * @param {object} dimension - dimension object to check
   * @returns {boolean} - whether the dimension is the target currency dimension
   */
  #isTargetCurrency (dimension) {
    return dimension.id === 'BASE_CUR'
  }

  /**
   * Gets the target currencies.
   *
   * @returns {Array} - a list with the target currencies
   */
  getTargetCurrencies () {
    return this.#targetCurrencies.map(currency => this.#cloner.clone(currency))
  }

```

Jag valde att använda map här eftersom det egentligen inte finns något scenario där BASE_CUR-dimensionen saknas i datan från API:et... om inte all data saknas, förstås, men i det fallet kommer ett fel att kastas redan från klassen som hanterar fetch-requesten till APIet.

I den typ av loop med "early return" som jag hade tidigare uppstår problemet att man efter loopen måste explicit returnera undefined eller kasta ett fel (där det senare alternativet är att föredra enligt samma regel som "Don't return null" i kapitel 7). Jag tycker det blir missvisande eftersom det kan få läsaren att tro att attributet ibland saknas. Funktionellt sett behövs förstås inte något explicit returvärde i form av undefined , eftersom det är vad JavaScript automatiskt returnerar om inget värde anges, men det statiska analysverktyget Scrutinizer, som jag använt i tidigare kurs, brukar påpeka att det är "bad practice" om bara vissa exekveringsvägar av samma metod innehåller en return-sats. Att då använda map istället, kommer runt den problematiken. 
  
Cloner som används i koden är en egen DeepCloner-klass, som rekursivt gör en deep copy av objektet och alla underobjekt. På så sätt undviker jag sidoeffekter och att data kan modifieras utanför den klass där den hör hemma.  
  
Genom att extrahera metoden #isTargetCurrency följer jag även här Single Responsibility Principle (SRP). #setTargetCurrencies tillsätter attributet, medan #isTargetCurrency avgör vilka element som ska väljas.    


## Kapitel 4 - Comments

Innan jag går in på mina reflektioner kring det här kapitlet vill jag bara påpeka att vid beräkning av kodrader var över 50 % av den totala koden kommentarer. Och detta beror inte på något medvetet val från min sida, utan på att ESLint tvingar en att vara onödigt explicit. Setters, getters, privata metoder - ESLint tycker att precis allt behöver kommenteras, och gärna på flera olika sätt.

Exempel:

```js
  /**
   * Gets the date indices for the observations.
   *
   * @returns {Array<number>} - The date indices.
   */
  #getDateIndices () {
    return Object.keys(this.#observations)
  }

  /**
   * Gets the observation date for a specific index.
   *
   * @param {number} dateIndex - The index of the date to get.
   * @returns {string} - The observation date.
   */
  #getObservationDate (dateIndex) {
    return this.#dates[Object.keys(this.#dates)[dateIndex]]
  }

```

Om jag hade fått välja själv hade jag hoppat över antingen beskrivningen av metoden eller beskrivningen av parametrar och returvärde.. att ha med båda känns som upprepning. Ännu mer onödigt känns det att kommentera getters för icke-beräknade egenskaper, till exempel:

```js

  /**
   * Gets the currency id.
   *
   * @returns {string} - The currency id, for example 'USD'.
   */
  getId () {
    return this.#id
  }
```
Detta är ett tydligt exempel på det som författaren beskriver under Redundant Comments, och mer specifikt Mandated och Noise Comments. Eftersom denna linter har varit obligatorisk i tidigare kurser vågade jag inte frångå reglerna, men min åsikt är att sådana kommentarer mest blir distraherande. De gör filerna längre och svårare att överblicka, och tar tid att läsa utan att tillföra något nytt.  

Författaren lyfter också ett viktigt argument: koden förändras, men kommentarer glöms ofta bort. Om de inte uppdateras blir de snabbt missvisande och skapar förvirring i stället för klarhet. I slutändan är koden den enda sanna källan till information - "truth can only be found in the code."  

Förutom de påtvingade kommentarerna från ESLint har jag i princip inga inline-kommentarer, bara på ett fåtal ställen i koden. Till exempel:  

```js
export const app = createApp(router) // exported for testing purposes
startApp(app)
```
och

```js
  /**
   * Converts a single quote to the target currencies.
   *
   * @param {object} quote - The quote to convert.
   * @returns {object} - The conversion results for the quote.
   */
  #convertOne(quote) {
    const calculated = {
      NOK: quote.NOK
    }

    for (const currency of this.#targetCurrencies) {
      const rate = this.#rates[currency][quote.date]

      if (rate) { // some rates do not have values for all dates, for example RUB
        calculated[currency] = round(quote.NOK / rate)
      }
    }

    return calculated
  }
```  

Detta ligger helt i linje med det författaren kallar Explanation of Intent, det vill säga kommentarer som förklarar varför något görs, inte vad koden gör. I det här fallet är kommentaren nödvändig eftersom den beskriver en särskild avvikelse (att anledningen till att app exporteras är för att importera i testerna, eller att vissa valutor saknar värden för vissa datum) som inte går att uttrycka direkt i koden.  

Om jag stöter på kod som kräver eftertanke för att förstå, försöker jag hellre bryta ut den i en metod med beskrivande namn än att lägga till en kommentar. På så sätt blir koden självförklarande och enklare att läsa. Till exempel i följande kod:  

```js
  /**
   * Sets the target currencies for conversion.
   * If the currencies are changed, cached rates are cleared.
   *
   * @param {string[]} values - The currency codes to set as target currencies.
   */
  setTargetCurrencies (values) {
    if (this.#isTargetChanged(values)) {
      this.#normalizer.reset()
    }

    this.#targetCurrencies = values
  }

  /**
   * Checks if the target currencies have changed.
   *
   * @param {string[]} newValue - The new target currencies.
   * @returns {boolean} - True if the target currencies have changed, false otherwise.
   */
  #isTargetChanged (newValue) {
    return this.#targetCurrencies.length > 0 && !this.#hasSameCurrencies(newValue, this.#targetCurrencies)
  }


```

Detta följer tydligt författarens princip "Don’t use a comment when you can use a function or a variable."
Ett tydligt metodnamn gör mer nytta än en kommentar.  

Ett annat exempel från min kod där jag försökt skriva tydlig, självdokumenterande kod är:  

```js
  /**
   * Validates that the necessary data is set for conversion.
   *
   * @throws {Error} if rates are not set or amount is invalid
   */
  #validate () {
    if (!this.hasCachedRates()) {
      throw new Error('Rates have not been set.')
    }

    if (!this.#isValidAmount()) {
      throw new Error('Invalid amount.')
    }
  }

  /**
   * Checks if there are cached rates.
   *
   * @returns {boolean} - true if there are cached rates
   */
  hasCachedRates () {
    return Object.keys(this.#rates).length > 0
  }


  /**
   * Checks if the amount is valid.
   *
   * @returns { boolean } - true if the amount is valid
   */
  #isValidAmount () {
    return this.#amount && !Number.isNaN(Number(this.#amount))
  }


```

Här blir det tydligt vad som valideras, utan att läsaren behöver funder på exempelvis vad "Object.keys(this.#rates).length > 0" innebär i sammanhanget .  

Författaren tar även upp TODO comments, något jag själv ofta använder. Jag kommer ofta på idéer medan jag kodar och skriver små notiser till mig själv direkt i koden. Det gör det enkelt att minnas mina tankar och snabbt hitta tillbaka till rätt plats. Jag går också igenom dessa regelbundet, vilket författaren rekommenderar. När jag arbetar ensam tycker jag att det är helt okej att lämna TODO-kommentarer, men i gemensamma projekt försöker jag hålla nere antalet för att undvika störmoment.   

När det gäller commented-out code känner jag igen mig i författarens beskrivning. Jag har tidigare låtit gammal kod ligga kvar under utvecklingen för att kunna jämföra med nya lösningar, eftersom det underlättar debugging om något slutar fungera efter en kodändring, särskilt vid refaktorisering av kod som inte har full täckning (coverage). Samtidigt förstår jag varför man inte bör göra så. Kommenterad kod skapar snabbt oreda och kan förvirra andra utvecklare. Jag håller med författaren om att versionshantering fyller samma syfte, och därtill passar bättre i sammanhang där flera personer arbetar i samma kodbas.  

Boken nämner också några regler som inte var direkt relevanta för min kod, till exempel kommentarer i html, överflödig fakta eller kommentarer som ligger för långt ifrån den kod de beskriver. I det stora hela tycker jag dock att författaren fångar precis det jag själv upplever - att kommentarer i de flesta fall är onödiga och tidskrävande: tid att skriva, ännu mer tid att underhålla, och merparten av denna kommer med största sannolikhet inte att läsas av nästa person (förutsatt att koden är tillräckligt välskriven).  


## Kapitel 5 - Formatting

Författaren introducerar konceptet vertical formatting och menar att delar som hör ihop också bör ligga nära varandra vertikalt i koden. Ett undantag är instansvariabler, som enligt författaren ska ligga högst upp i klassen. Författaren menar dock att detta inte i praktiken bör frångå den vertikala regeln, eftersom attributen i en väldesignad klass ändå används av merparten av metoderna. Författaren förklarar vidare att om en metod anropar en annan, bör den anropande metoden ligga precis ovanför den anropade. På så sätt får koden ett naturligt flöde uppifrån och ned, där man kan följa logiken utan att söka runt i filen.  

Innan jag läste detta kapitel har jag haft en annan uppfattning om vad som är "rätt ordning" i en klass - jag tänkte att alla publika metoder ska ligga högst upp och att getters och setters bör placeras tillsammans. Men den här regeln ställer till det lite, eftersom att om en setter anropar flera andra metoder (så kallade dependent functions), och dessa i sin tur anropar ytterligare metoder, hamnar motsvarande getter långt ner i klassen.  

Jag har till exempel en klass som tar emot ett dataobjekt i konstruktorn och, utifrån datan, tillsätter olika attribut med hjälp av privata setters. Eftersom flera setters anropas från samma metod, och dessa i sin tur har egna hjälpfunktioner, hamnar gettrarna långt ner i filen, långt ifrån sina respektive setters.  


(Jag har exkluderat method docstrings i kodexemplet nedan för att det inte ska bli för långt i readme-filen.)

```js
  constructor(data, dependencies) {
    this.#cloner = dependencies?.cloner || new DeepCloner()
    this.#setBaseCurrency(data)
    this.#setTargetCurrencies(data)
    this.#setUnitMultipliers(data)
    this.#setDates(data)
    this.#setAllCurrencies()
  }


  #setBaseCurrency(data) {
    this.#baseCurrency = data.dimensions.series.find(dimension => this.#isBaseCurrency(dimension)).values[0]
  }

  #isBaseCurrency(dimension) {
    return dimension.id === 'QUOTE_CUR'
  }

  #setTargetCurrencies(data) {
    this.#targetCurrencies = data.dimensions.series.find(dimension => this.#isTargetCurrency(dimension)).values
  }

  #isTargetCurrency(dimension) {
    return dimension.id === 'BASE_CUR'
  }

  #setUnitMultipliers(data) {
    this.#unitMultipliers = data.attributes.series.find(dimension => this.#isUnitMultipler(dimension)).values
  }

  #isUnitMultipler(attribute) {
    return attribute.id === 'UNIT_MULT'
  }

  #setDates(data) {
    this.#dates = data.dimensions.observation[0].values.map(dateObject => dateObject.id)
  }

  #setAllCurrencies() {
    this.#allCurrencies = this.#cloner.clone([...this.getTargetCurrencies(), this.getBaseCurrency()])
  }

  getBaseCurrency() {
    return this.#cloner.clone(this.#baseCurrency)
  }

  getTargetCurrencies() {
    return this.#targetCurrencies.map(currency => this.#cloner.clone(currency))
  }

  getUnitMultipliers() {
    return this.#cloner.clone(this.#unitMultipliers)
  }

  getDates() {
    return this.#cloner.clone(this.#dates)
  }

  getAllCurrencies() {
    return this.#allCurrencies
  }

  getCurrencyIds() {
    return this.#allCurrencies.map(currency => currency.id)
  }

  getOneCurrencyId(index) {
    return this.#allCurrencies[index].id
  }


```

Jag upplever att koden blir lite svårare att överblicka på det här sättet, eftersom det tar längre tid att se vilka attribut som faktiskt går att läsa av utifrån klassen. Samtidigt förstår jag logiken i regeln... att placera publika metoder högst upp underlättar för den som använder klassen, medan att placera submetoder direkt under huvudmetoderna underlättar för den som utvecklar eller felsöker i själva koden.  

Författaren nämner Conceptual Affinity, vilket innebär att man kan gruppera metoder som hör ihop konceptuellt – alltså metoder som löser liknande uppgifter eller bygger vidare på samma koncept. Jag har en sådan klass, TypeChecker, som används av DeepCloner-klassen. TypeChecker består av metoder som tar emot ett argument och kontrollerar om värdet är av en viss typ. DeepCloner använder sedan dessa metoder för att avgöra om det objekt som ska klonas innehåller nästlade element, och i så fall på vilket sätt dessa ska itereras.

Även här tog jag bort kommentarerna i kodexemplet för att det inte skulle ta upp för mycket plats i readme-filen. Författaren påpekar att onödiga kommentarer kan bryta den visuella närheten mellan koddelar som hör ihop, och det tycker jag blev väldigt tydligt när jag tog bort dem. Jag upplever att koden blev betydligt mer lättöverskådlig, och den konceptuella gruppering som tidigare "gömdes" av kommentarerna framgår nu mycket tydligare. Jag hoppas därför att vi i framtida kurser själva kan få avgöra hur mycket vår kod behöver kommenteras utan att det påverkar betyget.  

```js
/**
 * A utility class for type checking.
 */
export class TypeChecker {
  isPrimitive(value) {
    return (!(this.isObject(value) || this.isFunction(value))) || this.isNullOrUndefined(value)
  }

  isObject(value) {
    return typeof value === 'object'
  }

  isFunction(value) {
    return typeof value === 'function'
  }

  isNullOrUndefined(value) {
    return [null, undefined].includes(value)
  }

  isArray(value) {
    return Array.isArray(value)
  }

  isSet(value) {
    return value instanceof Set
  }

  isMap(value) {
    return value instanceof Map
  }

  isDate(value) {
    return value instanceof Date
  }
}
```

Författaren nämner också kort den vertikala ordningen - dels att koden ska kunna läsas uppifrån och ned som en berättelse, men också att det som är viktigast bör ligga överst. Det tycker jag ligger i linje med det jag nämnde tidigare, att jag tycker (eller i allafall tänkte så tidigare) att de publika metoderna placeras överst i klassen, i stället för att spridas ut mellan de privata. Samtidigt skulle det förstås innebära att koden inte riktigt kan läsas som en sammanhängande berättelse, vilket gör det svårt att fullt ut följa båda principerna samtidigt. 

Horizontell formattering med korta rader upplever jag blir en naturlig konsekvens av att hålla metoderna korta och extrahera "krånglig kod" till variabler. I Javascript är det dessutom enkelt att fortsätta på nästa rad eftersom kompilatorn fortsätter att tolka sålänge som det som kommer på nästa rad kan tolkas som del av samma uttryck. Det enda stället som jag "bryter" mot regeln och har långa rader är json filen som innehåller datat för swagger - som jag förstås det så kan man inte radbryta i json, i annat fall hade jag förståss gjort det.  

Horizontal formatting med korta rader upplever jag blir en naturlig konsekvens av att hålla metoderna korta och att extrahera längre styckern till variabler. I JavaScript är det dessutom enkelt att fortsätta på nästa rad, eftersom kompilatorn fortsätter att tolka koden så länge det som står på nästa rad kan ses som en del av samma uttryck.   

Det enda tillfället där jag bryter mot den här regeln och använder långa rader är i json-filen som innehåller datat för Swagger. Så som jag förstått det går det inte att radbryta i JSON, i annat fall hade jag självklart gjort det. Till skillnad från andra filtyper radbryter VS Code nämligen inte json-filer automatiskt, vilket gör att filen "åker i sidled" när jag skriver. Det blir därför nästan lika jobbigt att skriva långa rader som att läsa dem.  

Författaren nämner också horizontal spacing och menar att man i ett uttryck som detta  

```js
b*b - 4*a*c;
```

kan skippa mellanslagen runt de operatorer som exekveras först, eftersom det enligt författaren gör koden enklare att läsa. Jag håller inte riktigt med, jag tycker nog snarare att det ser konstigt ut och att det blir svårare att urskilja de olika tecknen. Det jag har lärt mig tidigare är att man istället kan lägga till extra parenteser runt dessa delar. Även om det inte påverkar själva beräkningen i dessa fall kan parenteserna göra koden lättare för människor att läsa. Jag tror att det är en bättre lösning än att helt utesluta mellanslag. I min egen kod har jag som sagt följt linterns regler, så mellanslagen finns där de ska vara enligt ESLint:s standard.  

Författaren nämner också horizontal alignment. När jag tidigare studerade PHP minns jag att läraren brukade aligna variabler precis som författaren visar i det första exemplet i boken. Jag försökte till en början följa samma princip, men det blev snabbt omständligt när någon variabel fick ett längre namn och de övriga raderna behövde justeras om. Jag vet inte om det finns något automatiskt verktyg för det...det var i alla fall inget jag använde och till slut blev det för tidskrävande att justera mellanslagen manuellt. Precis som författaren, tycker inte jag heller att det tillför något och har inte använt mig av det i denna uppgiften heller.  

Författaren pratar också om indentering och nämner att vissa väljer att skriva till exempel enrads-ifsatser eller loopar på samma rad, eller utan måsvingar. Denna punkt håller jag helt med författaren om - jag tycker att koden blir svårare att läsa på det sättet. I min egen kod har jag därför alltid med måsvingar och använder alltid flerradsblock, även när det bara är en rad i blocket.  

Författaren tar även upp dummy scopes och menar att dessa bör undvikas. Avsnittet är dock ganska kort och innehåller bara ett enkelt exempel, så jag är inte helt säker på i vilka situationer man i praktiken skulle behöva använda tomma scopes som inte hade kunnat lösas på ett annat sätt. Det är i alla fall inget jag har i min kod.  

## Kapitel 6 - Objects and data structures

När jag läste detta kapitel insåg jag att det inte är så enkelt att skriva objektorienterad kod som att bara skapa klasser och instanser av dem. Särskilt detta stycke fick mig att stanna upp och fundera:

"Procedural code makes it hard to add new data structures because all the functions must change. OO code makes it hard to add new functions because all the classes must change."

Det fick mig att inse att delar av min kod kanske ändå hade procedurella inslag. Men min modul från L2 är nog mindre procedurell nu än den var vid förra inlämningen.  

Tidigare hade jag exempelvis en klass DataReader som i varje metod tog emot ett dataobjekt (det som returneras från Norges API) och extraherade specifika delar. DataReader använde DataFormatter för att formatera om datan till ett mer användbart format, men egentligen var resultatet fortfarande en enkel datastruktur.

I refaktoreringen tog jag bort dessa två klasser och ersatte dem med en Data-klass. Data består i sin tur av två andra klasser, Structure och DataSet, samt ytterligare en klass, Currency. Var och en av dessa ansvarar för att formatera sin egen data och returnera olika delar via getters. Efter refaktoreringen upplevde jag koden som mycket enklare att läsa och förstå än tidigare.

Hade vi haft mer tid tror jag att ännu fler delar hade kunnat skrivas om på samma sätt, men det kräver en del eftertanke att hitta den rätta balansen mellan objektorienterad struktur och enkelhet.

```js

/**
 * Class representing a currency and its exchange rate observations.
 */
export class Currency {
  #id
  #observations = {}
  #datedRates = {}
  #attributes
  #denominator
  #dates
  #multipliers

  constructor (data) {
    this.#id = data.id
    this.#observations = data.observations
    this.#attributes = data.attributes
    this.#dates = data.dates
    this.#multipliers = data.multipliers
  }

  getId () {
    return this.#id
  }

  getRates () {
    if (!this.#isFormatted()) {
      this.#format()
    }

    return this.#datedRates
  }

  #isFormatted () {
    return Object.keys(this.#observations).length === Object.keys(this.#datedRates).length
  }

  #format () {
    this.#setDenominator()
    const dateIndices = this.#getDateIndices()

    for (const index in dateIndices) {
      this.#datedRates[this.#getObservationDate(dateIndices[index])] = this.#getObservedValue(index)
    }
  }

  #setDenominator () {
    const multiplierIndex = this.#attributes[0]
    const powerOf = Number(this.#multipliers[multiplierIndex].id)

    this.#denominator = 10 ** powerOf
  }

  #getDateIndices () {
    return Object.keys(this.#observations)
  }

  #getObservationDate (dateIndex) {
    return this.#dates[Object.keys(this.#dates)[dateIndex]]
  }

  #getObservedValue (dateIndex) {
    const observationValue = Number(Object.values(this.#observations)[dateIndex])

    return round(observationValue / this.#denominator, 4)
  }
}

```
och så här använder Data-klassen Currency-klassen:

```js
  /**
   * Rearrange the data into a more usable structure.
   */
  #formatAll () {
    const rateSeriesCount = this.#dataSet.countSeries()

    for (let currencyIndex = 0; currencyIndex < rateSeriesCount; currencyIndex++) {
      this.#formatOne(currencyIndex)
    }
  }

  /**
   * Formats data for one currency.
   *
   * @param {number} currencyIndex - The index of the currency to format.
   */
  #formatOne (currencyIndex) {
    const currencyRates = this.#dataSet.getOneRateSeries(currencyIndex)

    const currency = new Currency({
      ...currencyRates,
      dates: this.#structure.getDates(),
      multipliers: this.#structure.getUnitMultipliers(),
      id: this.#structure.getOneCurrencyId(currencyIndex)
    })

    this.#rates[currency.getId()] = currency.getRates()
  }

  ```  

Den här strukturen gör att varje klass ansvarar för sitt eget dataflöde, vilket ligger i linje med kapitlets resonemang om dataabstraktion.. att objekt ska dölja sin interna representation och exponera tydliga gränssnitt i stället för data.  

Författaren tar också upp Law of Demeter och begreppet train wrecks, och menar att det är dålig kodstil att kedja flera anrop i följd, vilket vilket ökar coupling mellan komponenter.

Min spaning är att kedjade anrop känns mycket vanliga i JavaScript, särskilt i moderna bibliotek och ramverk. Fram tills för bara några år sedan, innan async/await blev standard, var det till exempel normalt att kedja then-anrop på promises. Det hade snarare sett märkligt ut att bryta ut varje steg i egna variabler, så som författaren föreslår.   
  
Samtidigt förstår jag och håller med om tanken bakom regeln, att man inte bör anropa metoder på objekt som returneras av andra, eftersom det bryter inkapslingen. Jag hoppas att jag inte har gjort det i min egen kod. Jag tror inte det, eftersom vi tidigare i utbildningen har diskuterat liknande principer (till exempel att lager i en arkitektur bara ska prata med närmast underliggande lager och inte "hoppa över" ett lager bara för att det är enklare just i det fallet).  
  
En sak jag däremot har funderat på är att man ju också kan returnera this från en metod för att kunna kedja metodanrop på samma klass. I det fallet bildas ju ett liknande "tåg" av punkter, men man kommunicerar fortfarande med samma objekt. Jag undrar därför om författaren skulle betrakta det som ett brott mot Law of Demeter, eller om det skulle vara ett undantag eftersom kedjan rör samma instans. Detta är dock inget som berör min egen kod - jag returnerar aldrig this från metoder eller kedjar anrop, men det har nog mest berott på att jag glömmer bort att man kan göra så. Nu vet jag dock att det, åtminstone enligt författaren, inte är en rekommenderad praxis heller.  

En annan sak jag funderar på är factory-klasser och factory-metoder.. dessa returnerar ju nya klasser eller instanser som är avsedda att användas av andra klasser. Menar författaren då att det designmönstret i så fall inte skulle räknas som clean code?  

Regeln kring hybrids upplevde jag som lite svår att förstå och framför allt att följa. Varför är det egentligen så dåligt att ha getters? De underlättar ju till exempel vid enhetstestning. Jag hade gärna sett fler praktiska exempel från författaren på när hybrider faktiskt "stökar till" i koden.  

Om man följer regeln om att inte anropa metoder på returnerade objekt, och dessutom följer principen om hiding structure - som jag i mitt fall gör genom att det som returneras från accessorerna antingen är primitiva typer eller deep clones av referenstyper (så att ett objekts attribut inte kan ändras utifrån) - då förstår jag inte riktigt var gettrarna gör skada.  

Om jag tar Currency-klassen i min kod som exempel så gör den något viktigt (formatterar om sina valutakurser), men den har också två getters, varav den ena enbart returnerar id:t. Jag har svårt att se hur man skulle kunna skriva om koden för att separera dessa delar utan att förlora den konceptuella helheten. Författaren menar att man ska separera business logic från datastrukturen, och att klassen med logiken ska innehålla klassen med datan. Men hur ska då en annan klass (i mitt fall Data) kunna få tillgång till valutans id för att lägga till den i sin mappning av olika valutor? Kanske tänker jag för fyrkantigt, och det finns någon lösning på detta som jag helt enkelt inte kan se framför mig.   

## Kapitel 7 - Error handling

Författaren tar upp att kastade fel bör ge kontext och att man, utöver stack trace, ska inkludera informativa meddelanden. Han visar också exempel med egna error-klasser i Java. När jag studerade Python brukade jag skapa egna felklasser som ärver från Exception, eftersom det blir både snyggt och tydligt i koden när man kan fånga just den specifika exceptionen:  

```py
## define custom error class
class ApiFetchException(Exception):
    """
    Base class for exceptions when fetching data from API
    """

## in another class

try:
    self.fetch_data_from_api()
except ApiFetchException as err:
    self.handle_fetch_exception(err)
```

Om jag dessutom skapar en ytterligare klass som ärver frn ApiFetchException, till exempel InvalidParametersException, kan jag välja om jag vill fånga enbart det specifika felet eller det mer generella ApiFetchException. Koden blir ren, tydlig och lätt att läsa. Det blir inte lika elegant i JavaScript, där man alltid fångar den generella Error-klassen och därefter måste kontrollera om det fångade objektet är en instans av ett visst fel. Om inte, måste man kasta felet igen, till exempel:  

```js
class ApiFetchException extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}


// In another class
try {
  fetchDataFromApi()
} catch (err) {
  if (err instanceof ApiFetchException) {
    this.handleFetchException(err)
  } else {
    throw err; // rethrow if not "right" exception
  }
}

```  

Av den anledningen skapar jag aldrig egna felklasser i JavaScript, utan kontrollerar istället felets innehåll på andra sätt, till exempel genom att sätta ett code-attribut på felet. Det blir oavsett mer omständligt i JavaScript jämfört med Python. Att jämföra mot error.message är inget bra alternativ, eftersom meddelandena ofta är långa och dessutom kan förändras under utveckling om jag kommer på en bättre formulering.  

Författaren tar upp att man inte ska skicka in null som argument. Den regeln bryter jag mot på ett ställe, i TypeChecker-klassen. Det tycker jag dock är motiverat, eftersom det just är syftet med metoden: att ta reda på om ett element är null eller undefined, vilket i sin tur påverkar hur elementet ska kopieras av DeepCloner om det ligger i en datastruktur som ska klonas:  

```js
  /**
   * Checks if the value is null or undefined.
   *
   * @param {any} value - The value to check.
   * @returns { boolean } - True if the value is null or undefined, false otherwise.
   */
  isNullOrUndefined (value) {
    return [null, undefined].includes(value)
  }

```

Jag returnerar inte null (eller undefined) från några metoder i koden, utan hanterar det med antingen exceptions eller default-värden, beroende på vad som är mest lämpligt i sammanhanget. Till exempel, i metoden som räknar om belopp med respektive valutakurs för att presenteras i html-table, returnerar jag en tom sträng i det fall valutakursen skulle saknas. Jag har gjort bedömningen att en tom cell är rimligare att visa för användaren än en notis om att valutakursen saknas för den valutan. Här handlar det egentligen inte så mycket om Clean Code i strikt mening, utan mer om vad som är mest användbart ur användarens perspektiv:  

```js 
  /**
   * Converts the amount to one target currency.
   * Converted amount is returned as string to be "printed" in an html table.
   *
   * @param {number} rate - the exchange rate to use for conversion of amount
   * @returns {string} - the converted amount as string or an empty string
   */
  #convertOne (rate) {
    return rate ? (this.#amount * rate).toFixed(2) : ''
  }
  ```



## Kapitel 8 - Boundaries

Författaren beskriver vikten av att hålla tydliga gränser mot extern kod och att testa tredjeparts-API:er med så kallade learning tests. Jag hade inte hunnit läsa det här kapitlet när jag skrev koden, och i tidigare utbildningar har jag lärt mig att man inte behöver testa kod som är skriven av andra. Därför har jag i L2-modulen (som i sig har hög kodtäckning genom egna tester) inte testat L2 via L3-modulen.  

I mina e2e-tester av REST-API:et jag gjort i L3 mockar jag i stället returvärdena från L2-modulen. Testerna körs alltså från där L3-koden börjar till där den slutar. Däremot har jag manuellt gjort anrop till Norges Banks API via Postman för att förstå hur det fungerar. Det var då jag bland annat upptäckte att vissa valutor, till exempel SEK, har den senaste kursen från närmast föregående bankdag, medan RUB hämtar senaste kursen från 2022. Även i L2-tester undviker jag automatiska anrop till Norges Banks API (det skulle nog inte vara så uppskattat) och använder i stället sparade JSON-svar som testdata.  

i L3 tester har jag exempelvis:

```js
import { rateFetcher } from '../../src/services/RateService.js'
import { calculateAverage, round } from '../utils/functions.js'

chai.use(sinonChai)
const { expect } = chai

describe('e2e - latest', () => {
  let fetcherStub

  before(() => {
    fetcherStub = sinon.stub(rateFetcher, 'fetchLatest')
  })

  after(() => {
    sinon.restore()
  })

  afterEach(() => {
    fetcherStub.resetHistory()
    fetcherStub.resetBehavior()
  })

  it('average based on one observation: latest/DKK+EUR', async function () {
    const rates = {
      DKK: {
        '2025-09-19': 1.5637
      },
      EUR: {
        '2025-09-19': 11.6705
      }
    }

    fetcherStub.resolves(rates)

```

och i RateService.js exporteras fetcher så:

```js
import { RateFetcher } from '@jl225vf/exr'
import { stringToArray } from './lib/functions.js'
import { AverageRate } from './lib/AverageRate.js'

export const rateFetcher = new RateFetcher() // export for testing purposes
/**
 * Service for fetching exchange rates.
 */
export class RateService {
  #fetcher

  /**
   * Creates a new instance of RateService.
   *
   * @param {RateFetcher} fetcher - class that fetches data from the Norway API.
   */
  constructor (fetcher = rateFetcher) {
    this.#fetcher = fetcher
  }
  ```

På ett sätt bryter detta mot inkapslingen, men det är nödvändigt för att kunna testa restAPI-routningen med samma instans av fetcher som används av den server som testas för att göra testerna helt oberoende av L2 modulen.  

Jag gillar författarens approach i log4j-exemplet. Det är ett betydligt smartare sätt att testa tredjepartsmoduler i Node än att “console-logga sig fram”, vilket jag ofta gör eftersom jag är för otålig för att sätta mig in i dokumentationen. Med learning tests skulle jag istället kunna pröva mig fram på ett mer strukturerat sätt och samtidigt behålla historiken över vad jag faktiskt har testat, både för att snabbt kunna sätta mig in i modulen igen om jag skulle behöva använda den igen i framtiden, men också för att enklare upptäcka eventuella förändringar i framtida versioner av tredjepartsmodulen. Och det är precis det författaren beskriver i avsnittet Learning Tests Are Better Than Free. Han menar att det publika gränssnittet i ett tredjeparts-API bör testas på exakt samma sätt som modulen används i produktionskoden, för att säkerställa att vi upptäcker om förändringar i modulen gör den inkompatibel med vår egen kod.  

En annan idé som författaren tar upp, som inte direkt var relevant för min nuvarande kod men som jag tror kan bli användbar längre fram i kursen, särskilt när man bygger större system i team, är att skapa ett "fejk interface" att arbeta mot. När det faktiska interfacet sedan blir känt kan man bygga en adapter som kopplar ihop den egna koden med det riktiga interfacet. Genom att använda en egen adapter får man dessutom full kontroll över hur mycket arbete som kommer att krävas om API:ets publika gränssnitt skulle förändras.  

## Kapitel 9 - Unittests  

Jag gillar att testa min kod. Om jag hade haft mer tid hade jag gärna skrivit enhetstester helt isolerat för varje liten del, integrationstester mellan alla delar, samt e2e-tester där hela kedjan testas från början till slut. Jag hade dessutom gärna arbetat med test-driven development (TDD) och skrivit enhetstester parallellt med själva koden. Tyvärr har tiden inte riktigt räckt till, så jag har fått prioritera.  

Överlag har jag dock hög kodtäckning. I L2 hade jag tidigare 100%-ig kodtäckning, men den har sjunkit till runt 90% efter refaktoreringen. Dessutom är det inte längre renodlade enhetstester -  på de ställen där koden har brutits ut i subklasser har jag inte delat upp testkoden med tydliga avgränsningar, utan istället testat submodulerna genom huvudmodulens tester. Jag har resonerat som så att om något av dessa tester skulle faila, kan man i efterhand lägga till separata enhetstester för just de delar som berörs.  

I L3 har jag i stället prioriterat att testa helheten, med motsvarande grundtanke - att om helheten inte fungerar, lägger jag till mer detaljerade tester vid behov. Eftersom det inte handlar om ett kritiskt system har jag bedömt att eventuella mindre buggar kan åtgärdas i efterhand.

Att end-to-end-testa i stället för att enhetstesta har dessutom en tydlig fördel under utvecklingsfasen: man kan ändra den interna strukturen fritt utan att behöva uppdatera ett stort antal enhetstester. Med enhetstester (även om om samtliga beroenden är mockade) krävs ofta uppdateringar på flera ställen - till exempel byter namn på en klass eller en publik metod så måste man uppdatera namnet även på "mocken". Å andra sidan tar e2e tester lngre tid att exekvera än enhetstester så om man har många olika vägar genom koden (alltså if/else, try/catch) så är enhetstester förstås bättre (för att bla för a Fast i F.I.R.S.T principen) och minskar antal testfall som behövs för att testa precis alla kombinationer av "vägar". 

Författaren lyfter vikten av att hålla testsuiten ren genom att följa Clean Code-principerna även i testkoden, och att inte betrakta tester som "andrahandsmedborgare". Där är jag nog själv skyldig, framför allt när det gäller duplicerad kod. Inom samma testsuite har jag försökt återanvända koddelar, men mellan olika suites finns det med stor sannolikhet återkommande kodstycken. Det har främst berott på tidsbrist - jag har arbetat med en testsuite i taget och inte gått tillbaka till den efteråt, om det inte varit så att jag gjort ändringar i den relaterade "riktiga" koden.  

I huvudsak följer jag dock BUILD–OPERATE–CHECK-mönstret (eller som jag lärde mig under tidigare kurs i Python: arrange → act → assert). Till exempel:  

```js
  it('Convert from SEK to PLN and EUR', async function () {
    const converted = {
      PLN: 134.78,
      EUR: 31.62

    }

    converterStub.resolves(converted)

    await request(app)
      .get('/api/v1/convert/350/SEK/PLN+EUR')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).to.deep.equal(converted)
      })

    expect(converterStub).to.have.been.calledWith(350)
  })
```

Här motsvarar  

1. BUILD (arrange)

```js
    const converted = {
      PLN: 134.78,
      EUR: 31.62

    }

    converterStub.resolves(converted)
```
2. OPERATE (act)

```js
    await request(app)
      .get('/api/v1/convert/350/SEK/PLN+EUR')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).to.deep.equal(converted)
      })
```
3. CHECK (assert)

```js
    expect(converterStub).to.have.been.calledWith(350)
```

Det är dock inte alla mina tester som är lika renodlade. Även om jag vet att en enhetstest i idealfallet bara bör innehålla en assert, vilket även författaren av Clean Code lyfter, tycker jag ibland att flera asserts kan göra testet mer tydligt och ge bättre kontext. Till exempel i följande test:  

```js
    it('previously set, changed OK', () => {
      const calculator = new CurrencyCalculator()

      calculator.setTargetCurrencies(['USD', 'EUR'])
      calculator.setRates(rates)

      expect(calculator.hasCachedRates()).to.be.true

      calculator.setTargetCurrencies(['USD', 'EUR', 'PLN'])
      expect(calculator.getTargetCurrencies()).to.deep.equal(['USD', 'EUR', 'PLN'])
      expect(calculator.hasCachedRates()).to.be.false
    })

```

Här fungerar den första asserten mest som kontext, för att tydliggöra att det fanns cachade valutakurser innan nya valutor tillsätts, vilket gör det tydligare att cachen rensas som en konsekvens av att nya valutor tillsätts. Författaren tar inte upp just denna anledningen, men han nämner ett annat exempel där flera asserts i samma test är att föredra (t ex föra att undvika duplicerad kod).  

Författaren menar även att det är viktigare att följa regeln om ett koncept per testfunktion – det vill säga att man testar saker som hör ihop. Den regeln tror jag att jag följer ganska bra faktiskt. Till exempel i följande test:  

```js
    it('new fromCurrency is different from current', () => {
      const ratefetcher = sinon.stub()
      const rateNormalizer = {
        reset: sinon.stub()
      }
      const sut = new CurrencyConverter({ fetcher: ratefetcher, normalizer: rateNormalizer })
      sut.setBaseCurrency('EUR')
      sut.setBaseCurrency('USD')

      expect(sut.getBaseCurrency()).to.equal('USD')
      expect(rateNormalizer.reset).to.have.been.calledOnce
    })

```

Här har jag två asserts, men de hänger ihop eftersom det är ändringen av basvalutan som leder till att tidigare satta valutakurser i normalizern nollställs.  

### F.I.R.S.T

Överlag följer min testsuite F.I.R.S.T.-principen. 


#### Fast
Även om end-to-end-tester normalt tar längre tid än enhetstester gör de inte det i min testsuite (testverktyget brukar färgmarkera tester som tar lång tid att exekvera).  

#### Independent
Varje test är oberoende av andra tester. Genom att använda before, beforeEach, after och afterEach säkerställer jag att varje test utgår från ett specifikt tillstånd och att det rensas upp efteråt. Samma variabler återanvänds endast mellan tester om det gäller element som inte förändras under testningen. Om ett element ändras skapas det istället i själva testmetoden. Till exempel:

```js

  it('hasCachedRates() returns false when no rates are set', () => {
    const sut = new RateNormalizer()
    const res = sut.hasCachedRates()

    expect(res).to.be.false
  })

  it('hasCachedRates() returns true when rates are set', () => {
    const sut = new RateNormalizer()
    sut.setBaseCurrency('EUR')
    sut.setTargetCurrencies(['DKK', 'PLN', 'SEK'])
    sut.normalize(rates)
    const res = sut.hasCachedRates()

    expect(res).to.be.true
  })
  ```

Här skapas en ny RateNormalizer instans i varje test för att ha full kontroll över utgångsläget i "system under test".

#### Repeatable:
Eftersom testerna inte använder systemets faktiska tillstånd går de att upprepa oberoende av miljö.

#### Self-validating:

Detta ser jag som en självklarhet och att det är just detta som skiljer automatiska tester från att skriva egna "testprogram" som console-loggar till konsolen.  

#### Timely:
Som tidigare nämnt hade jag helst skrivit testerna parallellt med koden, men jag var orolig att inte hinna färdigställa applikationen och skrev därför testerna i efterhand. Författaren menar att om man gör på det sättet  riskerar man att i efterhand upptäcka att koden är svårtestad, men det problemet har jag inte upplevt i min app. De delar som inte är testtäckta beror helt och hållet på tidsbrist, inte på att de skulle vara svårtestade.

Jag har "brottats" med testning i tidigare kurser och har därför ganska bra koll på vad som går att testa. Därför skriver jag kod med testbarhet som utgångspunkt, bland annat använder jag i princip alltid dependency injection i constructorerna. Därtill har javascript väldigt tacksamma testramverk att arbeta i, där i princip allt går att mocka och testa.

Jag har även tidigare erfarenhet av att skriva tester i php, i Symfony-projekt med hjälp av PHPUnit, och upplevt att det ramverket inte alls har varit lika flexibelt som JavaScripts testramverk. Jag vet dock inte om det beror på php som språk, på själva testramverket, eller på Symfony som ramverk,  där allt är väldigt inkapslat och restriktivt.

## Kapitel 10

## Kapitel 11

