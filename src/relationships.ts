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

  convertRelationships({ g: modelNode, m: overrideNode });
  return sourceFile;
}
