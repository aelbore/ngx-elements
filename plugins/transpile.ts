import * as ts from 'typescript'

export interface TSConfigOptions {
  compilerOptions?: ts.CompilerOptions
  transformers?: ts.CustomTransformers
}

export function transpile(code: string, tsOptions?: TSConfigOptions) {
  const { outputText, sourceMapText } = ts.transpileModule(code, {
    compilerOptions: { 
      module: ts.ModuleKind.ESNext, 
      target: ts.ScriptTarget.ESNext,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      strictNullChecks: false,
      sourceMap: true,
      ...(tsOptions?.compilerOptions || {})
    },
    transformers: {
      ...(tsOptions?.transformers || {})
    }
  })
  return { code: outputText, map: sourceMapText }
}