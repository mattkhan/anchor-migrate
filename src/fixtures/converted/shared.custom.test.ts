import { ModelOverride, Omitted } from "./shared.custom";
import { describe, it, expectTypeOf } from "vitest";

type Generated = {
  rr: 0;
  ro: 1;
  or?: 2;
  oo?: 3;
  overriden: unknown;
  notIncluded: string;

  relationships: {
    rr: 0;
    ro: 1;
    or?: 2;
    oo?: 3;
    overriden: unknown;
    notIncluded: string;
  };
};

type Override = {
  rr: Omitted;
  ro: Omitted;
  or: Omitted;
  oo: Omitted;
  overriden: string;

  relationships: {
    rr: Omitted;
    ro: Omitted;
    or: Omitted;
    oo: Omitted;
    overriden: string;
  };
};

export type Example = ModelOverride<Generated, Override>;

describe("ModelOverride", () => {
  it("overrides the generated type", () => {
    expectTypeOf<ModelOverride<Generated, Override>>().toEqualTypeOf<{
      notIncluded: string;
      overriden: string;

      relationships: {
        overriden: string;
        notIncluded: string;
      };
    }>();
  });
});
