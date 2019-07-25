import { ɵrenderComponent as renderComponent, ViewEncapsulation, Type, Injector, ɵComponentDef } from '@angular/core';
import { initEvents, initProps, autoChangeDetection, updateComponentDef, addStyle } from './utils'

declare const HTMLElement: any;

export function renderNgComponent<T>(componentType: Type<T>, opts?: any) {
  const props = new Map()
  const def = updateComponentDef(componentType)

  const component = renderComponent(componentType, opts)
  const host = (opts && opts.host) 
    ? opts.host
    : document.querySelector(def.selectors[0][0].toString())

  const cssStyles = def.styles.join('\n')
  addStyle(cssStyles, host)

  return autoChangeDetection(component, def.inputs, props)
}

export function createCustomElement<T>(componentType: Type<T>, injector?: Injector) {
  const { inputs, encapsulation, outputs } = componentType['ngComponentDef'] as ɵComponentDef<T>

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

  }

}

export function renderCustomElement<T>(componentType: Type<T>, injector?: Injector) {
  customElements.define(
    componentType['ngComponentDef'].selectors[0][0], 
    createCustomElement(componentType, injector)
  )
}