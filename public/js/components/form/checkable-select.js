const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      font: inherit;
      color: inherit;
      box-sizing: border-box;

      inline-size: min(24rem, 100%);

      border: 1px solid #bbb;
      border-radius: 4px;
      background: #fff;
      padding: 0;
      overflow: hidden;
    }


    #options {
      max-block-size: 10rem; 
      overflow-y: auto;
      overflow-x: hidden;
    }

    ::slotted(checkable-option) {
      display: flex;
      align-items: center;
      gap: 0.5em;
      padding: 0.35em 0.6em;
      line-height: 1.2;
      cursor: default;
      user-select: none;
    }

    ::slotted(checkable-option:hover) {
      background: #f2f2f2;
    }

    ::slotted(input[type="checkbox"]) {
      margin: 0;
      cursor: pointer;
    }

    :host([multiple]) {
      height: auto;
    }
  </style>

  <div id="options">
    <slot></slot>
  </div>
`

customElements.define(
  'checkable-select',
  class extends HTMLElement {
    #selected = new Set()
    #abortController = new AbortController()

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      .append(template.content.cloneNode(true))
    }

    connectedCallback() {
      this.addEventListener('click', this.onClick, {
        signal: this.#abortController.signal,
      });
    }

    onClick = (event) => {
      const option = event.target.closest('checkable-option')
      if (option) this.#toggleSelection(option)
    };

    #toggleSelection(option) {
      if (this.#isSelected(option)) {
        this.#unselect(option)
      } else {
        this.#select(option)
      }
    }

    #isSelected(option) {
      return (
        option.hasAttribute('checked') &&
        option.getAttribute('checked').toLowerCase() === 'true'
      )
    }

    #select(option) {
      option.setAttribute('checked', 'true')
      this.#selected.add(option.getAttribute('value'))
    }

    #unselect(option) {
      option.removeAttribute('checked')
      this.#selected.delete(option.getAttribute('value'))
    }

    getAttribute(attributeName) {
      if (attributeName === 'value') {
        return Array.from(this.#selected)
      }
      return super.getAttribute(attributeName)
    }

    disconnectedCallback() {
      this.#abortController.abort()
    }
  }
)
