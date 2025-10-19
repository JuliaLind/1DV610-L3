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
    #abortController = new AbortController()
    #checkbox
    #checked = false

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
     * Called when the element is connected to the DOM.
     * Adds neccessary eventlisteners.
     */
    connectedCallback () {
      this.#checkbox.addEventListener('change', this.#onChange, { signal: this.#abortController.signal })
    }

    /**
     * Handles change events on the checkbox.
     *
     * @param {Event} event - the change event when checkbox is checked/unchecked
     */
    #onChange = (event) => {
      this.#toggleChecked()
      this.dispatchEvent(new Event('change', { bubbles: true }))
    }

    /**
     * Toggles the checked state of the checkable-option .
     */
    #toggleChecked () {
      if (this.#checkbox.checked) {
        this.#check()
        return
      }

      this.#uncheck()
    }

    /**
     * Called when the element is disconnected from the DOM.
     * Cleans up eventlisteners.
     */
    disconnectedCallback () {
      this.#abortController.abort()
    }

    /**
     * Overrides the default hasAttribute method.
     * When checking for 'checked', returns the internal checked state.
     * Otherwise confirms presence of the actual attribute.
     *
     * @param {string} name - name of the attribute to check
     * @returns {boolean} true if attribute is present, false otherwise
     */
    hasAttribute (name) {
      switch (name) {
        case 'checked':
          return this.#checked
        default:
          return super.hasAttribute(name)
      }
    }

    /**
     * Overrides the default hasAttribute method.
     * When checking for 'checked', returns the internal checked state.
     * Otherwise returned the value of the actual attribute.
     *
     * @param {string} name - name of the attribute to get
     * @returns {string|null} value of the attribute or null if not present
     */
    getAttribute (name) {
      switch (name) {
        case 'checked':
          return String(this.#checked)
        default:
          return super.getAttribute(name)
      }
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
      if (oldValue === newValue) {
        return
      }

      switch (name) {
        case 'value':
          this.#checkbox.value = newValue
          break
        case 'checked':
          if (newValue !== null) {
            this.#check()
            break
          }

          this.#uncheck()
          break
      }
    }

    /**
     * Checks the checkable-option by adding the checked attribute
     * and updating the internal state.
     */
    #check () {
      this.setAttribute('checked', '')
      this.#checkbox.checked = true
      this.#checked = true
    }

    /**
     * Unchecks the checkable-option by removing the checked attribute
     * and updating the internal state.
     */
    #uncheck () {
      this.removeAttribute('checked')
      this.#checkbox.checked = false
      this.#checked = false
    }
  })
