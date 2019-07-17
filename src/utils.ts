import { ɵdetectChanges as detectChanges } from "@angular/core";

export interface KeyValue {
  [key: string ]: any
}

export function initProps<T>(target: HTMLElement | any, inputs: KeyValue, component: T) {
  const keys = Object.keys(inputs)
  keys.forEach(key => {
    Object.defineProperty(target, key, {
      get() { component[key]; },
      set(value) {
        component[key] = value;
        detectChanges(component);
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