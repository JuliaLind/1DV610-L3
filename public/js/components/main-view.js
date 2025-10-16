/**
 * The jl-pwd web component module.
 *
 * @author Julia Lind <jl225vf@student.lnu.se>
 * @version 1.1.1
 */
import './form/conversion-form.js'
import './form/checkable-option.js'
import '../services/ApiService.js'

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
<h1>Test</h1>
  <conversion-form></conversion-form>
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
    constructor() {
      super()

      const shadow = this.attachShadow({ mode: 'open' })
        .append(template.content.cloneNode(true))

      this.#form = shadow.querySelector('conversion-form')
    }

    /**
     * Called when the element is connected to the DOM. Adds neccessary eventlisteners.
     */
    async connectedCallback() {
      await this.#prepareForm()
    }

    async #fetchCurrencies() {
      try {
        return await this.#apiService.fetchCurrencies()
      } catch (error) {
        this.#dispatchEvent('fetch-error', { message: error.message })
      }
    }

    #dispatchEvent(name, detail = {}) {
      this.dispatchEvent(
        new CustomEvent(name, { detail })
      )
    }

    #dispatchEvent(name, detail = {}) {
      this.dispatchEvent(
        new CustomEvent(name, { detail })
      )
    }

    async #prepareForm() {
      const currencies = await this.#fetchCurrencies()
      if (currencies) {
        this.#form.renderCurrencyOptions(currencies)
      }
    }



    /**
     * Called when the element is removed from the DOM. Removes eventlistener.
     */
    disconnectedCallback() {
      this.#abortController.abort()
    }
  })
