export class ApiService {
    #baseUrl

    constructor(baseUrl) {
        this.#baseUrl = baseUrl
    }

    async fetchCurrencies() {
        const response = await fetch(`${this.#baseUrl}api/currencies`)

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        return await response.json()
    }
}