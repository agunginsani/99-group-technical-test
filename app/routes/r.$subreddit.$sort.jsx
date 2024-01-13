import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { formatDistance } from "date-fns";
import { clsx } from "clsx";

import { userPrefs } from "~/cookies.server";
import { SortTypeError, getPosts } from "~/feature/subreddit/repository";
import { createContext } from "react";
import { useContext } from "react";

export async function loader({ params, request }) {
  try {
    const posts = getPosts(params.sort);
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userPrefs.parse(cookieHeader)) || {};

    return json({
      viewMode: parseInt(cookie.viewMode?.value ?? "0"),
      posts: posts,
    });
  } catch (error) {
    if (error instanceof SortTypeError)
      throw new Response(null, {
        status: 404,
        statusText: "Not Found",
      });
    else
      throw new Response(null, {
        status: 500,
        statusText: "Something went wrong",
      });
  }
}

export default function SubredditSort() {
  const { posts, viewMode } = useLoaderData();

  return (
    <ul
      className={clsx("flex flex-col", {
        "gap-2": viewMode === 0,
      })}
    >
      {posts.map((post) => (
        <li
          key={post.data.id}
          className={clsx("bg-white overflow-hidden", {
            "rounded-md": viewMode === 0,
            "border-b-2 border-solid": viewMode !== 0,
          })}
        >
          <ThreadCard
            title={post.data.title}
            body={post.data.selftext}
            created={post.data.created}
            author={post.data.author}
            comments={post.data.num_comments}
            upvotes={post.data.ups}
          />
        </li>
      ))}
    </ul>
  );
}

const ThreadCardContext = createContext();

function useThreadCardContext() {
  const context = useContext(ThreadCardContext);

  if (!context)
    throw new Error(
      `"useThreadCardContext" cannot be used outside "ThreadCardContext"`
    );

  return context;
}

function ThreadCard({ title, author, created, body, comments, upvotes }) {
  const { viewMode } = useLoaderData();
  const formattedCreated = formatDistance(new Date(created * 1000), new Date());

  let card;

  switch (viewMode) {
    case 0:
      card = <ThreadCardDefault />;
      break;

    case 1:
      card = <ThreadCardClassic />;
      break;

    case 2:
      card = <ThreadCardCompact />;
  }

  return (
    <ThreadCardContext.Provider
      value={{
        title,
        author,
        created: formattedCreated,
        body,
        comments,
        upvotes,
      }}
    >
      {card}
    </ThreadCardContext.Provider>
  );
}

ThreadCard.propTypes = {
  mode: PropTypes.oneOf([0, 1, 2]),
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  created: PropTypes.number.isRequired,
  comments: PropTypes.number.isRequired,
  upvotes: PropTypes.number.isRequired,
};

function ThreadCardDefault() {
  const { title, author, created, body, comments, upvotes } =
    useThreadCardContext();

  return (
    <div className="flex">
      <div className="bg-slate-50 w-20 flex flex-shrink-0 justify-center">
        <div className="flex flex-col gap-2 py-2 px-1 align-middle">
          <button>
            <ArrowUpIcon className="h-5 w-5" />
          </button>
          <span className="text-center">{upvotes}</span>
          <button>
            <ArrowDownIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-2">
        <div className="text-xs">
          Posted by u/{author} {created} ago
        </div>
        <h3 className="text-lg font-bold mt-2">{title}</h3>
        <div className="mt-3">{body}</div>
        <div className="flex items-center gap-1 mt-4 text-xs text-slate-500">
          <ChatBubbleLeftIcon className="w-5 h-5" /> {comments} Comments
        </div>
      </div>
    </div>
  );
}

function ThreadCardClassic() {
  const { title, author, created, body, comments, upvotes } =
    useThreadCardContext();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex">
      <div className="bg-slate-50 w-20 flex flex-shrink-0 justify-center">
        <div className="flex flex-col gap-2 py-2 px-1 align-middle">
          <button>
            <ArrowUpIcon className="h-5 w-5" />
          </button>
          <span className="text-center">{upvotes}</span>
          <button>
            <ArrowDownIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="text-xs">
          Posted by u/{author} {created} ago
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <ArrowsPointingInIcon className="h-5 w-5" />
            ) : (
              <ArrowsPointingOutIcon className="h-5 w-5" />
            )}
          </button>
          <div className="border-solid border-r-2 h-5" />
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ChatBubbleLeftIcon className="w-5 h-5" /> {comments} Comments
          </div>
        </div>
        {isExpanded ? <div className="mt-3">{body}</div> : null}
      </div>
    </div>
  );
}

function ThreadCardCompact() {
  const { title, author, created, body, comments, upvotes } =
    useThreadCardContext();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className="flex">
        <div className="bg-slate-50 w-24 flex flex-shrink-0 justify-center">
          <div className="flex h-fit gap-2 py-2 px-1 align-middle">
            <button>
              <ArrowUpIcon className="h-5 w-5" />
            </button>
            <span className="text-center">{upvotes}</span>
            <button>
              <ArrowDownIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex justify-between flex-1 px-2">
          <div className="flex">
            <button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <ArrowsPointingInIcon className="h-5 w-5" />
              ) : (
                <ArrowsPointingOutIcon className="h-5 w-5" />
              )}
            </button>
            <div className="p-2">
              <h3 className="text-lg font-bold">{title}</h3>
              <div className="text-xs">
                Posted by u/{author} {created} ago
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ChatBubbleLeftIcon className="w-4 h-4" /> <span>{comments}</span>
          </div>
        </div>
      </div>
      {isExpanded ? <div className="p-2">{body}</div> : null}
    </div>
  );
}
