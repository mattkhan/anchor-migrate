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

type Post = Model;

export { type Post };
