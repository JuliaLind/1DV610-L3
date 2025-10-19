# Reflektion  

Efter att ha reflekterat kring koden i L2 samt fått feedback från medstudenter skrev jag om merparten av de privata delarna i modulen, samt några va de publika metoderna  (vilket förstås följdes av publicering av ny major version eftersom det påverkade bakåtkompatibilitet).

## Kapitel 2  - Meaningful Names

Jag har skrivit om onödiga förkortningar i modulen till motsvarande längre variant som gör koden lättare för utomstående att sätta sig in i. Till exempel har jag änrat har ändrat namn på metoden #prep() till #prepareRates(). I vissa fall har behållit förkortning.  

Jag har också ändrat vissa metodnamn för att höja abstraktionsnivån och bättre representera metodens övergripande ansvar.  

Jag har även ändrat på namn som kunde vara missvisande. Till expempel hade jag en metod som hette #isReady(), men den returnerade inte ett boolan utan kastade ett fel om klassen inte var "redo". Jag misstänker att jag ursprungligen tänkte att den skulle returnera en boolean men sedan ändrade mig - den metoden bytte jag namn på till #alertIfNotReady(), vilket då blir tydligare att metoden gör något och inte returnerar ett värde.


Överlag tycker jag att min kod följer namnreglerna bra. Även om jag ibland upplever det som svårt att hitta korta men samtidigt beskrivande namn (kanske brist på ordförråd eller fantasi), har jag ändå varit noga med att följa de andra reglerna: inga onödiga prefix, interna termer eller förkortningar, ingen typ i variabelnamn, samt sökbara namn.

Jag undviker överlag korta namn, även i lokala block föredrar jag att ge variabler tydliga namn, till och med i for-loopar. Det handlar inte bara om sökbarhet, utan också om att det kan bli svårt att hålla isär vad man faktiskt loopar igenom när man har flera loopar, även om de är uppdelade i olika subfunktioner. Det märktes särskilt i den här uppgiften, eftersom Norges API har en ganska komplex och nästlad struktur i sina svar.

Just det här med prefix funderade jag dock extra på när jag skapade egna komponenter. Custom components måste ju bestå av minst två ord med bindestreck mellan (för att undvika framtida konflikter med eventuella nya HTML-element). I tidigare kurser har vi fått lära oss att ett sätt att undvika krockar är att prefixa sina custom element, till exempel med sina initialer, e.g. jl-table. På så sätt minskar man risken att ens egna element krockar med andras. Samtidigt motsäger det ju regeln om att undvika prefix, vilket gör det lite klurigt att avgöra vad som är mest konsekvent. I denna uppgift valde jag att följa bokens regler och inte prefixa. 

Jag har även försökt följa regeln om “one word per concept”, men kom flera gånger på mig själv med att fundera över om vissa ord egentligen beskriver samma koncept eller inte. Ett exempel är fetch och get. get används ju ofta för att hämta ut attribut (accessor), men i tidigare kurser har vi lärt oss att controllerns metoder kan döpas efter de anrop de hanterar. Till exempel get för GET-request och post för POST-request. När jag har metoder som anropar ett API känns det mest naturligt att använda fetch. Men om jag ska hämta data och endast anropar API:et om datan inte redan finns cachad, ska det då heta get eller fetch? Likaså, om metoden gör en GET-request till API:et kanske den bör heta get, även om det är den enda metoden som kommunicerar med API:et. Då slipper man behöva döpa om den om det tillkommer en post-metod längre fram. Just dessa två begrepp har jag nog inte varit helt konsekvent med, även om jag har försökt att vara det.


## Kapitel 3  - Functions

Jag har justerat abstraktionsnivån genom att plocka ut delar som låg på längre abstraktionsnivå än andra delar i metoden. T ex har

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

blivit

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

Jag har alltså även funderat över detta med argument och när det passar och inte passar att sätta dessa som medlemsvariabler istället för att skicka in som argument till metod. Jag kom fram till att om det är en variabel som behöver accessas from flera metoder så ska den sättas som attribut. Medan om det är en variabel som bara används i en metod, och antal argument dessutom inte är så stor, så blir det i mitt tycker med cleancode att skriva 

```js
const rates = await this.#fetcher.fetchLatest(this.#getRequestParams())
```

