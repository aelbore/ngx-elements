import { Component, ViewEncapsulation, OnInit, ɵdetectChanges as detectChanges } from '@angular/core'
import { NgForOf, AsyncPipe } from '@angular/common'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { of, Observable } from 'rxjs'

import { renderCustomElement } from 'ngx-elements'

import { Card, Profile } from './card/card'
import { InputComponent, InputEvent } from './input/input'
import { AppService } from './app.service'

@Component({
  selector: 'ar-profile',
  template: `
    <div id="app">
      <ar-input (change)="change($event)" placeholder="Select"></ar-input>
      <div class="cards">
        <ar-card 
          *ngFor="let profile of profiles | async" 
          [profile]="profile">
        </ar-card>
      </div>
    </div>
  `,
  styleUrls: [ './app.css' ],
  providers: [ AppService ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class App implements OnInit { 
  profiles: Observable<Profile[]>

  constructor(private service: AppService) { }

  ngOnInit() {
    this.profiles = this.service.getProfiles()
  }

  change(e: InputEvent) {
    of(e.detail.value)
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe(text => {
        this.profiles = this.service.getProfilesByName(text)
        detectChanges(this)
      })
  }
}

renderCustomElement(App, { 
  directives: [ NgForOf, InputComponent, Card ],
  pipes: [ AsyncPipe ]
})