import { NgxElement } from './element'

export function initProps<T>(target: NgxElement<T>) {
  target.schema.attrs.forEach(key => {
    Object.defineProperty(target, key, {
      get() { 
        return target.component[key] 
      },
      set(value) {
        target.component[key] = value
      }
    })
  })
}

export function initEvents<T>(target: NgxElement<T>) {
  const schema = target.schema
  schema.events.forEach(outputEvent => {
    target.component[schema.outputs[outputEvent]].subscribe(info => {
      target.dispatchEvent(new CustomEvent(outputEvent, { detail: info }))
    })
  })
}