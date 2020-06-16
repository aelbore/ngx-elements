import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core'
import { renderCustomElement } from 'ngx-elements'

@Component({
  selector: 'ng-counter',
  templateUrl: './counter.html',
  styleUrls: [ './counter.css' ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Counter implements OnInit { 

  @Input() count: string

  ngOnInit() {
    this.count = "0"
  }

  increment(evt: any) {
    this.count = (parseInt(this.count) + 1).toString()
  }

}

renderCustomElement(Counter)