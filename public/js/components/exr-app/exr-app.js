/**
 * The jl-pwd web component module.
 *
 * @author Julia Lind <jl225vf@student.lnu.se>
 * @version 1.1.1
 */


const template = document.createElement('template')

template.innerHTML = `
  <style>
h1 {
  color: blue;
  font-size: 2em;
}
  </style>

<main>
<h1>Test</h1>
  <slot></slot>
</main>

`

customElements.define('exr-app',
  /**
   * Represents a exr-app element.
   */
  class extends HTMLElement {
    #main
    #abortController = new AbortController()

    /**
     * Creates an instance of current class.
     */
  constructor () {
    super()
    // Create the shadow root first
    const shadow = this.attachShadow({ mode: 'open' })
      .append(template.content.cloneNode(true))

    this.#main = shadow.querySelector('main')
  }
    /**
     * Called when the element is connected to the DOM. Adds neccessary eventlisteners.
     */
    connectedCallback() {
    }

    /**
     * Called when the element is removed from the DOM. Removes eventlistener.
     */
    disconnectedCallback() {
      this.#abortController.abort()
    }
  })

