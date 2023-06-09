import React, { useState, useEffect, useRef, useContext } from "react";
import PostSection from "../../components/PageComponents/Feed/PostSection";
import PostCard from "../../components/PageComponents/Feed/PostCard";
import { BlobRef } from "@atproto/api";
import PostLoader from "../../components/PageComponents/Feed/PostLoader";
import { appContext } from "../../context/appContext";
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { agent, refreshSession } from "../../utils";
import { dataGotFromApi } from "../../components/@types/Feed/Feed";
// the component begins here

const Feed = () => {
  const [showAddPost, setShowAddPost] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [cursor, setCursor] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedData, setFeedData] = useState<dataGotFromApi[]>([]);
  const [fetchedDataLength, setFetchedDataLength] = useState(21);
  const [image, setImage] = useState<BlobRef | null>(null);
  const [submitPost, setSubmitPost] = useState(false);
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
        setSubmitPost(true);
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
                    alt: "Posted via Connectsky!",
                  },
                ],
              },
            });
          } else if (postText.length > 0) {
            await agent.post({ text: postText });
          } else {
            await agent.post({
              text: "",
              embed: {
                $type: "app.bsky.embed.images",
                images: [{ image, alt: "Posted via Connectsy!" }],
              },
            });
          }
          setPostText("");
          setImage(null);
          setSubmitPost(false);
          setShowImage(false);
        } catch (error) {
          setShowImage(false);
          setPostText("");
          setImage(null);
          setSubmitPost(false);
          console.log(error);
        }
      },
    },
  ];

  // async function isFollowing() {
  //   console.log("Following button has been triggered!");
  //   const loggedDID = localStorage.getItem("did");
  //   try {
  //     if (loggedDID == null) return;
  //     await refreshSession();
  //     const response = await agent.getFollows({
  //       actor: loggedDID,
  //     });
  //     console.log(response);
  //     setIsFollows(response.data.follows);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function followingFeed() {
    await refreshSession();
    const { data } = await agent.getTimeline({
      limit: 20,
      cursor: cursor,
    });
    if (data.cursor == null) return;
    setCursor(data.cursor);
    const mappedData: dataGotFromApi[] = data.feed.map((feed: any) => {
      // console.log(feed);
      const images =
        feed.post.embed && "images" in feed.post.embed
          ? feed.post.embed.images
          : [];
      const firstImageThumb = images?.length > 0 ? images[0].thumb : "";

      return {
        reason: {
          by: feed.reason?.by?.displayName,
          did: feed.reason?.by?.did,
        },
        reply: {
          text: feed.reply?.parent?.record?.text,
          by: feed.reply?.parent?.author?.displayName,
          did: feed.reply?.parent?.author?.did,
        },
        author: {
          displayName: feed.post.author.displayName,
          avatar: feed.post.author.avatar,
          handle: feed.post.author.handle,
          did: feed.post.author.did,
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
        embed: {
          $type: feed.post?.embed?.$type,
          data: feed.post?.embed?.record,
        },
        image: {
          embed: {
            images: [{ thumb: firstImageThumb }],
          },
        },
        indexedAt: feed.post?.indexedAt,
        replyParent: feed?.reply?.parent,
      };
    });
    setFetchedDataLength(mappedData.length);
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
    // const didValues = isFollows.map((profileView) => profileView.did);
    // console.log(didValues);
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
          submitPost={submitPost}
        />
      ) : (
        <div className="w-full h-full relative">
          <button
            // className="md:hidden z-30 fixed bottom-20 right-8 w-12 h-12 bg-blue-500 rounded-full text-4xl flex items-center justify-center text-white pb-[6px]"
            className="md:hidden p-3 fixed right-10 bottom-20 z-30 bg-blue-500 rounded-full text-2xl text-white"
            onClick={() => setShowAddPost(true)}
          >
            <HiOutlinePencilSquare />
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
                  submitPost={submitPost}
                />
              </div>
              <div className=" rounded-md  w-full flex flex-col gap-3 mt-5">
                {
                  // here we will map the feed
                  feedData.map((item: dataGotFromApi, index) => {
                    if (index === feedData.length - 1) {
                      return (
                        <div ref={lastElementRef} key={index}>
                          <PostCard
                            author={item.author.displayName}
                            handle={item.author.handle}
                            did={item.author.did}
                            comments={item.comments}
                            likes={item.likes}
                            caption={item.caption.text}
                            image={item.image.embed.images[0].thumb}
                            profileImg={item.author.avatar}
                            uri={item.uri}
                            cid={item.cid}
                            repostCount={item.repostCount}
                            reply={item.reply}
                            reason={item.reason}
                            embed={item.embed}
                            indexedAt={item.indexedAt}
                            replyParent={item.replyParent}
                            isFromProfile={false}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={index}>
                          <PostCard
                            author={item.author.displayName}
                            handle={item.author.handle}
                            did={item.author.did}
                            comments={item.comments}
                            likes={item.likes}
                            caption={item.caption.text}
                            image={item.image.embed.images[0].thumb}
                            profileImg={item.author.avatar}
                            uri={item.uri}
                            cid={item.cid}
                            repostCount={item.repostCount}
                            reply={item.reply}
                            reason={item.reason}
                            embed={item.embed}
                            indexedAt={item.indexedAt}
                            replyParent={item.replyParent}
                            isFromProfile={false}
                          />
                        </div>
                      );
                    }
                  })
                }
                {isLoading && !(fetchedDataLength < 20) ? (
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
