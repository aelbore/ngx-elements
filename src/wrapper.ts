import { ɵrenderComponent as renderComponent, ViewEncapsulation, Type } from "@angular/core";
import { initEvents, initProps } from './utils'

declare const HTMLElement: any;

export function renderCustomElement<T>(componentType: Type<T>) {
  /// @ts-ignore
  const { inputs, styles, encapsulation, outputs } = componentType.ngComponentDef

  return class extends HTMLElement {
    rootElement: HTMLElement | ShadowRoot;
    component: T

    constructor() {
      super();
      
      this.rootElement = (encapsulation === ViewEncapsulation.ShadowDom)
         ? this.attachShadow({ mode: "open" }) : this;
      this.component = renderComponent(componentType, { host: this.rootElement as any });

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
      if (styles) {
        const style = document.createElement('style')
        style.textContent = styles.join('\n')
        this.rootElement.prepend(style)
      }      
    }
  }

}