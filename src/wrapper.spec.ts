import '../demo/ngx-elements/dist/app.js'

import { expect } from 'chai'

describe('Wrapper', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('hello-world')
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  it('should have shadowRoot', () => {
    expect(element.shadowRoot).not.null
    expect(element.shadowRoot).not.undefined
  })

  it('should have h1 element', () => {
    const h1 = element.shadowRoot.querySelector('h1')
    expect(h1).not.undefined
    expect(h1).not.null
  })

  it('should have [name] property', () => {
    expect(element.hasOwnProperty('name')).to.true
  })

  it('should initialize [name] property', () => {
    /// @ts-ignore
    expect(element.name).to.eq('World')
  })

  it('should update custom element [name] property when setAttibute', () => {
    element.setAttribute('name', 'Jane')
    /// @ts-ignore
    expect(element.name).to.eq('Jane')
  })

  it('should update the page when [name] property change', () => {
    /// @ts-ignore
    element.name = 'Jane'
    const h1 = element.shadowRoot.querySelector('h1')
    expect(h1.innerHTML.trim()).to.eq('Hello Jane')
  })

})