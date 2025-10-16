export class RateMerger {
  #merged = {}

  merge(initialData) {
    for (const [currency, rates] of Object.entries(initialData)) {
      this.#loopOneCurrency(currency, rates)
    }
    return this.#merged
  }

  #setDate(date) {
    if (!(date in this.#merged)) {
      this.#merged[date] = {}
    }
  }

  #loopOneCurrency(currency, rates) {
    for (const [date, rate] of Object.entries(rates)) {
      this.#setDate(date)
      this.#merged[date][currency] = rate
    }
  }

  reset () {
    this.#merged = {}
  }

}