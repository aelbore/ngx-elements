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
    plugins: [
      /// @ts-ignore
      ngcPlugin({
        rootDir: './example/hello-world',
        target: 'es2020'
      }),
      ngxTransform(),
      resolve(),
      terser({
        safari10: true,
        output: {
          ascii_only: true,
          comments: false,
          webkit: true,
        },
        compress: {
          pure_getters: true,
          passes: 3,
          global_defs: {
            ngDevMode: false,
          },
        }
      }),
      filesize(),
      {
        name: 'copy',
        buildEnd: async () => {
          await mkdir('./public/hello-world', { recursive: true })
          await copyFile(
            './examples/hello-world/index.html', 
            './public/hello-world/index.html'
          )
        }
      }
    ]
  })

  await bundle.write({
    format: 'es',
    file: './public/hello-world/hello-world.js',
    sourcemap: true
  })

})()