import React, { useState } from "react";
import PostSection from "../../components/PageComponents/Feed/PostSection";

type Props = {};

const differentButtonsForFeed = [
  {
    name: "Post",
    icon: undefined,
    action: () => {},
  },
  {
    name: "Post",
    icon: undefined,
    action: () => {},
  },
  {
    name: "Post",
    icon: undefined,
    action: () => {},
  },
  {
    name: "Post",
    icon: undefined,
    action: () => {},
  },
];

type feedOptionsButtonsProps = {
  name: string;
  filter: string;
  icon: string | undefined | Element;
};

const feedOptionsButtons = [
  {
    name: "For you",
    filter: "forYou",
    icon: undefined,
  },
  {
    name: "Following",
    filter: "following",
    icon: undefined,
  },
  {
    name: "Popular",
    filter: "popular",
    icon: undefined,
  },
];

const Feed = (props: Props) => {
  const [filterVariable, setFilterVariable] = useState<string>("forYou");

  return (
    <div className="mt-5 w-full  px-5">
      {/* create the top - post option */}

      <PostSection differentButtonsForFeed={differentButtonsForFeed} />

      {/* create teh filler page */}

      {/* just to get an nice underline here */}
      <div className="bg-white h-1 w-full my-3 px-2"></div>
      <div className="flex gap-3">
        {feedOptionsButtons.map((item, index) => {
          return (
            <div>
              <button
                className="bg-white border rounded-md border-gray-300 flex-1 md:w-48 min-w-[100px]"
                onClick={() => setFilterVariable(item.filter)}
              >
                {item.name}
              </button>
            </div>
          );
        })}
      </div>

      {/* create the feed */}
      <div className="bg-white border rounded-md border-gray-300 w-full">
        {
          // here we will map the feed
        }
      </div>
    </div>
  );
};

export default Feed;
