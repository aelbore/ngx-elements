import resolve from '@rollup/plugin-node-resolve'
import { ngcPlugin } from 'rollup-plugin-ngc'
import { terser } from 'rollup-plugin-terser'
import { copyFile, mkdir } from 'aria-build'

import { rollup } from 'rollup'
import { ngxTransform } from '../plugins/transformer'

(async function() {
  const filesize = require('rollup-plugin-filesize')

  const bundle = await rollup({
    treeshake: true,
    input: './examples/hello-world/src/hello-world.ts',
    external: [ '@angular/compiler', '@angular/compiler-cli', '@angular/core', 'rxjs' ],
    plugins: [
      /// @ts-ignore
      ngcPlugin({
        rootDir: './example/hello-world',
        target: 'es2020'
      }),
      ngxTransform(),
      filesize()
    ]
  })

  await bundle.write({
    format: 'es',
    file: './public/hello-world/hello-world.js',
    sourcemap: true
  })

})()