import { Type, ɵComponentDef as ComponentDef } from '@angular/core'
import { KeyValue, ComponentOptions } from './options'

function createStyle(styles: string[]) {
  const style = new CSSStyleSheet()
  /// @ts-ignore
  style.replaceSync(styles.join('\n'))
  return style
}

export interface SchemaResult {
  attrs: string[]
  events: string[]
  outputs: KeyValue
  props: Map<string, any>
  style: CSSStyleSheet
  directives?: Type<any>[]
  pipes?: Type<any>[]
  components?: Type<any>[]
}

export function createSchema<T>(component: Type<T>, 
  options?: ComponentOptions
): SchemaResult {
  const { inputs, styles, outputs } = component['ɵcmp'] as ComponentDef<T>
  
  const directives = options?.directives ? options.directives.filter(t => t['ɵdir']): []
  const components = options?.directives ? options.directives.filter(t => t['ɵcmp']): []
  const pipes = options?.pipes ? options.pipes: []

  const attrs = Object.keys(inputs)
  const events = Object.keys(outputs)
  const style = createStyle(styles)

  const props = new Map()
  attrs.forEach(attr => props.set(attr, component[attr]))
  
  return { attrs, events, props, style, directives, components, pipes, outputs }
}

export const schema = new Map()