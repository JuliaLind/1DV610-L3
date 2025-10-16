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
        <small id="targetsHelp">Tip: Hold Ctrl/Cmd (or Shift) to select multiple.</small>
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
        #targetCurrencies = []

        /**
         * Creates an instance of current class.
         */
        constructor() {
            super()
            // Create the shadow root first
            const shadow = this.attachShadow({ mode: 'open' })
                .append(template.content.cloneNode(true))

            this.#form = shadow.querySelector('form')
        }

        /**
         * Called when the element is connected to the DOM. Adds neccessary eventlisteners.
         */
        connectedCallback() {
        }

        renderCurrencyOptions(currencies) {
            const baseSelectContent = this.#form.querySelector('#base')
            const targetSelectContent = this.#form.querySelector('#targets')

            for (const currency of currencies) {
                baseSelectContent.append(this.#createSimpleOption(currency))
                targetSelectContent.append(this.#createSimpleOption(currency))
            }
        }

        #createSimpleOption(currency) {
            const option = document.createElement('option')

            option.value = currency.id
            option.textContent = `${currency.id} - ${currency.name}`
            return option
        }

        #createCheckableOption(currency) {
            const option = document.createElement('checkable-option')
            option.value = currency.id
            option.textContent = `${currency.id} - ${currency.name}`
            return option
        }

        /**
         * Called when the element is removed from the DOM. Removes eventlistener.
         */
        disconnectedCallback() {
            this.#abortController.abort()
        }
    })
