import { Component, ViewEncapsulation, Input } from '@angular/core'

export interface Profile {
  name: string
  profession: string
  motto: string
  photo: string
}

@Component({
  selector: 'ar-card',
  templateUrl: './card.html',
  styleUrls: [ './card.css' ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Card { 
  
  @Input() profile: Profile

}