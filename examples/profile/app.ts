import { Component, ViewEncapsulation, OnInit, ɵdetectChanges as detectChanges } from '@angular/core'
import { NgForOf, AsyncPipe } from '@angular/common'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { of, Observable } from 'rxjs'

import { renderCustomElement } from 'ngx-elements'

import { Card, Profile } from './card/card'
import { InputComponent, InputEvent } from './input/input'

@Component({
  selector: 'ar-profile',
  templateUrl: './app.html',
  styleUrls: [ './app.css' ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class App implements OnInit { 

  profiles: Observable<Profile[]>

  values: Profile[] = [
    {
      name: "Jane Doe",
      profession: "Framework Developer",
      motto: "I never wanted to be famous, I wanted to be great.",
      photo: "default.png"
    },
    {
      name: "Kurtis Weissnat",
      profession: "Developer",
      motto: "When in doubt, iterate faster!",
      photo: "default.png"
    },
    {
      name: "Chelsey Dietrich",
      profession: "UX Developer",
      motto: "Genius is the ability to reduce the complicated to the simple.",
      photo: "default.png"
    },
    {
      name: "Leanne Graham",
      profession: "UI Developer",
      motto: "The key to performance is elegance, not battalions of special cases.",
      photo: "default.png"
    }
  ]

  ngOnInit() {
    this.profiles = of(this.values)
  }

  change(e: InputEvent) {
    of(e.detail.value.toLowerCase())
    .pipe(debounceTime(700), distinctUntilChanged())
    .subscribe(text => {
      this.profiles = of([
        ...this.values.filter(value => value.name.toLowerCase().includes(text))
      ])
      detectChanges(this)
    })
  }

}

renderCustomElement(App, { 
  directives: [ NgForOf, InputComponent, Card ],
  pipes: [ AsyncPipe ]
})