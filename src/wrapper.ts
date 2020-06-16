import { ɵrenderComponent as renderComponent, ViewEncapsulation, Type, ɵComponentDef } from '@angular/core'
import { initEvents, initProps, autoChangeDetection, ComponentOptions } from './utils'
import { updateComponentDef } from './component-deps'

function renderComponentDirective(types: Type<any>[], options: ComponentOptions) {
  const directives = options.directives.filter(t => t['ɵdir'])
  const components = options.directives.filter(t => t['ɵcmp'])
  components.forEach(type => {
    renderCustomElement(type, { ...options, directives })
  })
}

export function renderNgComponent<T>(componentType: Type<T>, options?: ComponentOptions) {
  const props = new Map()
  const def = updateComponentDef(componentType, options)

  const component = renderComponent(componentType, { ...(options ?? {}), rendererFactory: null  })
  return autoChangeDetection(component, def.inputs, props)
}

export function createCustomElement<T>(componentType: Type<T>,  options?: ComponentOptions) {
  const { inputs, styles, encapsulation, outputs } = componentType['ɵcmp'] as ɵComponentDef<T>

  options?.directives 
    && renderComponentDirective(options.directives, options)

  return class CustomElement extends HTMLElement {
    rootElement: HTMLElement | ShadowRoot
    component: T

    constructor() {
      super()
      
      this.rootElement = (encapsulation === ViewEncapsulation.ShadowDom)
          ? this.attachShadow({ mode: "open" }): this

      this.component = renderNgComponent(componentType, { 
        ...(options ?? {}), 
        host: this.rootElement  
      })

      initProps(this, inputs, this.component)
      initEvents(this, outputs, this.component)
    }

    static get observedAttributes() {
      return [...Object.keys(inputs)];
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
      const attributes = Object.keys(inputs)
      if (attributes.includes(name)) {
        this[name] = newValue
      }      
    }

    connectedCallback() {
      const cssStyles = styles.join('\n')
      if (cssStyles) {
        const style = document.createElement('style')
        style.textContent = cssStyles
        this.rootElement.prepend(style)
      }      
    }
  }

}

export function renderCustomElement<T>(componentType: Type<T>, options?: ComponentOptions) {
  customElements.define(
    componentType['ɵcmp'].selectors[0][0], 
    createCustomElement(componentType, options) 
  )
}