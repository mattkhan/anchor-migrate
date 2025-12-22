import {
  Node,
  TypeLiteralNode,
  SourceFile,
  SyntaxKind,
  TypeReferenceNode,
} from "ts-morph";

export function getDefaultExport(sourceFile: SourceFile) {
  const exportAssignmentSymbol = sourceFile.getDefaultExportSymbol()!;
  const exportAssignmentDec = exportAssignmentSymbol.getDeclarations()[0];
  if (!exportAssignmentDec?.isKind(SyntaxKind.ExportAssignment))
    throw new Error();
  const identifier = exportAssignmentDec.getExpressionIfKindOrThrow(
    SyntaxKind.Identifier,
  );
  const name = identifier.getText();
  return sourceFile.getTypeAlias(name);
}

export function getSoleExport(sourceFile: SourceFile) {
  const exportDeclaration = sourceFile.getExportDeclarations()[0];
  const exportName = exportDeclaration?.getNamedExports()[0]?.getName();

  if (!exportName) return;

  const typeAlias = sourceFile.getTypeAlias(exportName);
  return typeAlias;
}

/** Get the type literal out of Wrapper<{ text: string }> */
export function getFirstTypeParamFromGeneric(node: TypeReferenceNode) {
  const typeArgs = node.getTypeArguments();
  return typeArgs[0];
}

export function propertyAssignable({
  t,
  u,
  prop,
}: {
  t: TypeLiteralNode;
  u: TypeLiteralNode;
  prop: string;
}): boolean {
  const tProp = t.getProperty(prop);
  const uProp = u.getProperty(prop);

  if (!tProp || !uProp) return false;

  const tNode = tProp.getTypeNode();
  const uNode = uProp.getTypeNode();

  if (!tNode || !uNode) return false;

  const tPropType = tNode.getType();
  const uPropType = uNode.getType();

  if (!tPropType || !uPropType) return false;

  const propertiesAssignable = (a: TypeLiteralNode, b: TypeLiteralNode) => {
    return a
      .getProperties()
      .reduce(
        (acc, elem) =>
          acc && propertyAssignable({ t: a, u: b, prop: elem.getName() }),
        true,
      );
  };

  if (Node.isTypeLiteral(tNode) && Node.isTypeLiteral(uNode)) {
    return (
      propertiesAssignable(tNode, uNode) && propertiesAssignable(uNode, tNode)
    );
  }
  if (Node.isTypeLiteral(tNode) || Node.isTypeLiteral(uNode)) return false;

  return (
    tPropType.isAssignableTo(uPropType) &&
    uPropType.isAssignableTo(tPropType) &&
    tProp.hasQuestionToken() === uProp.hasQuestionToken()
  );
}
