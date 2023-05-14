import React, { useState, useEffect } from "react";
import { fieldDataProps } from "../../../components/@types/Feed/Feed";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import { BiShare, BiRepost } from "react-icons/bi";
import {
  agent,
  formatDateAgo,
  handleLongText,
  refreshSession,
} from "../../../utils";
import PostLoader from "./PostLoader";
import { userImage } from "../../UI/DefaultUserImage";
// just a random Image I grabbed from the internet to show when no image is provided

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
  const [handleSplit, setHandleSplit] = useState<string | undefined>("");
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
    setHandleSplit(handle.split(".")[0]);
  }, [cid, uri]);

  if (isFetching) {
    return (
      <>
        <PostLoader />
      </>
    );
  }

  return (
    <>
      <div className="w-full bg-white p-5 rounded-xl ">
        {/* if replies available then this runs */}
        {replyParent && (
          <div className="-mx-5 border-b border-slate-200">
            <PostCard
              author={replyParent?.author?.displayName}
              handle={replyParent?.author?.handle}
              comments={replyParent?.replyCount}
              likes={replyParent?.likeCount}
              caption={replyParent?.record?.text}
              image={replyParent?.record?.image?.thumb}
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
        <div className="flex flex-col mt-3">
          {/* Render author's profile image, name and caption */}
          {reason?.by !== undefined && (
            <p className="text-sm text-slate-500 flex flex-row pb-2">
              <BiRepost size={20} /> {` Reposted by ${reason?.by}`}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden">
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
                <div className="text-xl flex flex-col pb-3">
                  <p>{author === undefined ? handleSplit : author}</p>
                  {reply?.by !== undefined && (
                    <div className="text-sm text-slate-500 flex flex-row pb-4">
                      <BiShare /> {` Replied to ${reply?.by}`}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {formatDateAgo(indexedAt)}
              </div>
            </div>
            <div>
              <p
                className="text-lg "
                dangerouslySetInnerHTML={handleLongText(caption)}
              ></p>
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
            <div className="flex flex-row justify-between items-center">
              {/* section of the profileImage,handle,time, */}
              <div className="flex flex-row w-10 h-10 items-center">
                <img
                  className="w-10 h-10 object-cover rounded-full"
                  src={embed?.data?.author?.avatar}
                  alt=""
                />
                <div className="text-lg flex flex-col pl-2">
                  {embed?.data?.author?.displayName}
                </div>
              </div>
              <div>{formatDateAgo(embed?.data?.indexedAt)}</div>
            </div>
            {/* section for text */}
            <div className="text-base">{embed?.data?.value?.text}</div>
            <div>
              {/* section for image if available; */}
              <img src={embed?.data?.embeds[0]?.images[0]?.thumb} alt="" />
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
