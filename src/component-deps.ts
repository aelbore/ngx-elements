import { Type, ɵPipeDef as PipeDef, ɵDirectiveDef as DirectiveDef, ɵComponentDef as ComponentDef } from '@angular/core'
import { ComponentOptions } from './utils'

function getDirectiveDef<T>(t: Type<T>): DirectiveDef<T> {
  if (t['ɵdir']) {
    return t['ɵdir'] as DirectiveDef<T>;
  }

  if (t['ɵcmp']) {
    return t['ɵcmp'] as ComponentDef<T>;
  }

  throw new Error('No Angular definition found for ' + t.name);
}

function getPipeDef<T>(t: Type<T>): PipeDef<T> {
  if (t['ɵpipe']) {
    return t['ɵpipe'] as PipeDef<T>;
  }

  throw new Error('No Angular definition found for ' + t.name);
}

export function updateComponentDef<T>(componentType: Type<T>, options?: ComponentOptions) {
  const def: ComponentDef<T> = componentType['ɵcmp'] as ComponentDef<T>

  def.directiveDefs = (options?.directives) 
    ? options.directives
        .filter(t => t['ɵdir'])
        .map(directive => getDirectiveDef(directive)): null

  def.pipeDefs = (options?.pipes)
    ? options.pipes.map(pipe => getPipeDef(pipe)): null

  return def
}