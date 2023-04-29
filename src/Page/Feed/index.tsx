import React, { useState, useEffect } from "react";
import { dummyData } from "./dummyData";
import PostSection from "../../components/PageComponents/Feed/PostSection";
import PostCard from "../../components/PageComponents/Feed/PostCard";
import { BskyAgent, AtpSessionData, AtpSessionEvent } from "@atproto/api";

//  Props = {
//   profileImg?: string;
//   author: string;
//   caption?: string;
//   image?: string;
//   likes: number;
//   comments: number;
// };
interface Author {
  displayName: string;
}

interface Caption {
  text: string;
}

interface Image {
  thumb: string;
}

interface thumbImage {
  images: Image[];
}

interface Embed {
  embed: thumbImage;
}

interface item {
  author: Author;
  comments: string[];
  likes: string[];
  caption: Caption;
  image: Embed;
}

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

const Feed = () => {
  const [filterVariable, setFilterVariable] = useState<string>("forYou");
  const [cursor, setCursor] = useState<string>("");
  const [feedData, setFeedData] = useState<object[]>([]);

  const agent = new BskyAgent({
    service: "https://bsky.social",
    persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
      console.log("first");
    },
  });

  useEffect(() => {
    async function followingFeed() {
      const sessData = localStorage.getItem("sess");
      if (sessData !== null) {
        const sessParse = JSON.parse(sessData);
        await agent.resumeSession(sessParse);
      }
      const { data } = await agent.getTimeline({
        limit: 20,
        cursor: cursor,
      });
      if (data.cursor == null) return;
      setCursor(data.cursor);
      setFeedData(data.feed);
    }
    followingFeed();
  }, []);
  console.log(feedData);
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

              feedData.map((item: item, index) => {
                return (
                  <div>
                    <PostCard
                      author={item?.author?.displayName}
                      comments={item.comments.length}
                      likes={item.likes.length}
                      caption={item?.caption?.text}
                      image={item.embed.images[0].thumb}
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
