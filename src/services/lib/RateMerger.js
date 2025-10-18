// @TODO Not in use, keep for future extension of API

/**
 * Merges the exchange rate fetched by RateFetcher into a date-centric structure.
 */
export class RateMerger {
  #merged = {}

  /**
   * Merges the initial data into a date-centric structure.
   *
   * @param {object} initialData - the data as returned by RateFetcher
   * @returns {object} The merged data.
   */
  merge (initialData) {
    for (const [currency, rates] of Object.entries(initialData)) {
      this.#loopOneCurrency(currency, rates)
    }
    return this.#merged
  }

  /**
   * Sets the date in the merged structure.
   *
   * @param {string} date - The date to set.
   */
  #setDate (date) {
    if (!(date in this.#merged)) {
      this.#merged[date] = {}
    }
  }

  /**
   * Merges the rates for a single currency into the merged structure.
   *
   * @param {string} currency - the currency code, for example 'USD'
   * @param {object} rates - the rates for the currency
   * formatted as { 'YYYY-MM-DD': value of currency corresponding to 1 NOK}
   */
  #loopOneCurrency (currency, rates) {
    for (const [date, rate] of Object.entries(rates)) {
      this.#setDate(date)
      this.#merged[date][currency] = rate
    }
  }

  /**
   * Resets the merged data.
   */
  reset () {
    this.#merged = {}
  }
}
