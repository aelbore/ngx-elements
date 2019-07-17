import { bundle, clean, TSRollupConfig } from 'aria-build'

(async function(){

  const external = [
    '@angular/core'
  ]

  const options: TSRollupConfig[] = [
    {
      input: './src/index.ts',
      external,
      output: {
        file: './dist/ngx-elements.es.js',
        format: 'es'
      },
      tsconfig: {
        compilerOptions: {
          declaration: true
        }
      }
    }, 
    {
      input: './src/index.ts',
      external,
      output: {
        file: './dist/ngx-elements.js',
        format: 'cjs'
      }
    }
  ]

  await clean('dist')
  await bundle(options)
})()