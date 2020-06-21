import { Type, ɵComponentDef } from '@angular/core'

import { initEvents, initProps } from './utils'
import { createSchema, schema } from './schema'
import { ComponentOptions } from './options'
import { NgxElement } from './element'

export function createCustomElement<T>(componentType: Type<T>,  options?: ComponentOptions) {
  const type = componentType['ɵcmp'] as ɵComponentDef<T>

  const schemaResult = createSchema(componentType, options)
  const { components, directives, attrs } = schemaResult

  options?.directives 
    && components.forEach(type => 
        renderCustomElement(type, { ...options, directives }))

  schema.set(type.id, schemaResult)

  return class CustomElement extends NgxElement<T> {
    constructor() {
      super(componentType, options)

      initProps(this)
      initEvents(this)
    }

    static get observedAttributes() {
      return [ ...attrs ]
    }
  }
}

export function renderCustomElement<T>(componentType: Type<T>, options?: ComponentOptions) {
  customElements.define(
    componentType['ɵcmp'].selectors[0][0], 
    createCustomElement(componentType, options) 
  )
}