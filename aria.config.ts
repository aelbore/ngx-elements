
import { mkdir, copyFiles, clean, exist, lstat, unlinkDir } from 'aria-build'

const outputPath = './node_modules/ngx-elements'

export default {
  plugins: [
    {
      name: 'clean',
      buildStart: async () => {
        if (await exist(outputPath)) {
          const stat = await lstat(outputPath)
          stat.isSymbolicLink() && unlinkDir(outputPath)
        }
        await clean(outputPath)
      }
    },
    {
      name: 'copy',
      writeBundle: async () => {
        await mkdir(outputPath, { recursive: true })
        await copyFiles('./dist/*', outputPath)
      }
    }
  ]
}