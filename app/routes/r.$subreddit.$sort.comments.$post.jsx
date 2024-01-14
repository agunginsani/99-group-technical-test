import { Await, useLoaderData, useNavigate } from "@remix-run/react";
import { useRef, useEffect, Suspense } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { defer } from "@remix-run/node";
import { getComments, getPost } from "~/feature/subreddit/repository";
import PropTypes from "prop-types";
import { formatDistance } from "date-fns";

export async function loader({ params }) {
  try {
    const post = await getPost(params.post);
    const comments = getComments();
    return defer({ post: post.data, comments });
  } catch (error) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
}

export default function Post() {
  const ref = useRef();
  const navigate = useNavigate();
  const { post, comments } = useLoaderData();

  useEffect(() => {
    function handleOutsideClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        navigate(-1);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [navigate, ref]);

  const formattedCreated = formatDistance(
    new Date(post.created * 1000),
    new Date()
  );

  return (
    <div
      ref={ref}
      className="fixed overflow-auto left-0 top-0 w-[640px] inset-x-0 mx-auto h-screen bg-slate-400"
    >
      <div className="flex items-center gap-2 px-7 bg-black text-white">
        <div className="flex h-fit gap-2 p-2 align-middle">
          <button>
            <ArrowUpIcon className="h-5 w-5" />
          </button>
          <span className="text-center">{3}</span>
          <button>
            <ArrowDownIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-between flex-1">
          <div>Title</div>
          <button className="text-sm" onClick={() => navigate(-1)}>
            Close
          </button>
        </div>
      </div>
      <div className="flex p-2 rounded-sm">
        <div className="bg-slate-50 w-20 flex flex-shrink-0 justify-center">
          <div className="flex flex-col gap-2 py-2 px-1 align-middle">
            <button>
              <ArrowUpIcon className="h-5 w-5" />
            </button>
            <span className="text-center">{post.ups}</span>
            <button>
              <ArrowDownIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-2 bg-white">
          <div className="text-xs">
            Posted by u/{post.author} {formattedCreated} ago
          </div>
          <h3 className="text-lg font-bold mt-2">{post.title}</h3>
          <div className="mt-3">{post.selftext}</div>
          <div className="flex items-center gap-1 mt-4 text-xs text-slate-500">
            <ChatBubbleLeftIcon className="w-5 h-5" /> {post.num_comments}
            <span>Comments</span>
          </div>
        </div>
      </div>
      <div className="bg-white flex flex-col gap-2 m-2 p-2">
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={comments}>
            {(comments) => <CommentList comments={comments} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function CommentList({ comments }) {
  return comments.map((comment, index) => {
    const replies =
      typeof comment.data.replies === "string"
        ? []
        : comment.data.replies.data.children;

    return (
      <div key={index}>
        <div className="text-xs text-slate-500">{comment.data.author}</div>
        <div>{comment.data.body}</div>
        <div className="pl-3 mt-2 border-l-2">
          <CommentList comments={replies} />
        </div>
      </div>
    );
  });
}

CommentList.propType = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      created: PropTypes.string.isRequired,
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          author: PropTypes.string.isRequired,
          created: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};
