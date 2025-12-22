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

type Comment = Model;

export { type Comment };
