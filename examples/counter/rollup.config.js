import resolve from '@rollup/plugin-node-resolve'
import { ngcPlugin } from 'rollup-plugin-ngc'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './examples/counter/counter.ts',
  plugins: [
    ngcPlugin({
      rootDir: './examples/counter'
    }),
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
    })
  ],
  output: {
    format: 'es',
    file: './public/counter/counter.js',
    sourcemap: true
  }
}