// START AUTOGEN

import type { Comment } from "./Comment.model";

type Model = {
  id: string;
  type: "posts";
  text: unknown;
  relationships: {
    comments: Comment[];
  };
};

// END AUTOGEN
import { ModelOverride } from "./shared.custom";

type Override = Identity<{
  type: string;
  text: string;
  relationships: {
    user: User;
  };
}>;
type Post = ModelOverride<Model, Override>;

export { type Post };
