import path from "path";

import { migrate } from "./migrate";
import { postMigration } from "./post-migration";

const fixtures = path.join(__dirname, "fixtures");

describe("migrate", () => {
  function testModel(model: string) {
    const subject = () => {
      const genFilePath = path.join(fixtures, `gen/${model}.model.ts`);
      const manualFilePath = path.join(fixtures, `manual/${model}.model.ts`);
      const sourceFile = migrate(genFilePath, manualFilePath);
      return postMigration.convertRelationships(sourceFile!)!.getFullText();
    };

    const snapshotPath = `fixtures/converted/${model}.model.ts`;

    describe(model, () => {
      it("converts", async () => {
        await expect(subject()).toMatchFileSnapshot(snapshotPath);
      });
    });
  }

  ["User", "Comment", "Post"].forEach(testModel);
});
