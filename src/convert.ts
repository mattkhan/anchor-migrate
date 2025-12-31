import { Node, TypeLiteralNode } from "ts-morph";
import { propertyAssignable } from "./utils";

type ConvertArgs = {
  /** The generated node. */
  g: TypeLiteralNode;
  /** The manual node. */
  m: TypeLiteralNode;
};

export function convertRelationships({ g, m }: ConvertArgs) {
  const gRel = g.getProperty("relationships");
  const mRel = m.getProperty("relationships");

  if (!gRel || !mRel) throw new Error();

  const gRelNode = gRel.getTypeNodeOrThrow();
  const mRelNode = mRel.getTypeNodeOrThrow();

  if (!Node.isTypeLiteral(gRelNode)) return { hasMissing: false };
  if (!Node.isTypeLiteral(mRelNode)) return { hasMissing: false };
  return convertAttributes({ g: gRelNode, m: mRelNode });
}

/**
 * From `m`, the manual node, `convertAttributes`:
 * - removes properties with the same type in the generated node
 * - adds an `Omitted` property if the property is in `g` and not in `m`
 *   `relationships` property is excluded in these operations
 * */
export function convertAttributes({ g, m }: ConvertArgs) {
  const generatedProperties = g
    .getProperties()
    .filter((p) => p.getName() !== "relationships");

  const manualProperties = m
    .getProperties()
    .filter((p) => p.getName() !== "relationships");

  const handleMissing = () => {
    let hasMissing = false;

    for (const prop of generatedProperties) {
      const propName = prop.getName();
      if (m.getProperty(propName)) continue;
      m.addProperty({ name: propName, type: "Omitted" });
      hasMissing ||= true;
    }

    return hasMissing;
  };

  const removeMatches = () => {
    for (const prop of manualProperties) {
      const propName = prop.getName();
      if (propertyAssignable({ t: g, u: m, prop: propName })) prop.remove();
    }
  };

  const hasMissing = handleMissing();
  removeMatches();

  return {
    /** Useful to let caller know `Omitted` should be imported. */
    hasMissing,
  };
}
