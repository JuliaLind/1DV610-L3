const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

  </style>

<input type="checkbox" id="currency" name="currency" value="" /> <label id="currencyLabel"></label>

`

customElements.define('checkable-option',
    /**
     * Represents a checkable option in a select list.
     */
    class extends HTMLElement {
        #checkbox
        #label


        /**
         * Creates an instance of current class.
         */
        constructor() {
            super()

            const shadow = this.attachShadow({ mode: 'open' })
                .append(template.content.cloneNode(true))

            this.#checkbox = shadow.querySelector('input[type="checkbox"]')
            this.#label = shadow.querySelector('label')
        }

        static get observedAttributes() {
            return ['value', 'name', 'checked']
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return

            switch (name) {
                case 'value':
                    this.#checkbox.value = newValue
                    break
                case 'name':
                    this.#label.textContent = newValue
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