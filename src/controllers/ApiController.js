/**
 * Controller that handles the API requests.
 *
 * @author Julia Lind
 * @version 1.0.0
 */

import createError from 'http-errors'

import { RateService } from '../services/RateService.js'
import { ConversionService } from '../services/ConversionService.js'


export class ApiController {
  async getByDate(req, res, next) {
    const rateService = new RateService()
    const rates = await rateService.getByDate(req.params, req.query.observations)

    res.json(rates)
  }

  async getByPeriod(req, res, next) {
    const rateService = new RateService()

    const rates = await rateService.getByPeriod(req.params)

    res.json(rates)
  }

  async getLatest(req, res, next) {
    const rateService = new RateService()
    const rates = await rateService.getLatest(req.params.currencies, req.query.observations)

    res.json(rates)
  }

  async getCurrencies(req, res, next) {
    const rateService = new RateService()
    const currencies = await rateService.getCurrencies()

    res.json(currencies)
  }

  async convertOne(req, res, next) {
    const conversionService = new ConversionService()
    const converted = await conversionService.convertOne(req.params)
    res.json(converted)
  }

  async convertMany(req, res, next) {
    const conversionService = new ConversionService()
    const converted = await conversionService.convert(req.params)
    res.json(converted)
  }
}
