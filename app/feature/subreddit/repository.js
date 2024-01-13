import subredditHotDummyData from "~/data/subreddit-hot.json";
import subredditNewDummyData from "~/data/subreddit-new.json";
import subredditTopDummyData from "~/data/subreddit-top.json";

export class SortTypeError extends Error {}

export function getPosts(sort) {
  let posts;

  switch (sort) {
    case "hot":
      posts = subredditHotDummyData;
      break;

    case "new":
      posts = subredditNewDummyData;
      break;

    case "top":
      posts = subredditTopDummyData;
      break;

    default:
      throw new SortTypeError(`Unknown sort: ${sort}`);
  }

  return posts.data.children;
}
