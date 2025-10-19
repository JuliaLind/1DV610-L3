/**
 * The jl-pwd web component module.
 *
 * @author Julia Lind <jl225vf@student.lnu.se>
 * @version 1.1.1
 */
import './form/conversion-form.js'
import './form/checkable-option.js'
import { ApiService } from '../services/ApiService.js'
import { CurrencyCalculator } from '../services/CurrencyCalculator.js'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    @import './css/main.css';
    @import './css/table.css';
  </style>

<main>
<template id="tr-template">
  <tr>
    <td class="currency"></td>
    <td class="value"></td>
  </tr>
</template>

<h1>Currency converter</h1>
  <conversion-form></conversion-form>
  <table id="results" part="results">
    <thead>
      <tr>
        <th>Currency</th>
        <th>Rate</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</main>

`

customElements.define('main-view',
  /**
   * Represents a main-view element.
   */
  class extends HTMLElement {
    #form
    #abortController = new AbortController()
    #apiService
    #calculator = new CurrencyCalculator()
    #baseUrl = '/'

    /**
     * Creates an instance of current class.
     */
    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
        .append(template.content.cloneNode(true))

      this.#form = this.shadowRoot.querySelector('conversion-form')
    }

    /**
     * Called when the element is connected to the DOM. Adds neccessary eventlisteners.
     */
    async connectedCallback() {
      this.#addEventListeners()
      this.#prepareApiService()
      await this.#prepareForm()
    }

    /**
     * Prepares the ApiService with the correct base URL.
     */
    #prepareApiService() {
      this.#baseUrl = this.#getBaseUrl()
      this.#apiService = new ApiService(this.#baseUrl)
    }

    /**
     * Gets the base URL for API requests.
     *
     * @returns {string} - the baseUrl to use in API requests
     */
    #getBaseUrl() {
      const pathAfterHost = window.location.pathname.split('/')
      const nonEmptyUrlParts = pathAfterHost.filter(part => part.length > 0)
      const baseUrl = nonEmptyUrlParts.length > 0 ? `./${nonEmptyUrlParts[0]}/` : './'
      return baseUrl
    }


    /**
     * Prepares the form by fetching currencies and rendering options.
     */
    async #prepareForm() {
      const currencies = await this.#fetchCurrencies()

      if (currencies) {
        this.#form.renderCurrencyOptions(currencies)
      }
    }

    /**
     * Adds event listeners to the form.
     */
    #addEventListeners = () => {
      this.#form.addEventListener('submit', this.#onSubmit, { signal: this.#abortController.signal })
    }

    /**
     * Fetches the list of available currencies from the API.
     *
     * @returns {Promise<Array>} - a list of currency objects containing currency name and currency id
     */
    async #fetchCurrencies() {
      try {
        return await this.#apiService.fetchCurrencies()
      } catch (error) {
        this.#handleError(error)
      }
    }

    /**
     * Handles errors that occur during API calls.
     *
     * @param {Error} error - the error object.
     */
    #handleError(error) {
      const errorEvent = new CustomEvent(
        'fetch-error',
        { detail: { message: error.message } }
      )

      this.dispatchEvent(errorEvent)
    }

    /**
     * Handles the form submit event.
     *
     * @param {Event} event - the submit event
     */
    #onSubmit = async (event) => {
      event.preventDefault()
      this.#prepareCalculator(event.detail)

      if (!this.#calculator.hasCachedRates() || !this.#calculator.hasFreshRates()) {
        await this.#refreshRates()
      }

      const results = this.#calculator.getValues()
      this.#renderResults(results)
    }

    /**
     * Prepares the calculator with the form data.
     *
     * @param {object} formData - The form data containing amount, base, and targets,
     * submitted by the user.
     */
    #prepareCalculator = (formData) => {
      const { amount, base, targets } = formData

      this.#calculator.setAmount(amount)
      this.#calculator.setBaseCurrency(base)
      this.#calculator.setTargetCurrencies(targets)
    }

    /**
     * Refreshes the exchange rates in the calculator.
     */
    #refreshRates = async () => {
      const reqParams = {
        amount: 1, // get rates for 1 unit of base currency to avoid extra API requests for just amount changes
        base: this.#calculator.getBaseCurrency(),
        targets: this.#calculator.getTargetCurrencies()
      }

      const rates = await this.#apiService.submitConversion(reqParams)
      this.#calculator.setRates(rates)
    }

    /**
     * Renders the results in the table.
     *
     * @param {object} results - the conversion results
     */
    #renderResults(results) {
      const tbody = this.shadowRoot.querySelector('#results tbody')
      tbody.innerHTML = ''

      for (const [currency, value] of Object.entries(results)) {
        const row = this.shadowRoot.querySelector('#tr-template').content.cloneNode(true)
        const currencyCell = row.querySelector('.currency')
        const valueCell = row.querySelector('.value')

        currencyCell.textContent = currency
        valueCell.textContent = value
        tbody.append(row)
      }
    }

    /**
     * Called when the element is removed from the DOM. Removes eventlistener.
     */
    disconnectedCallback() {
      this.#abortController.abort()
    }
  })
