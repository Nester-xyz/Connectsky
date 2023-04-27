import React, { useState } from "react";
import { dummyData } from "./dummyData";
import PostSection from "../../components/PageComponents/Feed/PostSection";
import PostCard from "../../components/PageComponents/Feed/PostCard";

type Props = {};

const differentButtonsForFeed = [
  {
    name: "Media",
    icon: undefined,
    action: () => {},
  },
  {
    name: "Links",
    icon: undefined,
    action: () => {},
  },
  {
    name: "GIF",
    icon: undefined,
    action: () => {},
  },
  {
    name: "Post",
    icon: undefined,
    action: () => {},
  },
];

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
];

const Feed = (props: Props) => {
  const [filterVariable, setFilterVariable] = useState<string>("forYou");

  return (
    <div className=" w-full  px-5">
      {/* create the top - post option */}

      <div className="grid grid-cols-4 gap-5 h-screen relative overflow-hidden">
        <div className="col-span-4 md:col-span-3 overflow-scroll mt-5">
          <div className="flex gap-3 sticky top-0 pb-2 bg-white">
            {feedOptionsButtons.map((item, index) => {
              return (
                <div key={index}>
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

          <PostSection differentButtonsForFeed={differentButtonsForFeed} />

          {/* create the feed */}
          <div className=" rounded-md  w-full flex flex-col gap-5 mt-5">
            {
              // here we will map the feed

              dummyData.map((item, index) => {
                return (
                  <div>
                    <PostCard
                      author={item.author}
                      comments={item.comments}
                      likes={item.likes}
                      caption={item.caption}
                      image={item.image}
                      profileImg={item.profileImg}
                    />
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="bg-slate-50 hidden md:block col-span-1 sticky h-full top-5"></div>
      </div>
    </div>
  );
};

export default Feed;
