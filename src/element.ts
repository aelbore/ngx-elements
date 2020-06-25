import { Type, ɵComponentDef, ViewEncapsulation, ɵrenderComponent } from '@angular/core'

import { SchemaResult, schema } from './schema'
import { ComponentOptions } from './options'
import { renderNgComponent } from './render-ngcomponent'

export class NgxElement<T> extends HTMLElement  {
  schema: SchemaResult
  component: T

  constructor(type: Type<T>, options?: ComponentOptions) {
    super()
    
    const { id, encapsulation } = type['ɵcmp'] as ɵComponentDef<T>
    this.schema = schema.get(id) as SchemaResult

    const host = (encapsulation === ViewEncapsulation.ShadowDom)
        ? this.attachShadow({ mode: 'open' })
        : this;

    (host as any).adoptedStyleSheets = [  schema.get(id).style  ]
    this.component = renderNgComponent(type, {  ...(options ?? {}), host })
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (this.schema.attrs.includes(name)) {
      this[name] = newValue
    }      
  }

}

export class NgElement<T> extends HTMLElement {
  component: T

  constructor(type: Type<T>) {
    super()
  
    const { styles } = type['ɵcmp']
    const style: any = new CSSStyleSheet()
    style.replace(styles.join('\n'))

    const host: any = this.attachShadow({ mode: 'open' })
    host.adoptedStyleSheets = [ style ]

    this.component = ɵrenderComponent(type, { host })
  }

}
