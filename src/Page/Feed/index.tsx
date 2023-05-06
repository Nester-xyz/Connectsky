import React, { useState, useEffect, useRef, useContext } from "react";
import PostSection from "../../components/PageComponents/Feed/PostSection";
import PostCard from "../../components/PageComponents/Feed/PostCard";
import { BlobRef } from "@atproto/api";
import PostLoader from "../../components/PageComponents/Feed/PostLoader";
import { appContext } from "../../context/appContext";

import { agent, refreshSession } from "../../utils";

import { dataGotFromApi } from "../../components/@types/Feed/Feed";
// the component begins here
const Feed = () => {
  const [showAddPost, setShowAddPost] = useState(false);
  const [showImage, setShowImage] = useState(false);
  console.log(showImage);
  const [cursor, setCursor] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedData, setFeedData] = useState<dataGotFromApi[]>([]);
  const [image, setImage] = useState<BlobRef | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const { postText, setPostText, fileRef, uploadedFile } =
    useContext(appContext);

  const differentButtonsForFeed = [
    {
      name: "Media",
      icon: undefined,
      action: () => {
        fileRef.current?.click();
      },
    },
    {
      name: "Post",
      icon: undefined,
      action: async () => {
        try {
          const sessData = localStorage.getItem("sess");
          if (sessData !== null) {
            const sessParse = JSON.parse(sessData);
            await agent.resumeSession(sessParse);
          }
          if (image !== null && postText.length > 0) {
            const res = await agent.post({
              text: postText,
              embed: {
                $type: "app.bsky.embed.images",
                images: [
                  {
                    image,
                    alt: "Posted via Connectsy!",
                  },
                ],
              },
            });
          } else {
            if (postText.length > 0) {
              await agent.post({ text: postText });
            }
          }
          setPostText("");
          setImage(null);
        } catch (error) {
          console.log(error);
        }
      },
    },
  ];

  async function followingFeed() {
    await refreshSession();
    const { data } = await agent.getTimeline({
      limit: 20,
      cursor: cursor,
    });
    if (data.cursor == null) return;
    setCursor(data.cursor);
    console.log(data);
    const mappedData: dataGotFromApi[] = data.feed.map((feed: any) => {
      // console.log(feed);
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
        uri: feed.post.uri,
        cid: feed.post.cid,
        repostCount: feed.post.repostCount,
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
    setFeedData((prevData) => [...prevData, ...mappedData]);
  }
  const observerCallback: IntersectionObserverCallback = (entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting) {
      followingFeed();
      setIsLoading(true);
    }
  };
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.5,
  });

  useEffect(() => {
    if (!isLoading) {
      followingFeed();
      setIsLoading(true);
    }
    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, [isLoading, observer]);
  return (
    <div className=" w-full px-5">
      {showAddPost ? (
        <PostSection
          showImage={showImage}
          setShowImage={setShowImage}
          differentButtonsForFeed={differentButtonsForFeed}
          setImage={setImage}
          setShowAddPost={setShowAddPost}
        />
      ) : (
        <div className="w-full h-full">
          <button
            className="md:hidden z-50 fixed bottom-20 right-8 w-12 h-12 bg-blue-500 rounded-full text-4xl flex items-center justify-center text-white"
            onClick={() => setShowAddPost(true)}
          >
            +
          </button>

          <div className="grid grid-cols-4 gap-5 h-screen relative">
            <div className="col-span-4 lg:col-span-3 mt-5">
              {/* create the feed */}
              <div className="hidden md:block">
                <PostSection
                  showImage={showImage}
                  setShowImage={setShowImage}
                  differentButtonsForFeed={differentButtonsForFeed}
                  setImage={setImage}
                  setShowAddPost={setShowAddPost}
                />
              </div>
              <div className=" rounded-md  w-full flex flex-col gap-2 mt-5">
                {
                  // here we will map the feed
                  feedData.map((item: dataGotFromApi, index) => {
                    if (index === feedData.length - 1) {
                      return (
                        <div ref={lastElementRef} key={index}>
                          <PostCard
                            author={item.author.displayName}
                            comments={item.comments}
                            likes={item.likes}
                            caption={item.caption.text}
                            image={item.image.embed.images[0].thumb}
                            profileImg={item.author.avatar}
                            uri={item.uri}
                            cid={item.cid}
                            repostCount={item.repostCount}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={index}>
                          <PostCard
                            author={item.author.displayName}
                            comments={item.comments}
                            likes={item.likes}
                            caption={item.caption.text}
                            image={item.image.embed.images[0].thumb}
                            profileImg={item.author.avatar}
                            uri={item.uri}
                            cid={item.cid}
                            repostCount={item.repostCount}
                          />
                        </div>
                      );
                    }
                  })
                }
                {isLoading ? (
                  <>
                    {" "}
                    <PostLoader /> <PostLoader />
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="bg-slate-50 hidden lg:block col-span-1 sticky h-full top-5"></div>
          </div>
        </div>
      )}
      {/* create the top - post option */}
    </div>
  );
};

export default Feed;
