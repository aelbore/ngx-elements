import { Type, ɵdetectChanges as detectChanges, Injector } from '@angular/core'

export interface ComponentOptions { 
  host?: any
  injector?: Injector
  directives?: Type<any>[]
  pipes?: Type<any>[]
}

export interface KeyValue {
  [key: string ]: any
}

export function autoChangeDetection<T>(component: T, inputs: KeyValue, props: Map<string, string>) {
  const keys = Object.keys(inputs)
  keys.forEach(key => {
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

export function initProps<T>(target: HTMLElement | any, inputs: KeyValue, component: T) {
  const keys = Object.keys(inputs)
  keys.forEach(key => {
    Object.defineProperty(target, key, {
      get() { 
        return component[key]; 
      },
      set(value) {
        component[key] = value;
      }
    })
  })
}

export function initEvents<T>(target: HTMLElement | any, outputs: KeyValue, component: T) {
  const outputEvents = Object.keys(outputs)
  outputEvents.forEach(outputEvent => {
    component[outputs[outputEvent]].subscribe(info => {
      target.dispatchEvent(new CustomEvent(outputEvent, { detail: info }))
    })
  })
}