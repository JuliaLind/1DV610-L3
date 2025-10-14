import { RateFetcher } from '@jl225vf/exr'
import { stringToArray } from './lib/functions.js'

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
    this.#setCurrencies(currencies)
    return await this.#fetcher.fetchByDate(date, observations)
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
    this.#setCurrencies(currencies)
    return await this.#fetcher.fetchByPeriod(startDate, endDate)
  }

  /**
   * Returns the latest exchange rates.
   *
   * @param {string} currencies - the currencies to fetch rates for (format: 'USD+EUR+GBP')
   * @param {string} observations - the number of observations to fetch (default: 1)
   * @returns {Promise<object>} The exchange rates.
   */
  async getLatest (currencies, observations = 1) {
    this.#setCurrencies(currencies)

    return await this.#fetcher.fetchLatest(observations)
  }

  /**
   * Returns the available currencies.
   *
   * @returns {Promise<Array>} The available currencies.
   */
  async getCurrencies () {
    return await this.#fetcher.getAvailableCurrencies()
  }

  /**
   * Sets the currencies to get rates for.
   *
   * @param {string} currencies A string of currencies separated by '+', e.g. 'USD+EUR+GBP'
   */
  #setCurrencies (currencies) {
    this.#fetcher.setCurrencies(stringToArray(currencies))
  }
}
