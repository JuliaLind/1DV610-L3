/**
 * The conversion-form web component module.
 *
 * @author Julia Lind <jl225vf@student.lnu.se>
 * @version 1.1.1
 */

import './checkable-select.js'
import './checkable-option.js'


const template = document.createElement('template')

template.innerHTML = `
  <style>

  </style>

<form part="form" autocomplete="off" method="GET" action="">
    <fieldset id="base">
        <label>Amount
            <input id="amount" name="amount" type="number" inputmode="decimal" step="0.01" placeholder="1500" required />
        </label>
        <label>Base currency
            <select id="base" name="base" required>
            </select>
        </label>
    </fieldset>

    <fieldset>
        <label>Target currencies (multi-select)
            <checkable-select id="targets" name="targets" multiple size="10">
            </checkable-select>
        </label>
    </fieldset>


    <button id="submit" type="submit"></button>
</form>

`

customElements.define('conversion-form',
    /**
     * Represents a conversion-form element.
     */
    class extends HTMLElement {
        #form
        #abortController = new AbortController()

        /**
         * Creates an instance of current class.
         */
        constructor() {
            super()

            const shadow = this.attachShadow({ mode: 'open' })
                .append(template.content.cloneNode(true))

            this.#form = shadow.querySelector('form')
        }

        /**
         * Called when the element is connected to the DOM. Adds neccessary eventlisteners.
         */
        connectedCallback() {
            this.#form.addEventListener('submit', this.onSubmit, { signal: this.#abortController.signal })
        }

        /**
         * Renders the currency options in the form.
         *
         * @param {Array<Object>} currencies - The currencies to make options from.
         */
        renderCurrencyOptions(currencies) {
            const baseSelectContent = this.#form.querySelector('#base')
            const targetSelectContent = this.#form.querySelector('#targets')

            for (const currency of currencies) {
                baseSelectContent.append(this.#createOption(currency, 'option'))
                targetSelectContent.append(this.#createOption(currency, 'checkable-option'))
            }
        }

        /**
         *
         * @param {Object} currency - The currency to create an option from.
         * @param {String} optionType - option or checkable-option
         * @returns {HTMLElement} option or checkable-option element
         */
        #createOption(currency, optionType) {
            const option = document.createElement(optionType)

            option.setAttribute('value', currency.id)
            option.textContent = `${currency.id} - ${currency.name}`

            return option
        }

        /**
         * Called when the user submits the form. Dispatches a submit event with the form data.
         *
         * @param {submit} event - event emitted when the user submits the form 
         */
        onSubmit = (event) => {
            event.preventDefault()

            const amount = this.#form.querySelector('#amount').value
            const base = this.#form.querySelector('#base').value
            const targets = Array.from(this.#form.querySelector('#targets').getAttribute('value'))

            const submitEvent = new CustomEvent(
                'submit',
                { detail: { amount, base, targets } }
            )

            this.dispatchEvent(submitEvent)
        }


        /**
         * Called when the element is removed from the DOM. Removes eventlistener.
         */
        disconnectedCallback() {
            this.#abortController.abort()
        }
    })
