/**
 * The jl-pwd web component module.
 *
 * @author Julia Lind <jl225vf@student.lnu.se>
 * @version 1.1.1
 */
import './form/conversion-form.js'
import './form/checkable-option.js'
import { ApiService } from '../services/ApiService.js'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>

<main>
<template id="tr-template">
  <tr>
    <td class="currency"></td>
    <td class="value"></td>
  </tr>
</template>

<h1>Test</h1>
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
    #apiService = new ApiService(import.meta.env.BASE_URL || '/')

    /**
     * Creates an instance of current class.
     */
    constructor () {
      super()

      const shadow = this.attachShadow({ mode: 'open' })
        .append(template.content.cloneNode(true))

      this.#form = shadow.querySelector('conversion-form')
    }

    /**
     * Called when the element is connected to the DOM. Adds neccessary eventlisteners.
     */
    async connectedCallback () {
      await this.#prepareForm()
    }

    addEventListeners () {
      this.#form.addEventListener('submit', this.#onSubmit, { signal: this.#abortController.signal })
    }

    /**
     * Fetches the list of available currencies from the API.
     *
     * @returns {Array} - a list of currency objects containing currency name and currency id
     */
    async #fetchCurrencies () {
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
    #handleError (error) {
      const errorEvent = new CustomEvent(
        'fetch-error',
        { detail: { message: error.message } }
      )

      this.dispatchEvent(errorEvent)
    }

    /**
     * Prepares the form by fetching currencies and rendering options.
     */
    async #prepareForm () {
      const currencies = await this.#fetchCurrencies()

      if (currencies) {
        this.#form.renderCurrencyOptions(currencies)
      }
    }

    #onSubmit = async (event) => {
      event.preventDefault()

      const results = await this.#apiService.submitConversion(event.detail)
      this.#renderResults(results)
    }

    #renderResults (results) {
      const tbody = this.shadowRoot.querySelector('#results tbody')
      tbody.innerHTML = ''

      for (const [currency, value ] of Object.entries(results)) {
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
    disconnectedCallback () {
      this.#abortController.abort()
    }
  })
