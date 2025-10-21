import { DeepCloner } from "@jl225vf/exr"

/**
 * CurrencyCalculator is a service for calculating currency conversions.
 */
export class CurrencyCalculator {
  #date
  #baseCurrency
  #targetCurrencies = []
  #rates = {}
  #amount
  #cloner = new DeepCloner()

  /**
   * Sets the amount to convert from base currency to target currencies.
   *
   * @param {number} amount - the amount to convert from base currency to target currencies
   */
  setAmount (amount) {
    this.#amount = amount
  }

  /**
   * Gets the amount in base currency to convert.
   *
   * @returns {number} - the amount in base currency to convert
   */
  getAmount () {
    return this.#amount
  }

  /**
   * Sets the base currency for conversion.
   *
   * @param {string} currency - the base currency code
   */
  setBaseCurrency (currency) {
    if (this.#isBaseCurrencyChanged(currency)) {
      this.#clearRates()
    }

    this.#baseCurrency = currency
  }

  /**
   * Checks if the base currency has changed.
   *
   * @param {string} currency - the new base currency code
   * @returns {boolean} - true if the base currency has changed
   */
  #isBaseCurrencyChanged (currency) {
    return currency !== this.#baseCurrency
  }

  /**
   * Gets the current base currency.
   *
   * @returns {string} the current base currency
   */
  getBaseCurrency () {
    return this.#baseCurrency
  }

  /**
   * Sets the target currencies for conversion.
   *
   * @param {Array} currencies - the target currencies to set
   */
  setTargetCurrencies (currencies) {
    if (this.#isTargetCurrenciesChanged(currencies)) {
      this.#clearRates()
    }

    this.#targetCurrencies = currencies
  }

  /**
   * Checks if the target currencies have changed.
   *
   * @param {Array} currencies - the new target currencies
   * @returns {boolean} - true if the target currencies have changed
   */
  #isTargetCurrenciesChanged (currencies) {
    if (this.#targetCurrencies.length !== currencies.length) {
      return true
    }

    for (const currency of currencies) {
      if (!this.#targetCurrencies.includes(currency)) {
        return true
      }
    }

    return false
  }

  /**
   * Gets the current target currencies.
   *
   * @returns {Array} the current target currencies
   */
  getTargetCurrencies () {
    return this.#cloner.clone(this.#targetCurrencies)
  }

  /**
   * Sets the exchange rates for conversion.
   *
   * @param {object} rates - the exchange rates to set.
   * Note that for the conversion to work correctly the rates must
   * be in the form of 1 base currency unit equals X target currency units.
   */
  setRates (rates) {
    this.#rates = rates
    this.#date = this.#dateToString(new Date())
  }

  /**
   * Converts a date to a string in YYYY-MM-DD format.
   *
   * @param {Date | string} date - the date to convert
   * @returns {string} the formatted date string
   */
  #dateToString (date) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }

    return date
  }

  /**
   * Gets the date of latest rates.
   *
   * @returns {string} the date of latest rates
   */
  getDate () {
    return this.#date
  }

  /**
   * Clears the cached rates.
   */
  #clearRates () {
    this.#rates = {}
    this.#date = null
  }

  /**
   * Checks if the cached rates are from today.
   *
   * @param {string | Date} date - checks if the cached rates are from today
   * @returns {boolean} - true if the cached rates are from the given date
   */
  hasFreshRates (date) {
    return this.#date === this.#dateToString(date)
  }

  /**
   * Get the converted values of the amount in the target currencies.
   *
   * @returns {object} - values of the amount in the target currencies
   */
  getValues () {
    this.#validate()

    return this.#convertAll()
  }

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

  /**
   * Converts the amount to all target currencies.
   *
   * @returns {object} - object with currency codes as keys and converted amount as values
   */
  #convertAll () {
    const results = {}

    for (const currency of this.#targetCurrencies) {
      const rate = this.#rates[currency]

      results[currency] = this.#convertOne(rate)
    }

    return results
  }

  /**
   * Converts the amount to one target currency.
   *
   * @param {number} rate - the exchange rate to use for conversion of amount
   * @returns {number|null} - the converted amount, or null if rate is not available
   */
  #convertOne (rate) {
    return rate ? Number((this.#amount * rate).toFixed(2)) : null
  }
}
