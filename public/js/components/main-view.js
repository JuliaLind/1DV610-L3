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
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

      h1 {
        text-align: center;
      }

      table {
        border-collapse: collapse;   /* removes double borders */
        width: 100%;                 /* full width of its container */
        max-width: 30rem;            /* keeps it from being too wide */
        margin-top: 1em;
        font: inherit;
        text-align: left;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;            /* round corners work properly */
      }

      thead {
        background-color: #f0f0f0;
      }

      th, td {
        padding: 0.5em 0.75em;
        border-bottom: 1px solid #ddd;
      }

      th {
        font-weight: 600;
      }

      tr:nth-child(even) td {
        background-color: #fafafa;   /* subtle alternating row color */
      }

      tr:hover td {
        background-color: #f2f7ff;   /* gentle highlight when hovering a row */
      }

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
    #apiService = new ApiService(import.meta.env?.BASE_URL || '/')
    #calculator = new CurrencyCalculator()

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
      await this.#prepareForm()
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
