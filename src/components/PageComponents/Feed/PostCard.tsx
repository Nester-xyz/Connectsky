import React, { useState, useEffect } from "react";
import { fieldDataProps } from "../../../components/@types/Feed/Feed";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import { BiShare, BiRepost } from "react-icons/bi";
import {
  agent,
  formatDateAgo,
  handleLinks,
  handleSplit,
  refreshSession,
} from "../../../utils";
import PostLoader from "./PostLoader";
import { userImage } from "../../UI/DefaultUserImage";
// just a random Image I grabbed from the internet to show when no image is provided

const MAX_WORDS = 20; // Maximum number of words to display initially
const PostCard = ({
  author,
  handle,
  comments,
  likes,
  caption,
  image,
  profileImg,
  uri,
  cid,
  repostCount,
  reply,
  reason,
  embed,
  indexedAt,
  replyParent,
}: fieldDataProps) => {
  const [like, setLike] = useState(false);
  const [repost, setRepost] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [repostCnt, setRepostCnt] = useState(repostCount);
  const [isFetching, setIsFetching] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  // const [handleSplit, setHandleSplit] = useState<string | undefined>("");
  async function handleRepost() {
    try {
      if (repost) {
        setRepost(!repost);
        setRepostCnt((prev) => prev - 1);
        await refreshSession();
        const res = await agent.repost(uri, cid);
        await agent.deleteRepost(res.uri);
      } else {
        setRepost(!repost);
        setRepostCnt((prev) => prev + 1);
        await refreshSession();
        await agent.repost(uri, cid);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getPostLiked() {
    try {
      if (like) {
        setLike(!like);
        setLikeCount((prev) => prev - 1);
        await refreshSession();
        const res = await agent.like(uri, cid);
        await agent.deleteLike(res.uri);
      } else {
        setLike(!like);
        setLikeCount((prev) => prev + 1);
        await refreshSession();
        await agent.like(uri, cid);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function isAvailable(handle: string) {
    const localHandle = localStorage.getItem("handle");
    return handle === localHandle;
  }

  async function checkAlreadyLiked() {
    try {
      const { data } = await agent.getLikes({ uri, cid });
      const alreadyLiked = data.likes.some((item) =>
        isAvailable(item.actor.handle)
      );
      setLike(alreadyLiked);
    } catch (error) {
      console.log(error);
    }
  }
  async function checkAlreadyRepost() {
    try {
      const { data } = await agent.getRepostedBy({ uri, cid });
      const alreadyReposted = data.repostedBy.some((item) =>
        isAvailable(item.handle)
      );
      setRepost(alreadyReposted);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function dataFetcher() {
      setIsFetching(true);
      await checkAlreadyLiked();
      await checkAlreadyRepost();
      setIsFetching(false);
    }
    dataFetcher();
    if (handle === undefined) return undefined;

    // setHandleSplit(handle.split(".")[0]);
  }, [cid, uri]);

  if (isFetching) {
    return (
      <>
        <PostLoader />
      </>
    );
  }

  const handleLongText = (text: string | undefined) => {
    if (!text?.length) return;
    console.log(showFullText);
    const wordListLong = text.split(" ");
    const wordListSmall = text.split(" ").slice(0, MAX_WORDS);

    const linkRegex =
      /(\bhttps?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|.]*)\S*/gi;

    const processSmall = wordListSmall.map((part, index) => {
      if (linkRegex.test(part)) {
        return (
          <span className="break-all" key={index}>
            <a href={part} className="text-indigo-600" target="_blank">
              {part + " "}
            </a>
          </span>
        );
      }
      return part + " ";
    });

    const processLong = wordListLong.map((part, index) => {
      if (linkRegex.test(part)) {
        return (
          <span className="break-all" key={index}>
            <a href={part} className="text-indigo-600" target="_blank">
              {part + " "}
            </a>
          </span>
        );
      }
      return part + " ";
    });

    const handleToggleText = () => {
      setShowFullText(!showFullText);
    };

    if (wordListLong.length > MAX_WORDS) {
      if (showFullText) {
        return (
          <>
            {processLong}
            {
              <button
                onClick={handleToggleText}
                className="text-sm text-blue-500"
              >
                See Less
              </button>
            }
          </>
        );
      } else {
        return (
          <>
            {processSmall}
            {
              <button
                onClick={handleToggleText}
                className="text-sm text-blue-500"
              >
                See More
              </button>
            }
          </>
        );
      }
    } else {
      return <div>{processLong}</div>;
    }

    // const processedLinks = handleLinks(text);
    // const stringWithLinksHandled = processedLinks?.__html || text;

    // const words = stringWithLinksHandled?.split(" ");
    // // const words = text?.split(" ");

    // const handleToggleText = () => {
    //   setShowFullText(!showFullText);
    // };
    // if (words?.length) {
    //   if (words?.length > MAX_WORDS) {
    //     return (
    //       <>
    //         <p>
    //           {showFullText
    //             ? words.join(" ")
    //             : words.slice(0, MAX_WORDS).join(" ")}{" "}
    //           {/* Insert a space character here */}
    //           <button
    //             onClick={handleToggleText}
    //             className="text-sm text-blue-500"
    //           >
    //             {showFullText ? `see less` : "see more"}
    //           </button>
    //         </p>
    //       </>
    //     );
    //   }
    // }
    // if (words === undefined) return;
    // return <p dangerouslySetInnerHTML={{ __html: words.join(" ") }}></p>;
  };

  return (
    <>
      <div className="w-full bg-white px-8 py-3 rounded-xl ">
        {/* if replies available then this runs */}
        {replyParent && (
          <div className="-mx-5 border-b border-slate-200">
            <PostCard
              author={replyParent?.author?.displayName}
              handle={replyParent?.author?.handle}
              comments={replyParent?.replyCount}
              likes={replyParent?.likeCount}
              caption={replyParent?.record?.text}
              image={
                replyParent?.embed?.images && "images" in replyParent.embed
                  ? replyParent.embed.images[0].thumb
                  : []
              }
              profileImg={replyParent?.author?.avatar}
              uri={replyParent?.uri}
              cid={replyParent?.cid}
              repostCount={replyParent?.repostCount}
              reply={replyParent?.reply}
              reason={replyParent?.reason}
              embed={{
                $type: replyParent?.embed?.$type,
                data: replyParent?.embed?.record,
              }}
              indexedAt={replyParent?.indexedAt}
              replyParent={replyParent?.replyParent}
            />
          </div>
        )}
        <div className="flex flex-col mt-3 w-full ">
          {/* Render author's profile image, name and caption */}
          {reason?.by !== undefined && (
            <div className="text-sm text-slate-500 flex flex-row items-center ">
              <BiRepost /> &nbsp;{" "}
              <div className="break-all line-clamp-1">{` Reposted by ${reason?.by}`}</div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden min-w-fit">
                    {/* <img src={userImage} alt="" className="w-10 h-10 object-cover" /> */}

                    {profileImg ? (
                      <img
                        src={profileImg}
                        alt=""
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      <img
                        src={userImage}
                        alt=""
                        className="w-10 h-10 object-cover"
                      />
                    )}
                  </div>
                  <div className="text-xl flex flex-col  w-full">
                    <div className="flex flex-row-reverse items-center gap-2 bg--300 h-10 flex-nowrap">
                      {/* time stamp */}
                      <div className="flex items-center gap-2">
                        <div>·</div>
                        <div className="text-sm text-slate-500">
                          {formatDateAgo(indexedAt)}
                        </div>
                      </div>

                      {/* handle and username */}
                      <div className="flex items-center gap-2">
                        <div className="text-md whitespace-nowrap">
                          {author === undefined ? handleSplit(handle) : author}
                        </div>
                        <div className="text-sm text-slate-500 break-all line-clamp-1">
                          @{handle}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-10">
                  {reply?.by !== undefined && (
                    <div className="text-sm text-slate-500 flex flex-row items-center ">
                      <BiShare /> &nbsp;{" "}
                      <div className="break-all line-clamp-1">{` Replied to ${reply?.by}`}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex">
              <p className="text-lg">
                <span
                // dangerouslySetInnerHTML={{
                //   __html: handleLongText(caption),
                // }}
                >
                  {handleLongText(caption)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {image?.length == 0
          ? ""
          : image && (
              <div>
                {/* Render the post image */}
                <div className="w-full aspect-video overflow-hidden">
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
        {embed?.$type === "app.bsky.embed.record#view" && (
          <div className="flex flex-col p-4 border-2 border-slate-200 rounded-lg drop-shadow-md">
            <div className="flex flex-row justify-between items-center ">
              {/* section of the profileImage,handle,time, */}
              <div className="flex flex-row items-center w-full">
                <div className="w-10 h-10 min-w-fit">
                  {embed?.data?.author?.avatar ? (
                    <img
                      className="w-10 h-10 object-cover rounded-full"
                      src={embed?.data?.author?.avatar}
                      alt=""
                    />
                  ) : (
                    <img
                      src={userImage}
                      alt=""
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  )}
                </div>
                <div className=" w-full text-lg pl-2 break-all line-clamp-1 ">
                  {embed?.data?.author?.displayName === undefined
                    ? handleSplit(embed?.data?.author?.handle)
                    : embed?.data?.author?.displayName}
                </div>
              </div>
              <div>{formatDateAgo(embed?.data?.indexedAt)}</div>
            </div>
            {/* section for text */}
            <div className="text-base">
              {handleLongText(embed?.data?.value?.text)}
            </div>
            <div>
              {/* section for image if available; */}
              {embed.data?.embeds[0]?.images && (
                <img src={embed?.data?.embeds[0]?.images[0]?.thumb} alt="" />
              )}
            </div>
          </div>
        )}

        <div>
          {/* Render the number of likes and comments */}
          <div className="flex mt-5 text-xl gap-16 items-center select-none">
            <div className="flex items-center gap-1">
              <FiMessageCircle />
              <p className="text-sm">{comments}</p>
            </div>
            <div className="flex items-center text-3xl gap-1">
              <BiRepost
                className={`cursor-pointer ${repost ? "text-green-500" : ""}`}
                onClick={handleRepost}
              />
              <p className="text-sm">{repostCnt}</p>
            </div>
            <div className="flex items-center gap-1">
              {like ? (
                <AiFillHeart
                  onClick={getPostLiked}
                  className="text-red-500 cursor-pointer"
                />
              ) : (
                <AiOutlineHeart
                  onClick={getPostLiked}
                  className="cursor-pointer"
                />
              )}
              <p className="text-sm">{likeCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
