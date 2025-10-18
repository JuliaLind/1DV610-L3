import { DeepCloner } from '@jl225vf/exr'

/**
 * Class representing the average rate of a currency
 */
export class AverageRate {
  #value
  #dates

  /**
   * Creates an instance of AverageRate.
   *
   * @param {object} data - the exchange rates data
   */
  constructor (data) {
    this.#setDates(Object.keys(data))
    this.#setValue(Object.values(data))
  }

  /**
   * Sets the average value of the rates.
   *
   * @param {object} rates - the exchange rates
   */
  #setValue (rates) {
    this.#value = this.#sum(rates) / this.#count(rates)
  }

  /**
   * Sums the values of an array of rates.
   *
   * @param {Array} rates - the exchange rates
   * @returns {number} - the total sum of the rates
   */
  #sum (rates) {
    let total = 0
    for (const rate of rates) {
      total += rate
    }
    return total
  }

  /**
   * Counts the number of elements in an array of rates.
   *
   * @param {Array} rates - the exchange rates
   * @returns {number} - the count of the rates
   */
  #count (rates) {
    return rates.length
  }

  /**
   * Sets the observation dates.
   *
   * @param {Array} dates - list of observation dates
   */
  #setDates (dates) {
    this.#dates = dates
  }

  /**
   * Returns the observation dates.
   *
   * @returns {Array} - a list of dats
   */
  getDates () {
    const cloner = new DeepCloner()
    return cloner.clone(this.#dates)
  }

  /**
   * Returns the first date in the observation period.
   *
   * @returns {string} the first date in the observation period
   */
  getFirstDate () {
    return this.#dates[0]
  }

  /**
   * Returns the last date in the observation period.
   *
   * @returns {string} the last date in the observation period
   */
  getLastDate () {
    return this.#dates[this.#dates.length - 1]
  }

  /**
   * Gets the average value of the rates.
   *
   * @returns {number} - the average value of the rates
   */
  getValue () {
    return Number(this.#value.toFixed(4))
  }

  /**
   * Gets the summarised data.
   *
   * @returns {object} - summarised data
   */
  getData () {
    return {
      value: this.getValue(),
      period: {
        start: this.getFirstDate(),
        end: this.getLastDate()
      },
      observations: this.#dates.length
    }
  }
}
