import { Type, ɵrenderComponent, ɵComponentDef, ɵDirectiveDef, ɵPipeDef  } from '@angular/core'

import { autoChangeDetection } from './change-detection'
import { ComponentOptions } from './options'
import { schema, SchemaResult } from './schema'

export function renderNgComponent<T>(componentType: Type<T>, options?: ComponentOptions) {
  const type = componentType['ɵcmp'] as ɵComponentDef<T>
  const { directives, pipes, props, attrs } = schema.get(type.id) as SchemaResult

  type.directiveDefs = directives.map(d => d['ɵdir'] as ɵDirectiveDef<T>)
  type.pipeDefs = pipes.map(p => p['ɵpipe'] as ɵPipeDef<T>)

  const component = ɵrenderComponent(componentType, { 
    ...(options ?? {}), 
    rendererFactory: null  
  })

  return autoChangeDetection(component, props, attrs)
}