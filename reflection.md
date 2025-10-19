# Reflektion  

Efter att ha reflekterat kring koden i L2 samt fått feedback från medstudenter skrev jag om merparten av de privata delarna i modulen, samt några va de publika metoderna  (vilket förstås följdes av publicering av ny major version eftersom det påverkade bakåtkompatibilitet).

## Kapitel 2  

Jag har skrivit om onödiga förkortningar i modulen till motsvarande längre variant som gör koden lättare för utomstående att sätta sig in i. Till exempel har jag änrat har ändrat namn på metoden #prep() till #prepareRates().
Jag har också ändrat vissa metodnamn för att höja abstraktionsnivån och bättre representera metodens övergripande ansvar.  

Jag har även ändrat på namn som kunde vara missvisande. Till expempel hade jag en metod som hette #isReady(), men den returnerade inte ett boolan utan kastade ett fel om klassen inte var "redo". Jag misstänker att jag ursprungligen tänkte att den skulle returnera en boolean men sedan ändrade mig - den metoden bytte jag namn på till #alertIfNotReady(), vilket då blir tydligare att metoden gör något och inte returnerar ett värde.



## Kapitel 3  

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

## Kapitel 4

## Kapitel 5

## Kapitel 6

## Kapitel 7

## Kapitel 8

## Kapitel 9

## Kapitel 10

## Kapitel 11