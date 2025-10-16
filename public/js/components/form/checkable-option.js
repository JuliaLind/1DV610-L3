const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

  </style>

<input type="checkbox" id="currency" name="currency" value="" /> <label id="currencyLabel"><slot></slot></label>

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

      const shadow = this.attachShadow({ mode: 'open' })
        .append(template.content.cloneNode(true))

      this.#checkbox = shadow.querySelector('input[type="checkbox"]')
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
            this.#checkbox.checked = newValue === 'true'
            break
          }

          this.#checkbox.checked = false
          break
      }
    }
  })