än 

```js
    this.#fetcher.setCurrencies([this.#fromCurrency, ...this.#toCurrencies])
    const rates = await this.#fetcher.fetchLatest()
```

eftersom fetchLatest() metoden då direkt får allt den behöver istället för att förlita sig på att setCurrencies() blivit anropad innan.  Men det tänket i bakhuvudet är jag rätt nöjd med refaktoreringen jag gjort, som egentligen gått åt båda hållen - i vissa fall, som i ovan, har jag byttt från attribut till inparametrar, och i andra fall har jag använt attribut istället för inparametrar. Överlag tycker jag att koden blev mycket mer lästbar när man tittade ur helhetsperspektiv istället för att strikt följa regeln om antal argument.  

Det var en metod som jag tyckte var särskilt svår att skriva om, men där löste jag refaktoreringen just genom att assigna rates som ett attribut,
och det blev då enkelt att separara ut delar till olika metoder utan att behöva "släpa" vidare parametrar från en metod in i nästa.

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

Efter refaktorering blev koden:

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

Man kan förstås argumentera för att setOriginalRates ocg getBaseRate är på lägre abstraktionsnivå än reset() och rebaseRates() men jag kan inte riktigt se hur man skulle kunna abstrahera bort det ännu mer.  

När det kommer till storlek på metod och komplexitet tycket jag att min kod ligger ganska bra till. Jadg har inga långa metoder och skulle säga att överlag har jag inte mer än 2 "indrag", och det är inte på många ställen det heller.  Efter inlämningen skrev jag också om koden från loopar med if/else till att använda map, find och filter, vilket i sig minskar antal förgreningar och blir mer läsbart.

T ex

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

Jag valde att använda map här, eftersom det egentligen inte finns något scenario där BASE_CUR-dimensionen skulle saknas i datan från API:et... om inte all data saknas, förstås.

I den typ av loop med "early return" som jag hade initialt uppstår problemet att man efter loopen måste antingen explicit returnera undefined eller kasta ett fel. Jag tycker att detta blir missvisande i koden, eftersom det kan få läsaren att tro att attributet faktiskt kan saknas ibland. Funktionellt sett behöver man förstås varken kasta ett fel eller returnera undefined, men Scrutinizer, som är ett statiskt kodkvalitetsverktyg jag arbetat med lite grann i tidigare kurser, brukar anmärka på om bara vissa att "vägarna" i en metod har en return sats.

Cloner som används i koden är en egen DeepCloner-klass som rekursivt gör en deep copy av objektet och alla underobjekt. På så sätt undviker jag sidoeffekter och att data kan modifieras utanför den klass där den hör hemma.

Genom att extrahera metoden #isTargetCurrency följer jag även Single Responsibility Principle (SRP) -  #setTargetCurrencies tillsätter attributet, medan #isTargetCurrency avgör vilka element som ska väljas.
## Kapitel 4

## Kapitel 5

## Kapitel 6

## Kapitel 7

## Kapitel 8

## Kapitel 9

## Kapitel 10

## Kapitel 11


## Notes for later

Jag föredrar när setters och getters ligger nära varandra, men det blev svårt att få ihop det med regeln om att koden ska kunna läsas uppifrån och ner. Om en setter innehåller metoder som i sin tur anropar andra metoder, och dessa ska placeras i tur och ordning, hamnar den tillhörande gettern väldigt långt ner i klassen.

Jag har till exempel en klass som tar emot ett dataobjekt och, utifrån datat, hämtar ut och sätter olika attribut med hjälp av privata setters. Eftersom flera setters anropas från samma metod, och dessa i sin tur har egna submetoder, blir det så att getters hamnar längst ner i klassen. Jag upplever att koden blir lite svårläst på det sättet, eftersom det blir svårt att snabbt se vilka attribut man faktiskt har tillgång till att läsa av.

Samtidigt tycker jag att koden blir mer lättöverskådlig om de publika metoderna alltid ligger högst upp, men då hamnar getters och setters inte nära varandra heller i det fall setters är privata.

Det är svårt att väga dessa alternativ mot varandra, men jag tror att jag föredrar att lägga gettern först, sedan settern, och därefter eventuella submetoder till settern i tur och ordning, även om alla setters anropas från samma publika metod.