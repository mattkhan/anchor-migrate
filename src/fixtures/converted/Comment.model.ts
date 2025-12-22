// START AUTOGEN

import type { Post } from "./Post.model";
import type { User } from "./User.model";

type Model = {
  id: string;
  type: "comments";
  text: string;
  actuallyNullableThing: string | null;
  bIsMissing: { a?: string };
  nothingMissing: { a?: string; b?: string };
  excludedBecauseMatch: string;
  includedBecauseMismatch: number;
  includedBecauseMismatchNullability: string;
  includedBecauseMismatchOptionality: string;
  includedBecauseUnknown: unknown;
  omittedBecauseMissing: string;
  omittedBecauseMissingOptional?: string;
  relationships: {
    post: Post;
    user: User;
    creator: User;
    deleter?: User;
  };
};

// END AUTOGEN
import { ModelOverride, Omitted } from "./shared.custom";

type Override = {
  type: string;
  actuallyNullableThing: string;
  bIsMissing: { a?: string; b?: string };
  includedBecauseMismatch: string;
  includedBecauseMismatchNullability: string | null;
  includedBecauseMismatchOptionality?: string;
  includedBecauseMissing: string;
  includedBecauseUnknown: string;
  relationships: {
    creator: Omitted;
    deleter: Omitted;
  };
  omittedBecauseMissing: Omitted;
  omittedBecauseMissingOptional: Omitted;
};
type Comment = ModelOverride<Model, Override>;

export { type Comment };
