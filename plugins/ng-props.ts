import * as ts from 'typescript'

export const createNgProps = (inputs: string[]) => {
  return inputs.map(text => {
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
}