import { ɵrenderComponent as renderComponent, ViewEncapsulation, Type, Injector, ɵComponentDef } from '@angular/core';
import { initEvents, initProps, autoChangeDetection, updateComponentDef } from './utils'

declare const HTMLElement: any;

export function renderNgComponent<T>(componentType: Type<T>, opts?: any) {
  const props = new Map()
  const def = updateComponentDef(componentType)

  const component = renderComponent(componentType, opts)
  return autoChangeDetection(component, def.inputs, props)
}

export function createCustomElement<T>(componentType: Type<T>, injector?: Injector) {
  const { inputs, styles, encapsulation, outputs } = componentType['ɵcmp'] as ɵComponentDef<T>

  return class CustomElement extends HTMLElement {
    rootElement: HTMLElement | ShadowRoot;
    component: T

    constructor() {
      super();
      
      this.rootElement = (encapsulation === ViewEncapsulation.ShadowDom)
          ? this.attachShadow({ mode: "open" }) : this;

      this.component = renderNgComponent(componentType, { 
        host: this.rootElement as any,  
        ...(injector ? { injector }: {})
      });

      initProps(this, inputs, this.component)
      initEvents(this, outputs, this.component)
    }

    static get observedAttributes() {
      return [...Object.keys(inputs)];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      const attributes = Object.keys(inputs)
      if (attributes.includes(name)) {
        this[name] = newValue;
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

export function renderCustomElement<T>(componentType: Type<T>, injector?: Injector) {
  customElements.define(
    componentType['ɵcmp'].selectors[0][0], 
    createCustomElement(componentType, injector)
  )
}