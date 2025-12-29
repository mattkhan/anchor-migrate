import { Node, SourceFile } from "ts-morph";
import { convertRelationships } from "./convert";
import { getFirstTypeParamFromGeneric } from "./utils";

function findModelNode(sourceFile: SourceFile) {
  return sourceFile.getTypeAliasOrThrow("Model").getTypeNodeOrThrow();
}

function findOverrideNode(sourceFile: SourceFile) {
  const node = sourceFile.getTypeAliasOrThrow("Override").getTypeNodeOrThrow();
  if (Node.isTypeReference(node)) {
    return getFirstTypeParamFromGeneric(node);
  }
  return node;
}

export function removeConvertedRelationships(sourceFile: SourceFile) {
  const modelNode = findModelNode(sourceFile);
  const overrideNode = findOverrideNode(sourceFile);

  if (!Node.isTypeLiteral(modelNode)) return;
  if (!Node.isTypeLiteral(overrideNode)) return;

  const { hasMissing } = convertRelationships({
    g: modelNode,
    m: overrideNode,
  });

  const importDecl = sourceFile
    .getImportDeclarations()
    .find((d) => d.getModuleSpecifierValue() === "./shared.custom")!;

  if (hasMissing) {
    const hasOmitted = importDecl
      .getNamedImports()
      .some((x) => x.getName() === "Omitted");

    if (!hasOmitted) importDecl.addNamedImport("Omitted");
  }

  return sourceFile;
}
