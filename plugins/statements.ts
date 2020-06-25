import * as ts from "typescript"

const createDefine = (selector: string, name: string) => {
  return ts.createExpressionStatement(
    ts.createCall(
      ts.createPropertyAccess(
        ts.createIdentifier('customElements'), 
        ts.createIdentifier('define')
      ),
      undefined,
      [
        ts.createStringLiteral(selector),
        ts.createCall(
          ts.createPropertyAccess(
            ts.createIdentifier(name),
            ts.createIdentifier('createElement')
          ),
          undefined,
          [])
      ]
    )
  )
}

const createNgxElementImport = () => {
  return ts.createImportDeclaration(
    undefined, 
    undefined,
    ts.createImportClause(
      void 0, 
      ts.createNamedImports(ts.createNodeArray([
        ts.createImportSpecifier(void 0, ts.createIdentifier('NgElement'))
      ]))
    ),
    ts.createStringLiteral('ngx-elements'))    
}

export interface SchemaOptions {
  inputs?: string[]
  hasNgxElementsImport?: boolean
  selector?: string
  name?: string
}

export const createCustomElementDefineAndNgElementImport = (options: SchemaOptions) => {
  let isToAdd = false
  const { selector, name } = options
  return (context: ts.TransformationContext) => {
    const visitor = (node: any) => {
      if (Array.isArray(node.statements) && (!isToAdd)) {
        isToAdd = true
        node.statements = ts.createNodeArray([
          createNgxElementImport(),
          ...node.statements,
          createDefine(selector, name)
        ])
      }
      return ts.visitEachChild(node, (child) => visitor(child), context)
    }
    return visitor
  }
}