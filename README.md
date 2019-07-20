[![npm version](https://badge.fury.io/js/ngx-elements.svg)](https://www.npmjs.com/package/ngx-elements)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# ngx-elements
Wrap and register your Angular Ivy Component as custom element

Installation
------------
  ```
    npm install ngx-elements
  ```

Getting Started
------------
* Install dependencies
  ```
  git clone https://github.com/aelbore/ngx-elements.git
  npm install
  ```
* Test
  ```
  git submodule init
  git submodule update --remote
  
  cd demo/ngx-elements
  npm install

  cd ../../
  npm run link.lib
  npm test
  ```

* Start Demo
  ```
  npm run start.demo
  ```
* Browse to
  ```
  http://localhost:3000
  ```

Usage
-----
* Create `app.component.ts`
  - When you change the value of `<input>` it will trigger the change detection (`detectChanges`) to update the `<h1>` element
  - by default it will trigger the change dectection when any of the properties changed
  - `renderCustomElement` will wrap and register your component into custom element
  - `renderNgComponent` will wrap your component to automatically have change detection
    ```typescript
    import { Component, ViewEncapsulation, Input, Output, EventEmitter } from "@angular/core";
    import { renderCustomElement } from 'ngx-elements'

    @Component({
      selector: "hello-name",
      template: `
        <h1>Hello {{ name }}</h1>
        <input [value]="name" (input)="updateName($event.target.value)" />

        <h2>Count {{ count }}</h2>
        <button (click)="onIncrement($event)">
          Increment
        </button>
      `,
      styles: [`
        h1 {
          color: var(--h1-color, blue)
        }
      `],
      encapsulation: ViewEncapsulation.ShadowDom
    })
    export class HelloNameComponent {
      
      @Input() name: string = "World";
      @Input() count: number = 0;

      @Output() increment = new EventEmitter()

      onIncrement(evt: any) {
        this.count = this.count + 1
        this.increment.emit(this.count)
      }

      updateName(newName: string) {
        this.name = newName
      }

    }

    renderCustomElement(HelloNameComponent)
    ```




