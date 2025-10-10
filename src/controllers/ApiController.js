/**
 * Controller that handles the API requests.
 *
 * @author Julia Lind
 * @version 1.0.0
 */

import createError from 'http-errors'
import { RateFetcher } from "@jl225vf/exr"

export class ApiController {
  #fetcher

  constructor(fetcher = new RateFetcher()) {
    this.#fetcher = fetcher
  }

  #setCurrencies (currencies) {
    this.#fetcher.setCurrencies(currencies ? currencies.split(',') : [])
  }

  async getByDate(req, res, next) {
      const { date, currencies, observations } = req.params

      this.#setCurrencies(currencies)
      const rates = await this.#fetcher.fetchByDate(date, observations)

      res.json(rates)
  }

  async getByPeriod(req, res, next) {
      const { startDate, endDate, currencies } = req.params

      this.#setCurrencies(currencies)
      const rates = await this.#fetcher.fetchByPeriod(startDate, endDate)

      res.json(rates)
  }

  async getLatest(req, res, next) {
      const { currencies, observations } = req.params

      this.#setCurrencies(currencies)
      const rates = await this.#fetcher.fetchLatest(observations)

      res.json(rates)
  }

  @TODO add fetch available currencies
}
