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
        #selectedOptions = new Set()
        #abortController = new AbortController()


        /**
         * Creates an instance of current class.
         */
        constructor() {
            super()

            this.attachShadow({ mode: 'open' })
                .append(template.content.cloneNode(true))

        }

        connectedCallback() {
            this.addEventListener('click', this.onClick, {
                signal: this.#abortController.signal
            })
        }

        onClick = (event) => {
            const option = event.target.closest('checkable-option')

            if (option) {
                this.#toggleSelection(option)
            }
        }

        #toggleSelection(option) {
            if (this.#isSelected(option)) {
                this.#select(option)
            } else {
                this.#unselect(option)
            }
        }

        #isSelected(option) {
            return option.hasAttribute('checked') && option.getAttribute('checked').toLowerCase() === 'true'
        }

        #select(option) {
            this.#selectedOptions.add(option.getAttribute('value'))
        }

        #unselect(option) {
            this.#selectedOptions.delete(option.getAttribute('value'))
        }

        getAttribute(attributeName) {
            switch (attributeName) {
                case 'value':
                    return this.#selectedOptions
                default:
                    return super.getAttribute(attributeName)
            }
        }
    })