import { Component, ViewEncapsulation } from '@angular/core'
import { NgForOf } from '@angular/common'
import { renderCustomElement } from 'ngx-elements'

import { Card, Profile } from './card/card'

@Component({
  selector: 'ar-profile',
  templateUrl: './app.html',
  styleUrls: [ './app.css' ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class App { 

  profiles: Profile[] = [
    {
      name: "Jane Doe",
      profession: "Framework Developer",
      motto: "I never wanted to be famous, I wanted to be great.",
      photo: "https://pymwoqn637.codesandbox.io/default.png"
    },
    {
      name: "Kurtis Weissnat",
      profession: "Developer",
      motto: "When in doubt, iterate faster!",
      photo: "https://pymwoqn637.codesandbox.io/default.png"
    },
    {
      name: "Chelsey Dietrich",
      profession: "UX Developer",
      motto: "Genius is the ability to reduce the complicated to the simple.",
      photo: "https://pymwoqn637.codesandbox.io/default.png"
    },
    {
      name: "Leanne Graham",
      profession: "UI Developer",
      motto: "The key to performance is elegance, not battalions of special cases.",
      photo: "https://pymwoqn637.codesandbox.io/default.png"
    }
  ]

}

renderCustomElement(App, { 
  directives: [ NgForOf, Card ] 
})