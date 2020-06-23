import { Component, ViewEncapsulation, Input } from '@angular/core'
import { renderCustomElement } from 'ngx-elements'

@Component({
  selector: 'hello-world',
  templateUrl: './hello-world.html',
  styleUrls: [ './hello-world.css' ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HelloWorld  {
  @Input() name: string

  updateName(newName: string) {
    this.name = newName
  }

}

renderCustomElement(HelloWorld)