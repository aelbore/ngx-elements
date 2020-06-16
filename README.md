[![npm version](https://badge.fury.io/js/ngx-elements.svg)](https://www.npmjs.com/package/ngx-elements)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# ngx-elements
Wrap and register your Angular Ivy Component as custom element

Getting Started
------------
* Install dependencies
  ```
  git clone https://github.com/aelbore/ngx-elements.git
  cd ngx-elements
  npm install
  ```

Installation
------------
  ```
    npm install ngx-elements
  ```

Example
------------
* `npm run ngcc` - compile all `@angular/*` libraries into ivy compatible
* `npm run build` - build `ngx-elements`
* `npm run build:profile` - build the example code
* `npm run serve` - run into browser `http://localhost:5000/hello-world`

API
-----
* `renderCustomElement` - wrap and register your component into custom element (web components)
* `renderNgComponent` - wrap your component to automatically have change detection

Usage
-----
* Create `hello-world.ts`
  - When you change the value of `<input>` it will trigger the change detection (`detectChanges`) to update the `<h1>` element
  - by default it will trigger the change dectection when any of the properties changed
    ```typescript
    import { Component, ViewEncapsulation, Input, Output, EventEmitter } from "@angular/core";
    import { renderCustomElement } from 'ngx-elements'

    @Component({
      selector: "hello-world",
      template: `
        <h1>Hello {{ name }}</h1>
        <input [value]="name" (input)="updateName($event.target.value)" />
      `,
      styles: [`
        h1 { color: var(--h1-color, blue) }
      `],
      encapsulation: ViewEncapsulation.ShadowDom
    })
    export class HelloWorldComponent {
      
      @Input() name: string = "World"

      updateName(newName: string) {
        this.name = newName
      }

    }

    renderCustomElement(HelloNameComponent)
    ```




