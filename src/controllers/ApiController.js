/**
 * Controller that handles the API requests.
 *
 * @author Julia Lind
 * @version 1.0.0
 */

import { RateService } from '../services/RateService.js'
import { ConversionService } from '../services/ConversionService.js'

/**
 * Handles API requests
 */
export class ApiController {
  /**
   * Handles requests to get exchange rates by date.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  async getByDate (req, res, next) {
    const rateService = new RateService()
    const rates = await rateService.getByDate(req.params, req.query.observations)

    res.json(rates)
  }

  /**
   * Handles requests to get exchange rates in a specified period.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  async getByPeriod (req, res, next) {
    const rateService = new RateService()

    const rates = await rateService.getByPeriod(req.params)

    res.json(rates)
  }

  /**
   * Handles requests to get the latest exchange rates.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  async getLatest (req, res, next) {
    const rateService = new RateService()
    const rates = await rateService.getLatest(req.params.currencies, req.query.observations)

    res.json(rates)
  }

  /**
   * Handles requests to get the available currencies.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  async getCurrencies (req, res, next) {
    const rateService = new RateService()
    const currencies = await rateService.getCurrencies()

    res.json(currencies)
  }

  /**
   * Handles requests to convert a single amount between currencies.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  async convertOne (req, res, next) {
    const conversionService = new ConversionService()
    const converted = await conversionService.convertOne(req.params)
    res.json(converted)
  }
}
