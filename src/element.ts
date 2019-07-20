import { ɵcompileComponent as compileComponent, Type, Component } from '@angular/core'

export interface NgxElementMetadata extends Component {
  directives?: Type<any>[];
  pipes?: Type<any>[]
}

export function NgxElement(metadata: NgxElementMetadata) {
  return (component) => {
    component.deps = {
      directives: metadata.directives,
      pipes: metadata.pipes
    }
    compileComponent(component, metadata)
    return component
  }
}