import { Node, SourceFile } from "ts-morph";
import { convertRelationships as internalConvertRelationships } from "./convert";
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

/** Should only be run once, directly after migration.
 * Running it twice in succession will mistakenly add back properties
 * that were removed (because they had the same type) after the initial execution.
 *
 * e.g. given the file below, directly after migration
 * ```ts
 * import type { User } from './User.model';
 * import type { Comments } from './Comment.model';
 *
 * import { ModelOveride, Omitted } from './shared.custom'
 *
 * type Generated = { id: number; relationships: { user: User; comments: Comment[]; } };
 * type Override = { relationships: { user: User; comments: Omitted; } };
 *
 * export type Post = ModelOverride<Generated, Override>;
 * ```
 * Running convertRelationships once will remove `user` from `Override` because the types match.
 *
 * ```ts
 * import type { User } from './User.model';
 * import type { Comments } from './Comment.model';
 *
 * import { ModelOveride, Omitted } from './shared.custom'
 *
 * type Generated = { id: number; relationships: { user: User; comments: Comment[]; } };
 * type Override = { relationships: { comments: Omitted; } };
 *
 * export type Post = ModelOverride<Generated, Override>;
 * ```
 *
 * Running it again will produce:
 *
 * ```ts
 * import type { User } from './User.model';
 * import type { Comments } from './Comment.model';
 *
 * import { ModelOveride, Omitted } from './shared.custom'
 *
 * type Generated = { id: number; relationships: { user: User; comments: Comment[]; } };
 * type Override = { relationships: { user: Omitted; comments: Omitted; } };
 *
 * export type Post = ModelOverride<Generated, Override>;
 * ```
 *
 * Which then flows into the exported `ModelOverride` type not having a `relationships.user` property at all
 */
function convertRelationships(sourceFile: SourceFile) {
  const modelNode = findModelNode(sourceFile);
  const overrideNode = findOverrideNode(sourceFile);

  if (!Node.isTypeLiteral(modelNode)) return;
  if (!Node.isTypeLiteral(overrideNode)) return;

  const { hasMissing } = internalConvertRelationships({
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

export const postMigration = {
  convertRelationships,
};
