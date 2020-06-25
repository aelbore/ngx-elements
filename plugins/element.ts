import * as ts from 'typescript'

const createParameter = (name: string) => {
  return ts.createParameter(
    undefined, 
    undefined, 
    undefined, 
    ts.createIdentifier(name), 
    undefined,
    undefined,
    undefined)
}

const createConstructor = (text: string) => {
  return ts.createConstructor(
    undefined, 
    undefined,
    [],
    ts.createBlock([
      ts.createStatement(
        ts.createCall(
          ts.createSuper(),
          undefined,
          [ ts.createIdentifier(text) ])
      )
    ])
  )
}

const createProps = (inputs: string[]) => {
  return inputs.map(text => {
    const getProp = ts.createGetAccessor(null, 
      undefined, 
      ts.createIdentifier(text), 
      [],
      undefined,
      ts.createBlock([
        ts.createReturn(
          ts.createPropertyAccess(
            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier('component')), 
            ts.createIdentifier(`${text}`)
          )
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
            ts.createPropertyAccess(
              ts.createPropertyAccess(ts.createThis(), ts.createIdentifier('component')),
              ts.createIdentifier(text)
            ),
            ts.SyntaxKind.EqualsToken,
            ts.createIdentifier('value')
          )
        )
      ])
    )            

    return [ getProp, setProp ]
  })
}

const createAttibuteCallback = (inputs: string[]) => {
  const createCaseBlock = (inputs: string[]) => {
    return ts.createCaseBlock(inputs.map(input => 
      ts.createCaseClause(ts.createStringLiteral(input), 
      [  
        ts.createExpressionStatement(
          ts.createBinary(
            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier(input)),
            ts.SyntaxKind.EqualsToken,
            ts.createIdentifier('newValue'))
        ),
        ts.createBreak()
      ])
    ))
  }

  return ts.createMethod(
    undefined, 
    undefined, 
    undefined, 
    ts.createIdentifier('attributeChangedCallback'),
    undefined,
    undefined,
    [
      createParameter('name'),
      createParameter('oldValue'),
      createParameter('newValue')
    ],
    undefined,
    ts.createBlock([
      ts.createSwitch(
        ts.createIdentifier('name'),
        createCaseBlock(inputs)
      )
    ])
  )
}

const createObserveAttribute = (inputs: string[]) => {
  return ts.createGetAccessor(undefined, 
    [ ts.createModifier(ts.SyntaxKind.StaticKeyword) ],
    ts.createIdentifier('observedAttributes'),
    [],
    undefined,
    ts.createBlock([
      ts.createReturn(ts.createArrayLiteral(
        inputs.map(name => ts.createStringLiteral(name))
      ))
    ])
  )
}

export const createCustomElement = (text: string, inputs: string[]) => {
  const ngxElementExtends = ts.createHeritageClause(
    ts.SyntaxKind.ExtendsKeyword,
    [ ts.createExpressionWithTypeArguments([], ts.createIdentifier('NgElement')) ]
  )

  return ts.createMethod(undefined,
    [ ts.createModifier(ts.SyntaxKind.StaticKeyword) ],
    undefined,
    ts.createIdentifier('createElement'),
    undefined,
    undefined,
    undefined,
    undefined,
    ts.createBlock([ 
      ts.createReturn(
        ts.createClassExpression(
          undefined,
          undefined,
          undefined,
          [ ngxElementExtends ],
          [ 
            createConstructor(text),
            createAttibuteCallback(inputs),
            createObserveAttribute(inputs),
            ...createProps(inputs).reduce((acc, val) => acc.concat(val), []),
          ]
      ))
    ])
  )
}