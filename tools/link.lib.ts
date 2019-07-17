import * as fs from 'fs'
import * as path from 'path'

import { execSync } from 'child_process'
import { clean } from 'aria-build'

(async function() {

  // const NODE_MODULES_PATH = path.resolve(path.join('demo', 'ngx-elements', 'node_modules'))
  // if (fs.existsSync(NODE_MODULES_PATH)) {
  //   const LIB_SOURCE = path.resolve('dist')
  //   await symlinkDir(LIB_SOURCE, path.join(NODE_MODULES_PATH, 'ngx-elements'))
  // }

  await Promise.all([ clean('./demo/ngx-elements/.tmp'), clean('./demo/ngx-elements/dist') ])

  execSync('npm run ngc --prefix ./demo/ngx-elements')
  execSync('npm run build --prefix ./demo/ngx-elements')
  
})()