import Comment from "./Comment.model";
import User from "./User.model";

type Identity<T> = T;

type Post = Identity<{
  id: string;
  type: string;
  text: string;
  relationships: {
    comments: Comment[];
    user: User;
  };
}>;

export default Post;
