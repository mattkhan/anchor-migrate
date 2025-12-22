import Comment from "./Comment.model";
import Post from "./Post.model";

type User = {
  id: string;
  type: string;
  name: string;
  role: "admin" | "member" | "none";
  relationships: {
    comments: Comment[];
    posts: Post[];
    thing: { thing: "whatever" }[];
  };
};

export default User;
