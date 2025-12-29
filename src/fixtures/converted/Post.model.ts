// START AUTOGEN

import type { Comment } from "./Comment.model";

type Model = {
  id: string;
  type: "posts";
  text: unknown;
  relationships: {
    comments: Comment[];
    favoriteComments: Comment[];
  };
};

// END AUTOGEN
import { ModelOverride, Omitted } from "./shared.custom";

type Override = Identity<{
  type: string;
  text: string;
  relationships: {
    user: User;
    favoriteComments: Omitted;
  };
}>;
type Post = ModelOverride<Model, Override>;

export { type Post };
