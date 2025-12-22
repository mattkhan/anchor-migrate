import Post from "./Post.model";
import User from "./User.model";

type Comment = {
  id: string;
  type: string;
  text: string;
  actuallyNullableThing: string;
  bIsMissing: { a?: string; b?: string };
  nothingMissing: { a?: string; b?: string };
  excludedBecauseMatch: string;
  includedBecauseMismatch: string;
  includedBecauseMismatchNullability: string | null;
  includedBecauseMismatchOptionality?: string;
  includedBecauseMissing: string;
  includedBecauseUnknown: string;
  relationships: {
    post: Post;
    user: User;
  };
};

export default Comment;
