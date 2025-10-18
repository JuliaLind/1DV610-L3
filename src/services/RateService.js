import { RateFetcher } from '@jl225vf/exr'
import { stringToArray } from './lib/functions.js'
import { AverageRate } from './lib/Average.js'

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
  constructor (fetcher = new RateFetcher()) {
    this.#fetcher = fetcher
  }

  /**
   * Calculates average rates from fetched rates.
   *
   * @param {object} rates - the rates to calculate averages for
   * @returns {object} the average rates
   */
  #calculateAverage (rates) {
    const averageRates = {}

    for (const [currency, values] of Object.entries(rates)) {
      const average = new AverageRate(values)
      averageRates[currency] = average.getData()
    }

    return averageRates
  }

  /**
   * Returns exchange rates on specified date
   * (and perceeding days if observations is set to more than 1).
   *
   * @param {object} params - the request parameters
   * @param {string} params.date - the date to fetch rates for (format: YYYY-MM-DD)
   * @param {string} params.currencies - the currencies to fetch rates for (format: 'USD+EUR+GBP')
   * @param {string} observations - the number of observations to fetch (default: 1)
   * @returns {Promise<object>} The exchange rates.
   */
  async getByDate ({ date, currencies }, observations = 1) {
    const rates = await this.#fetcher.fetchByDate({ date, currencies: stringToArray(currencies) }, observations)

    return this.#calculateAverage(rates)
  }

  /**
   * Returns exchange rates in the specified period.
   *
   * @param {object} params - the request parameters
   * @param {string} params.startDate - the start date to fetch rates from and including (format: YYYY-MM-DD)
   * @param {string} params.endDate - the end date to fetch rates to and including (format: YYYY-MM-DD)
   * @param {string} params.currencies - the currencies to fetch rates for (format: 'USD+EUR+GBP')
   * @returns {Promise<object>} The exchange rates.
   */
  async getByPeriod ({ startDate, endDate, currencies }) {
    const rates = await this.#fetcher.fetchByPeriod({
      startDate, endDate, currencies: stringToArray(currencies)
    })
    return this.#calculateAverage(rates)
  }

  /**
   * Returns the latest exchange rates.
   *
   * @param {string} currencies - the currencies to fetch rates for (format: 'USD+EUR+GBP')
   * @param {string} observations - the number of observations to fetch (default: 1)
   * @returns {Promise<object>} The exchange rates.
   */
  async getLatest (currencies, observations = 1) {
    const rates = await this.#fetcher.fetchLatest({ currencies: stringToArray(currencies), observations })
    return this.#calculateAverage(rates)
  }

  /**
   * Returns the available currencies.
   *
   * @returns {Promise<Array>} The available currencies.
   */
  async getCurrencies () {
    return await this.#fetcher.getAvailableCurrencies()
  }
}
