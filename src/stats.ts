import { Node, Project, SourceFile, TypeLiteralNode } from "ts-morph";
import { getFirstTypeParamFromGeneric } from "./utils";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });

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

const empty = {
  missing: 0,
  intersecting: 0,
  omitted: 0,
};

type StatsArgs = {
  g: TypeLiteralNode;
  m: TypeLiteralNode;
};

export function relationshipStats({ g, m }: StatsArgs) {
  const gRel = g.getProperty("relationships");
  const mRel = m.getProperty("relationships");

  if (!gRel || !mRel) throw new Error();

  const gRelNode = gRel.getTypeNodeOrThrow();
  const mRelNode = mRel.getTypeNodeOrThrow();

  if (!Node.isTypeLiteral(gRelNode)) return empty;
  if (!Node.isTypeLiteral(mRelNode)) return empty;
  return attributeStats({ g: gRelNode, m: mRelNode });
}

export function attributeStats({ g, m }: StatsArgs) {
  const generatedProperties = g
    .getProperties()
    .filter((p) => p.getName() !== "relationships");

  const manualProperties = m
    .getProperties()
    .filter((p) => p.getName() !== "relationships");

  const countIntersecting = () => {
    let count = 0;

    for (const prop of generatedProperties) {
      const propName = prop.getName();
      const mProp = m.getProperty(propName);
      if (mProp && mProp.getType().getText() !== "typeof OMITTED") count += 1;
    }

    return count;
  };

  // In Manual, not in Generated
  const countMissing = () => {
    let count = 0;

    for (const prop of manualProperties) {
      const propName = prop.getName();
      if (!g.getProperty(propName)) count += 1;
    }

    return count;
  };

  // Omitted in Manual
  const countOmitted = () => {
    let count = 0;

    for (const prop of manualProperties) {
      if (prop.getType().getText() === "typeof OMITTED") count += 1;
    }

    return count;
  };

  return {
    omitted: countOmitted(),
    missing: countMissing(),
    intersecting: countIntersecting(),
  };
}

export function getStats(genFilePath: string) {
  const sourceFile = project.getSourceFileOrThrow(genFilePath);

  const modelNode = findModelNode(sourceFile);
  const overrideNode = findOverrideNode(sourceFile);

  if (!Node.isTypeLiteral(modelNode)) return;
  if (!Node.isTypeLiteral(overrideNode)) return;

  const attributes = attributeStats({ g: modelNode, m: overrideNode });
  const relationships = relationshipStats({ g: modelNode, m: overrideNode });
  return { attributes, relationships };
}
