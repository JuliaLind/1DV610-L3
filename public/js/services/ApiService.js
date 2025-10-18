/**
 * Service for interacting with the API.
 */
export class ApiService {
  #baseUrl

  /**
   * Creates an instance of the ApiService.
   *
   * @param {string} baseUrl - the base URL where the API (and current app) is hosted
   */
  constructor (baseUrl) {
    this.#baseUrl = baseUrl
  }

  /**
   * Fetches the list of available currencies from the API.
   *
   * @returns {Promise<Array>} - a list of currency objects containing currency name and currency id
   */
  async fetchCurrencies () {
    const response = await fetch(`${this.#baseUrl}api/currencies`)

    return await this.#fromJson(response)
  }

  /**
   * Submits a conversion request to the API.
   *
   * @param {object} reqParams - the request parameters
   * @param {number} reqParams.amount - the amount to convert
   * @param {string} reqParams.base - the base currency
   * @param {Array<string>} reqParams.targets - the target currencies
   * @returns {Promise<object>} - the conversion results
   */
  async submitConversion (reqParams) {
    const { amount, base, targets } = reqParams
    const url = new URL(`${this.#baseUrl}api/convert/${amount}/${base}/${targets.join('+')}`)

    const response = await fetch(url)

    return await this.#fromJson(response)
  }

  /**
   * Parses the JSON response from the API.
   *
   * @param {Response} response - the fetch response
   * @returns {Promise<object>} - the parsed JSON data
   */
  async #fromJson (response) {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch data.')
    }

    return data
  }
}
