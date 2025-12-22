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

type User = Model;

export { type User };
