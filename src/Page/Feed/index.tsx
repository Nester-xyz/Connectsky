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
  avatar: string;
}

interface Caption {
  text: string;
}

interface Image {
  thumb: string;
}

interface Embed {
  images: Image[];
}

interface ImageObject {
  embed: Embed;
}

interface Item {
  author: Author;
  comments: number;
  likes: number;
  caption: Caption;
  image: ImageObject;
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
  const [feedData, setFeedData] = useState<Item[]>([]);

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
      const mappedData: Item[] = data.feed.map((feed: any) => {
        console.log(feed);
        const images =
          feed.post.embed && "images" in feed.post.embed
            ? feed.post.embed.images
            : [];
        const firstImageThumb = images?.length > 0 ? images[0].thumb : "";

        return {
          author: {
            displayName: feed.post.author.displayName,
            avatar: feed.post.author.avatar,
          },
          likes: feed.post.likeCount,
          comments: feed.post.replyCount,
          caption: {
            text:
              feed.post.record && "text" in feed.post.record
                ? feed.post.record.text
                : "",
          },
          image: {
            embed: {
              images: [{ thumb: firstImageThumb }],
            },
          },
        };
      });
      setFeedData(mappedData);
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

              feedData.map((item: Item, index) => {
                return (
                  <div>
                    <PostCard
                      author={item.author.displayName}
                      comments={item.comments}
                      likes={item.likes}
                      caption={item.caption.text}
                      image={item.image.embed.images[0].thumb}
                      profileImg={item.author.avatar}
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
