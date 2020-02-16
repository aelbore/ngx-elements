import { 
  Type,
  ɵPipeDef as PipeDef,
  ɵDirectiveDef as DirectiveDef,
  ɵdetectChanges as detectChanges,
  ɵComponentDef as ComponentDef
} from "@angular/core";

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

export function getDirectiveDef<T>(t: Type<T>): DirectiveDef<T> {
  if (t['ngDirectiveDef']) {
    return t['ngDirectiveDef'] as DirectiveDef<T>;
  }

  if (t['ɵcmp']) {
    return t['ɵcmp'] as ComponentDef<T>;
  }

  throw new Error('No Angular definition found for ' + t.name);
}

export function getPipeDef<T>(t: Type<T>): PipeDef<T> {
  if (t['ngPipeDef']) {
    return t['ngPipeDef'] as PipeDef<T>;
  }

  throw new Error('No Angular definition found for ' + t.name);
}

export function updateComponentDef<T>(componentType: Type<T>) {
  const def: ComponentDef<T> = componentType['ɵcmp'] as ComponentDef<T>

  const directives = (componentType['deps'] && componentType['deps']['directives'])
    ? componentType['deps']['directives']: null

  const pipes = (componentType['deps'] && componentType['deps']['pipes']) 
    ? componentType['deps']['pipes']: null

  def.directiveDefs = (directives) 
    ? directives.map(directive => (directive as DirectiveDef<T>))
    : null

  def.pipeDefs = (pipes)
    ? pipes.map(pipe => getPipeDef(pipe))
    : null

  return def
}