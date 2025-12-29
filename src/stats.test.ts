import path from "path";
import { getStats } from "./stats";

const fixtures = path.join(__dirname, "fixtures");

const stats = {
  User: {
    attributes: {
      omitted: 0,
      missing: 0,
      intersecting: 3,
    },
    relationships: {
      omitted: 0,
      missing: 1,
      intersecting: 0,
    },
  },
  Comment: {
    attributes: {
      omitted: 2,
      missing: 1,
      intersecting: 7,
    },
    relationships: {
      omitted: 2,
      missing: 0,
      intersecting: 0,
    },
  },
  Post: {
    attributes: {
      omitted: 0,
      missing: 0,
      intersecting: 2,
    },
    relationships: {
      omitted: 1,
      missing: 1,
      intersecting: 0,
    },
  },
} as const;

describe("getStats", () => {
  function testModel(model: keyof typeof stats) {
    const subject = () => {
      const convertedPath = path.join(fixtures, `converted/${model}.model.ts`);
      return getStats(convertedPath);
    };

    describe(model, () => {
      it("counts", () => {
        expect(subject()).toEqual(stats[model]);
      });
    });
  }

  const models = ["User", "Comment", "Post"] as const;
  models.forEach(testModel);
});
