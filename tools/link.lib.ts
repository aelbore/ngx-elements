import * as fs from 'fs'
import * as path from 'path'

import { execSync } from 'child_process'
import { clean, mkdirp, globFiles, copyFile } from 'aria-build'

(async function() {
  const NODE_MODULES_PATH = path.resolve(path.join('demo', 'ngx-elements-cli', 'node_modules'))
  if (fs.existsSync(NODE_MODULES_PATH)) {
    const NGX_ELEMENTS_PATH = path.join(NODE_MODULES_PATH, 'ngx-elements')
    const LIB_SOURCE = path.join('dist', '**/*')

    await clean(NGX_ELEMENTS_PATH)

    mkdirp(NGX_ELEMENTS_PATH)

    const files = await globFiles(path.resolve(LIB_SOURCE))
    await Promise.all(files.map(file => {
      const dest = file.replace(path.resolve() + path.sep + 'dist', NGX_ELEMENTS_PATH)
      mkdirp(path.dirname(dest))
      return copyFile(file, dest)
    }))
  }

  await clean('./demo/ngx-elements-cli/dist')
  
  execSync('npm run build --prefix ./demo/ngx-elements-cli')
})()