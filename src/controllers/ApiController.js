/**
 * Controller that handles the API requests.
 *
 * @author Julia Lind
 * @version 1.0.0
 */

import { RateService } from '../services/RateService.js'
import { ConversionService } from '../services/ConversionService.js'
import createError from 'http-errors'

/**
 * Handles API requests
 */
export class ApiController {
  #rateService
  #conversionService

  /**
   * Creates an instance of the ApiController.
   *
   * @param {object} dependencies - The dependencies to be used by the API.
   * @param {RateService} dependencies.rateService - The rate service instance.
   * @param {ConversionService} dependencies.conversionService - The conversion service instance.
   */
  constructor (dependencies) {
    this.#rateService = dependencies?.rateService || new RateService()
    this.#conversionService = dependencies?.conversionService || new ConversionService()
  }

  /**
   * Converts an error to an HTTP error.
   *
   * @param {Error} error - the error to convert
   * @returns {Error} The HTTP error.
   */
  #makeHttpError (error) {
    if (createError.isHttpError(error)) {
      return error
    }

    if (error.code) {
      return createError(error.code, error.message)
    }

    return createError(500, 'Internal Server Error')
  }

  /**
   * Handles requests to get exchange rates by date.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  getByDate = async (req, res, next) => {
    try {
      const rates = await this.#rateService.getByDate(req.params, req.query.observations)

      res.json(rates)
    } catch (error) {
      next(this.#makeHttpError(error))
    }
  }

  /**
   * Handles requests to get exchange rates in a specified period.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  getByPeriod = async (req, res, next) => {
    try {
      const rates = await this.#rateService.getByPeriod(req.params)

      res.json(rates)
    } catch (error) {
      next(this.#makeHttpError(error))
    }
  }

  /**
   * Handles requests to get the latest exchange rates.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  getLatest = async (req, res, next) => {
    try {
      const rates = await this.#rateService.getLatest(req.params.currencies, req.query.observations)

      res.json(rates)
    } catch (error) {
      next(this.#makeHttpError(error))
    }
  }

  /**
   * Handles requests to get the available currencies.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  getCurrencies = async (req, res, next) => {
    try {
      const currencies = await this.#rateService.getCurrencies()

      res.json(currencies)
    } catch (error) {
      next(this.#makeHttpError(error))
    }
  }

  /**
   * Handles requests to convert a single amount between currencies.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @param {Function} next - the next middleware function
   */
  convertOne = async (req, res, next) => {
    try {
      const converted = await this.#conversionService.convertOne(req.params)

      res.json(converted)
    } catch (error) {
      next(this.#makeHttpError(error))
    }
  }
}
