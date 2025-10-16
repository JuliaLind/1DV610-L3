const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      overflow: auto;
      width: 100%;
      height: 5rem;
    }

  </style>

    <div id="options" class="scroll-container">
    <slot></slot>
    </div>
`

customElements.define('checkable-select',
  /**
   * Represents a checkable option in a select list.
   */
  class extends HTMLElement {
    #selected = new Set()
    #abortController = new AbortController()

    /**
     * Creates an instance of current class.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .append(template.content.cloneNode(true))
    }

    /**
     * Called when the element is connected to the DOM. Adds neccessary eventlisteners.
     */
    connectedCallback () {
      this.addEventListener('click', this.onClick, {
        signal: this.#abortController.signal
      })
    }

    /**
     * Called when user clicks within the slot (not shadowdom).
     *
     * @param {PointerEvent} event - click event
     */
    onClick = (event) => {
      const option = event.target.closest('checkable-option')

      if (option) {
        this.#toggleSelection(option)
      }
    }

    /**
     * Toggles selection of the clicked option by adding/removing it from the selected set.
     *
     * @param {HTMLElement} option - the checkable option that was closest to the click
     */
    #toggleSelection (option) {
      if (this.#isSelected(option)) {
        this.#select(option)
      } else {
        this.#unselect(option)
      }
    }

    /**
     * Checks if the clicked option is selected.
     *
     * @param {HTMLElement} option - the clicked option
     * @returns {boolean} - true if the option is selected, false otherwise
     */
    #isSelected (option) {
      return option.hasAttribute('checked') && option.getAttribute('checked').toLowerCase() === 'true'
    }

    /**
     * Adds the value of selected option to the selected set.
     *
     * @param {HTMLElement} option - the checkable option that has been selected by user.
     */
    #select (option) {
      this.#selected.add(option.getAttribute('value'))
    }

    /**
     * Removes the value of selected option from the selected set.
     *
     * @param {HTMLElement} option - the checkable option that has been unselected by user.
     */
    #unselect (option) {
      this.#selected.delete(option.getAttribute('value'))
    }

    /**
     * Gets the value of the specified attribute or an array of the values of the selected options.
     *
     * @param {string} attributeName - name of the attribute
     * @returns {string | Array<string>} - the value of the attribute or values of selected options.
     */
    getAttribute (attributeName) {
      switch (attributeName) {
        case 'value':
          return Array.from(this.#selected)
        default:
          return super.getAttribute(attributeName)
      }
    }
  })
