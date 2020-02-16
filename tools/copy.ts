import * as fs from 'fs'
import * as path from 'path'

import { copyFiles, clean } from 'aria-build'

(async function() {
  const destPath = './demo/ngx-elements/node_modules/ngx-elements'
  if (fs.existsSync(path.dirname(destPath))) {
    await clean(destPath)
    await copyFiles('./dist/**/*', './demo/ngx-elements/node_modules/ngx-elements')
  }
})()