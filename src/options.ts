import { Injector, Type } from '@angular/core'

export interface ComponentOptions { 
  host?: any
  injector?: Injector
  directives?: Type<any>[]
  pipes?: Type<any>[]
  changeDetection?: boolean
}

export interface KeyValue {
  [key: string ]: any
}
