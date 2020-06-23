import resolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'

import { ngcPlugin } from 'rollup-plugin-ngc'
import { terser } from 'rollup-plugin-terser'
import { copyFile, mkdir } from 'aria-build'

export default {
  input: './examples/hello-world/src/hello-world.ts',
  manualChunks(id) {
    if (id.includes('node_modules')) {
      return 'vendor';
    }
  },
  plugins: [
    ngcPlugin({
      rootDir: './example/hello-world',
      target: 'es2020'
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
  ],
  output: {
    format: 'es',
    file: './public/hello-world/hello-world.js',
    sourcemap: true
  }
}