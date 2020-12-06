import { NgxElement } from './element'

export function initProps<T>(target: NgxElement<T>) {
  const propsFirstChange = {};
  target.schema.attrs.forEach(key => {
    Object.defineProperty(target, key, {
      get() { 
        return target.component[key] 
      },
      set(value) {
        const oldValue =  target.component[key];
        target.component[key] = value;
        if (target.component['ngOnChanges']) {
          target.component['ngOnChanges'].bind(target.component)({
            [key]: {
              previousValue: oldValue,
              currentValue: value,
              first: !propsFirstChange[key]
            }
          });
        }
        propsFirstChange[key] = true;
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