import * as ts from 'typescript'
import { createCustomElement } from './element'
import { TSConfigOptions, transpile } from './transpile'
import { SchemaOptions, createCustomElementDefineAndNgElementImport } from './statements'
import { createNgProps } from './ng-props'

function getText(identifier: ts.Identifier) {
  return identifier.hasOwnProperty('escapedText')
    ? identifier.escapedText.toString()
    : identifier.text
}

function getSchema(content: string, fileName: string) {
  const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.ESNext)

  const ngxElements = sourceFile.statements.find(statement => {
    return ts.isImportDeclaration(statement)
      && getText(statement.moduleSpecifier as ts.Identifier).includes('ngx-elements')
  })

  const className = sourceFile.statements.find(statement => {
    return ts.isClassDeclaration(statement)
  })

  const name = className 
    ? getText((className as ts.ClassDeclaration).name)
    : ''

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

 const selectors = (args.properties
  .find(property => getText(property.name as ts.Identifier)
        .includes('selectors')) as ts.PropertyAssignment)

  const selector = selectors 
    ? getText(((selectors.initializer as ts.ArrayLiteralExpression) 
        .elements[0] as ts.ArrayLiteralExpression)
        .elements[0] as ts.Identifier)
    : ''

  const inputs = property 
    ? (property.initializer as ts.ObjectLiteralExpression)
        .properties.map(property => getText(property.name as ts.Identifier))
    : []
  
  return {
    hasNgxElementsImport: ngxElements ? true: false,
    inputs,
    selector,
    name
  }
}

function updateImportDeclaration(node: ts.ImportDeclaration) {
  const namedBindings = node.importClause.namedBindings as ts.NamedImports
  const elements = (namedBindings.elements ?? []) as ts.ImportSpecifier[]

  namedBindings.elements = ts.createNodeArray([
    ...elements,
    ts.createImportSpecifier(
      void 0, 
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

function transformer(options: SchemaOptions) {
  const { inputs } = options
  return (context: ts.TransformationContext) => { 
    const visitor = (node: ts.Node) => { 
      if (inputs.length > 0 && ts.isImportDeclaration(node) 
        && getText(node.moduleSpecifier as ts.Identifier)
            .includes('@angular/core')) 
        return updateImportDeclaration(node)

      if (inputs.length > 0 && ts.isClassDeclaration(node)) {
        node.members = ts.createNodeArray([ 
          ...createNgProps(inputs).reduce((acc, val) => acc.concat(val), []), 
          ...node.members,
          createCustomElement(getText(node.name), inputs)
        ])
      }
      return ts.visitEachChild(node, (child) => visitor(child), context)
    }
    return visitor
  }
}

export function ngxTransform(options?: TSConfigOptions) {
  return {
    name: 'ngx-transform',
    transform(code: string, id: string) {
      if (!id.includes('node_modules')) {
        const { selector, inputs, name } = getSchema(code, id)
        return transpile(code, {
          transformers: {
            before: [ 
              transformer({ inputs }),
              createCustomElementDefineAndNgElementImport({ selector, name })
            ]
          }
        })
      }
    }
  }
}