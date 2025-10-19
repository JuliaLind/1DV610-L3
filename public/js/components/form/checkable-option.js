const template = document.createElement('template')

template.innerHTML = `
  <style>
    @import './css/option.css';
  </style>

<label id="currencyLabel"><input type="checkbox" id="currency" name="currency" value="" /> <slot></slot></label>

`

customElements.define('checkable-option',
  /**
   * Represents a checkable option in a select list.
   */
  class extends HTMLElement {
    #checkbox

    /**
     * Creates an instance of current class.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .append(template.content.cloneNode(true))

      this.#checkbox = this.shadowRoot.querySelector('input[type="checkbox"]')
    }

    /**
     * The attributes to observe for changes.
     *
     * @returns {Array<string>} - The attributes to observe for changes.
     */
    static get observedAttributes () {
      return ['value', 'checked']
    }

    /**
     * Called when an observed attribute is changed.
     *
     * @param {string} name - name of the changed attribute
     * @param {string} oldValue - the old value of the changed attribute
     * @param {string} newValue - the new value of the changed attribute
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (oldValue === newValue) return

      switch (name) {
        case 'value':
          this.#checkbox.value = newValue
          break
        case 'checked':
          if (newValue === null || newValue.toLowerCase() === 'true') {
            this.#checkbox.setAttribute('checked', '')
            break
          }

          this.#checkbox.removeAttribute('checked')
          break
      }
    }
  })
