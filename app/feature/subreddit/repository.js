import subredditHotDummyData from "~/data/subreddit-hot.json";
import subredditNewDummyData from "~/data/subreddit-new.json";
import subredditTopDummyData from "~/data/subreddit-top.json";
import postDummyData from "~/data/post.json";

export class SortTypeError extends Error {}

function defer(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPosts(sort) {
  await defer(1000);

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

export async function getPost(id) {
  const posts = [
    ...subredditHotDummyData.data.children,
    ...subredditNewDummyData.data.children,
    ...subredditTopDummyData.data.children,
  ];

  const post = posts.find((post) => post.data.id === id);

  if (!post) {
    throw new Error("Not found");
  }

  return post;
}

export async function getComments() {
  await defer(3000);
  return postDummyData[1].data.children;
}
