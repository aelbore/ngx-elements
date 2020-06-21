import { ɵdetectChanges as detectChanges } from '@angular/core'

export function autoChangeDetection<T>(component: T, 
  props: Map<string, any>, 
  attrs: string[]
) {
  attrs.forEach(key => {
    props.set(key, component[key])
    Object.defineProperty(component, key, {
      get() {
        return props.get(key)
      },
      set(value) {
        props.set(key, value)
        detectChanges(component)
      }
    })
  })
  return component
}