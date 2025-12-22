// START AUTOGEN

import type { Comment } from "./Comment.model";
import type { Post } from "./Post.model";

type Model = {
  id: number;
  type: "users";
  name: string;
  role: "admin" | "member";
  relationships: {
    comments: Array<Comment>;
    posts: Array<Post>;
  };
};

// END AUTOGEN
import { ModelOverride } from "./shared.custom";

type Override = {
  id: string;
  type: string;
  role: "admin" | "member" | "none";
  relationships: {
    thing: { thing: "whatever" }[];
  };
};
type User = ModelOverride<Model, Override>;

export { type User };
