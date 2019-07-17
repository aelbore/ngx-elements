import { ɵrenderComponent as renderComponent, ViewEncapsulation, Type, Injector } from "@angular/core";
import { initEvents, initProps, autoChangeDetection } from './utils'

declare const HTMLElement: any;

export function renderNgComponent<T>(componentType: Type<T>, opts?: any) {
  const props = new Map()
  const component = renderComponent(componentType, opts)
    /// @ts-ignore
  autoChangeDetection(component, componentType.ngComponentDef.inputs, props)
}

export function renderCustomElement<T>(componentType: Type<T>, injector?: Injector) {
  /// @ts-ignore
  const { inputs, styles, encapsulation, outputs, selectors, onPush } = componentType.ngComponentDef

  class CustomElement extends HTMLElement {
    private rootElement: HTMLElement | ShadowRoot;
    private component: T
    
    private props = new Map()

    constructor() {
      super();
      
      this.rootElement = (encapsulation === ViewEncapsulation.ShadowDom)
         ? this.attachShadow({ mode: "open" }) : this;

      this.component = renderComponent(componentType, { 
        host: this.rootElement as any,  
        ...(injector ? { injector }: {})
      });

      if (!onPush) {
        autoChangeDetection(this.component, inputs, this.props)
      }

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

  customElements.define(selectors[0][0], CustomElement)

}