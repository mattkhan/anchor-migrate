import { IndentationText, Node, Project } from "ts-morph";
import {
  getSoleExport,
  getDefaultExport,
  getFirstTypeParamFromGeneric,
} from "./utils";
import { convertAttributes } from "./convert";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  manipulationSettings: { indentationText: IndentationText.TwoSpaces },
});

export function migrate(genFilePath: string, manualFilePath: string) {
  const genSourceFile = project.getSourceFileOrThrow(genFilePath);
  const manualSourceFile = project.getSourceFileOrThrow(manualFilePath);

  const manualNode = getDefaultExport(manualSourceFile);
  const genNode = getSoleExport(genSourceFile);

  if (!manualNode) throw new Error();
  if (!genNode) throw new Error();

  const genNodeOrder = genNode.getChildIndex();

  const g = genSourceFile
    .getTypeAlias(genNode.getType().getText())!
    .getTypeNodeOrThrow();

  const m = (() => {
    const mNode = manualNode.getTypeNodeOrThrow();
    if (Node.isTypeReference(mNode)) return getFirstTypeParamFromGeneric(mNode);
    return mNode;
  })();

  if (!Node.isTypeLiteral(g)) return;
  if (!Node.isTypeLiteral(m)) return;

  const { hasMissing } = convertAttributes({ g, m });

  const requiredSharedImports = ["ModelOverride"];
  if (hasMissing) requiredSharedImports.push("Omitted");

  genNode.setType("ModelOverride<Model, Override>");
  const structure = genNode.getStructure();

  // hacky dup to get insertions _after_ END AUTOGEN comment
  genSourceFile.insertTypeAlias(genNodeOrder + 1, structure);

  const addManualDef = () => {
    genSourceFile.insertTypeAlias(genNodeOrder + 1, {
      name: "Override",
      type: manualNode
        .getTypeNodeOrThrow()
        .getText({ trimLeadingIndentation: true, includeJsDocComments: true }),
      isExported: false,
    });
  };

  addManualDef();

  genSourceFile.insertImportDeclaration(genNodeOrder + 1, {
    namedImports: requiredSharedImports,
    moduleSpecifier: "./shared.custom",
  });

  genNode.remove();
  genSourceFile.formatText({ indentSize: 2 });

  return genSourceFile;
}
