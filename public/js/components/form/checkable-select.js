const template = document.createElement('template')

template.innerHTML = `
  <style>
    @import './css/select.css';
  </style>

  <div id="options">
    <slot></slot>
  </div>
`

customElements.define(
  'checkable-select',
  /**
   * A html select-like element with checkable options.
   */
  class extends HTMLElement {
    #selected = new Set()
    #abortController = new AbortController()

    /**
     * Creates an instance of checkable select.
     */
    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
        .append(template.content.cloneNode(true))
    }

    /**
     * Called when the element is connected to the DOM.
     * Adds neccessary eventlisteners.
     */
    connectedCallback() {
      this.addEventListener('change', this.onChange, {
        signal: this.#abortController.signal
      })
    }

    /**
     * Handles change events on the checkable options.
     *
     * @param {Event} event - the change event
     */
    onChange = (event) => {
      const option = event.target.closest('checkable-option')

      if (option) {
        this.#toggleSelection(option)
      }
      console.log(option)
      console.log(this.#selected)
    }

    /**
     * Toggles the selection state of a checkable option.
     *
     * @param {HTMLElement} option - The checkable-option element
     */
    #toggleSelection(option) {
      if (this.#isSelected(option)) {
        this.#select(option)
      } else {
        this.#unselect(option)
      }
    }

    /**
     * Checks if a checkable option is selected.
     *
     * @param {HTMLElement} option - The checkable-option element
     * @returns {boolean} true if selected, false otherwise
     */
    #isSelected(option) {
      return option.hasAttribute('checked')
    }

    /**
     * Unselects a checkable option by removing it from the selection set.
     *
     * @param {HTMLElement} option - The checkable-option element
     */
    #unselect(option) {
      this.#selected.delete(option.getAttribute('value'))
    }

    /**
     * Selects a checkable option by adding it to the selection set.
     *
     * @param {HTMLElement} option - The checkable-option element
     */
    #select(option) {
      option.getAttribute('value')
      this.#selected.add(option.getAttribute('value'))
    }

    /**
     * Overrides the default getAttribute to return the selected values
     * if attribute name is 'value'. Otherwise, returns the requested attribute.
     *
     * @param {string} attributeName - The name of the attribute to get
     * @returns {string|Array<string>} The attribute value or selected values
     */
    getAttribute(attributeName) {
      if (attributeName === 'value') {
        return Array.from(this.#selected)
      }

      return super.getAttribute(attributeName)
    }

    /**
     * Called when the element is disconnected from the DOM.
     * Cleans up eventlisteners.
     */
    disconnectedCallback() {
      this.#abortController.abort()
    }
  }
)
