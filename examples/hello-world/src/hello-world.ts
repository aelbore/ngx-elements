import { Component, ViewEncapsulation, Input } from '@angular/core'

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