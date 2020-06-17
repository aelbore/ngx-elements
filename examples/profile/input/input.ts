import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewEncapsulation
} from '@angular/core'

export interface InputEvent extends Event {
  detail: { 
    value: string 
  }
}

@Component({
  selector: 'ar-input',
  templateUrl: './input.html',
  styleUrls: [ './input.css' ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class InputComponent { 

  @Input() value: string = ''

  @Input() placeholder: string = 'Search'
  @Input() disabled: boolean = false

  @Output('blur') onInputBlur = new EventEmitter()
  @Output('focus') onInputFocus= new EventEmitter()
  @Output('change') onInputChange = new EventEmitter()

  inputBlur(evt: any) {
    this.value = evt.target.value
    this.onInputBlur.emit({ value: this.value })
  }

  inputFocus(evt: any) {
    this.onInputFocus.emit({ value: evt.target.value })
  }

  inputChange(evt: any) {
    this.onInputChange.emit({ value: evt.target.value })
  }

}