import { RateFetcher } from "@jl225vf/exr"

export class RateService {
    #fetcher

    constructor(fetcher = new RateFetcher()) {
        this.#fetcher = fetcher;
    }

    #setCurrencies (currencies) {
        this.#fetcher.setCurrencies(currencies?.split('+') || [])
    }

    async getByDate({ date, currencies}, observations = 1) {
        this.#setCurrencies(currencies)
        return await this.#fetcher.fetchByDate(date, observations)
    }

    async getByPeriod({ startDate, endDate, currencies }) {
        this.#setCurrencies(currencies)
        return await this.#fetcher.fetchByPeriod(startDate, endDate)
    }

    async getLatest(currencies, observations = 1) {
        this.#setCurrencies(currencies)
        return await this.#fetcher.fetchLatest(observations)
    }

    async getCurrencies() {
        return await this.#fetcher.getCurrencies()
    }
}