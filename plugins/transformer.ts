import * as ts from 'typescript';

function getText(identifier: ts.Identifier) {
  return identifier.hasOwnProperty('escapedText')
    ? identifier.escapedText.toString()
    : identifier.text
}

function getInputs(content: string, fileName: string) {
  const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.ESNext)

  const statement = sourceFile.statements.find(statement => {
    return ts.isExpressionStatement(statement)
      && ts.isBinaryExpression(statement.expression)
      && getText((statement.expression.left as ts.PropertyAccessExpression)
          .name as ts.Identifier)
          .includes('ɵcmp')
  }) as ts.ExpressionStatement

 const args = ((statement.expression as ts.BinaryExpression)
    .right as ts.CallExpression)
    .arguments[0] as ts.ObjectLiteralExpression

 const property = (args.properties
  .find(property => getText(property.name as ts.Identifier)
        .includes('inputs')) as ts.PropertyAssignment)

  return property 
    ? (property.initializer as ts.ObjectLiteralExpression)
        .properties.map(property => getText(property.name as ts.Identifier))
    : []
}

function updateImportDeclaration(node: ts.ImportDeclaration) {
  const namedBindings = node.importClause.namedBindings as ts.NamedImports
  const elements = (namedBindings.elements ?? []) as ts.ImportSpecifier[]

  namedBindings.elements = ts.createNodeArray([
    ...elements,
    ts.createImportSpecifier(
      ts.createIdentifier('ɵdetectChanges'), 
      ts.createIdentifier('ɵdetectChanges'),
    )
  ])

  node.importClause = ts.updateImportClause(
    node.importClause, 
    node.importClause.name, 
    namedBindings,
    false)

  return ts.updateImportDeclaration(node, 
    node.decorators, 
    node.modifiers, 
    node.importClause, 
    node.moduleSpecifier
  )  
}

function transformer(inputs: string[]) {
  return (context: ts.TransformationContext) => { 
    const visitor = (node: ts.Node) => { 
      if (inputs.length > 0 && ts.isImportDeclaration(node) 
        && getText(node.moduleSpecifier as ts.Identifier)
            .includes('@angular/core')) 
        return updateImportDeclaration(node)

      if (inputs.length > 0 && ts.isClassDeclaration(node)) {
        const props = inputs.map(text => {
          const getProp = ts.createGetAccessor(null, 
            undefined, 
            ts.createIdentifier(text), 
            [],
            undefined,
            ts.createBlock([
              ts.createReturn(
                ts.createPropertyAccess(ts.createThis(), ts.createIdentifier(`_${text}`))
              )
            ], 
            true)
          )

          const setProp = ts.createSetAccessor(
            undefined,
            undefined,
            ts.createIdentifier(text),
            [ 
              ts.createParameter(undefined, 
                undefined, 
                undefined, 
                ts.createIdentifier('value'), 
                undefined, 
                undefined, 
                undefined)
            ],
            ts.createBlock([
              ts.createExpressionStatement(
                ts.createBinary(
                  ts.createPropertyAccess(ts.createThis(), ts.createIdentifier(`_${text}`)),
                  ts.SyntaxKind.EqualsToken,
                  ts.createIdentifier('value')
                )
              ),
              ts.createExpressionStatement(
                ts.createCall(
                  ts.createIdentifier('ɵdetectChanges'),
                  undefined,
                  [ ts.createThis() ]
                )
              )
            ])
          )

          return [ getProp, setProp ]
        })

        node.members = ts.createNodeArray([ 
          ...props.reduce((acc, val) => acc.concat(val), []), 
          ...node.members
        ])
      }
      return ts.visitEachChild(node, (child) => visitor(child), context)
    }
    return visitor
  }
}

function transpile(code: string, tsOptions?: TSConfigOptions) {
  const { outputText, sourceMapText } = ts.transpileModule(code, {
    compilerOptions: { 
      module: ts.ModuleKind.ESNext, 
      target: ts.ScriptTarget.ES2018,
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

export interface TSConfigOptions {
  compilerOptions?: ts.CompilerOptions
  transformers?: ts.CustomTransformers
}

export function ngxTransform(options?: TSConfigOptions) {
  return {
    name: 'ngx-transform',
    transform(code: string, id: string) {
      if (!id.includes('node_modules')) {
        return transpile(code, {
          transformers: {
            before: [ transformer(getInputs(code, id)) ]
          }
        })
      }
    }
  }
}