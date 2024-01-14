import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useState } from "react";

export function VoteButton({ votes, horizontal = false }) {
  const [voteType, setVoteType] = useState(null);

  let calculatedVotes = votes;
  if (voteType === "up") calculatedVotes += 1;
  if (voteType === "down") calculatedVotes -= 1;

  return (
    <div
      className={clsx("flex gap-2 py-2 px-1 items-center", {
        "flex-col": !horizontal,
      })}
    >
      <button
        onClick={() => {
          if (voteType === "up") setVoteType(null);
          else setVoteType("up");
        }}
      >
        <ArrowUpIcon
          className={clsx("h-5 w-5", {
            "text-blue-600 font-bold": voteType === "up",
          })}
        />
      </button>
      <span className="text-center">{calculatedVotes}</span>
      <button
        onClick={() => {
          if (voteType === "down") setVoteType(null);
          else setVoteType("down");
        }}
      >
        <ArrowDownIcon
          className={clsx("h-5 w-5", {
            "text-blue-600 font-bold": voteType === "down",
          })}
        />
      </button>
    </div>
  );
}

VoteButton.propTypes = {
  votes: PropTypes.number.isRequired,
  horizontal: PropTypes.bool,
};
