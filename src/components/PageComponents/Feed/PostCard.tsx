import React, { useState, useEffect } from "react";
import { fieldDataProps } from "../../../components/@types/Feed/Feed";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import { BiRepost } from "react-icons/bi";
import { agent, handleLinks, refreshSession } from "../../../utils";
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
}: fieldDataProps) => {
  const [like, setLike] = useState(false);
  const [repost, setRepost] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [repostCnt, setRepostCnt] = useState(repostCount);
  const [isFetching, setIsFetching] = useState(true);
  const [handleSplit, setHandleSplit] = useState("");
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
    setHandleSplit(handle.split(".")[0]);
    async function dataFetcher() {
      setIsFetching(true);
      await checkAlreadyLiked();
      await checkAlreadyRepost();
      setIsFetching(false);
    }
    dataFetcher();
  }, [cid, uri]);

  if (isFetching) {
    return (
      <>
        <PostLoader />
      </>
    );
  }

  return (
    <div className="w-full bg-white p-5 rounded-md border-b border-slate-200">
      <div className="flex">
        {/* Render author's profile image, name and caption */}
        <div className="flex flex-col gap-2">
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
            <p className="text-xl">
              {author === undefined ? handleSplit : author}
            </p>
          </div>
          <div>
            <p
              className="text-lg "
              dangerouslySetInnerHTML={handleLinks(caption)}
            ></p>
          </div>
        </div>
      </div>

      {image?.length == 0 ? (
        ""
      ) : (
        <div>
          {/* Render the post image */}
          <div className="w-full aspect-video overflow-hidden">
            <img src={image} alt="" className="w-full h-full object-contain" />
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
  );
};

export default PostCard;
