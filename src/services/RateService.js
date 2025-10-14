import { RateFetcher } from '@jl225vf/exr'

/**
 *
 */
export class RateService {
  #fetcher

  /**
   * Creates a new instance of RateService
   *
   * @param {RateFetcher} fetcher
   */
  constructor(fetcher = new RateFetcher()) {
    this.#fetcher = fetcher
  }

  /**
   * Returns exchange rates on specified date ( and perceeding days if observations is set to more than 1).
   *
   * @param params - the request parameters
   * @param params.date - the date to fetch rates for (format: YYYY-MM-DD)
   * @param params.currencies - the currencies to fetch rates for (format: 'USD+EUR+GBP')
   * @param observations - the number of observations to fetch (default: 1)
   */
  async getByDate({ date, currencies }, observations = 1) {
    this.#setCurrencies(currencies)
    return await this.#fetcher.fetchByDate(date, observations)
  }

  /**
   * Returns exchange rates in the specified period.
   *
   * @param params - the request parameters
   * @param params.startDate - the start date to fetch rates from and including (format: YYYY-MM-DD)
   * @param params.endDate - the end date to fetch rates to and including (format: YYYY-MM-DD)
   * @param params.currencies - the currencies to fetch rates for (format: 'USD+EUR+GBP')
   */
  async getByPeriod({ startDate, endDate, currencies }) {
    this.#setCurrencies(currencies)
    return await this.#fetcher.fetchByPeriod(startDate, endDate)
  }

  /**
   * Returns the latest exchange rates.
   *
   * @param currencies - the currencies to fetch rates for (format: 'USD+EUR+GBP')
   * @param observations - the number of observations to fetch (default: 1)
   */
  async getLatest(currencies, observations = 1) {
    this.#setCurrencies(currencies)
    return await this.#fetcher.fetchLatest(observations)
  }

  /**
   * Returns the available currencies.
   */
  async getCurrencies() {
    return await this.#fetcher.getAvailableCurrencies()
  }

  /**
 * Sets the currencies to get rates for.
 *
 * @param {string} currencies A string of currencies separated by '+', e.g. 'USD+EUR+GBP'
 */
  #setCurrencies(currencies) {
    this.#fetcher.setCurrencies(currencies?.split('+') || [])
  }
}
