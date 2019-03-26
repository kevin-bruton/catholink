import {LitElement, html} from 'lit-element'

class MyLit extends LitElement {
    render () {
        return html`<p>A paragraph</p>`
    }
}

customElements.define('my-lit', LitElement)
