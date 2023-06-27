import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import {
  formatDateAgo,
  checkIfAlreadyRepost,
  checkIfLikedApi,
  deleteRepostApi,
  repostApi,
  disLikeApi,
  likeApi,
} from "../../../../../utils";
import PostComments from "../../../Feed/PostComments";
import { LuRepeat2 } from "react-icons/lu";
type Props = {
  reply: string;
  image?: string;
  post?: any;
  uri: string;
  cid: string;
  author: string;
  handle: string;
};

const ReplyInnerPOst = ({
  reply,
  image,
  post,
  uri,
  cid,
  author,
  handle,
}: Props) => {
  console.log(reply);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [like, setLike] = useState(false);
  const [repost, setRepost] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [repostCnt, setRepostCnt] = useState(post.repostCount);
  const [commentCnt, setCommentCnt] = useState(post.replyCount);

  async function handleRepost() {
    try {
      if (repost) {
        setRepost(!repost);
        setRepostCnt((prev: number) => prev - 1);
        await deleteRepostApi(uri, cid);
      } else {
        setRepost(!repost);
        setRepostCnt((prev: number) => prev + 1);
        await repostApi(uri, cid);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getPostLiked() {
    try {
      if (like) {
        setLike(!like);
        setLikeCount((prev: number) => prev - 1);
        await disLikeApi(uri, cid);
      } else {
        setLike(!like);
        setLikeCount((prev: number) => prev + 1);
        await likeApi(uri, cid);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function checkAlreadyLiked() {
    try {
      const alreadyLiked = await checkIfLikedApi(uri, cid);
      setLike(alreadyLiked);
    } catch (error) {
      console.log(error);
    }
  }
  async function checkAlreadyRepost() {
    try {
      const alreadyReposted = await checkIfAlreadyRepost(uri, cid);
      setRepost(alreadyReposted);
    } catch (error) {
      console.log(error);
    }
  }
  const classModal = (
    <div
      onClick={() => {
        // setShowCommentModal(false);
      }}
      className="fixed top-0 left-0 right-0 bottom-0 w-screen z-40 h-screen bg-slate-600 bg-opacity-80 flex justify-center items-center"
    >
      <div
        className=" py-5 px-5"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <PostComments
          setShowCommentModal={setShowCommentModal}
          profileImg={image}
          caption={reply}
          author={author}
          uri={uri}
          cid={cid}
          handle={handle}
          setCommentCnt={setCommentCnt}
        />
      </div>
    </div>
  );

  useEffect(() => {
    async function dataFetcher() {
      setIsFetching(true);
      await checkAlreadyLiked();
      await checkAlreadyRepost();
      setIsFetching(false);
    }
    dataFetcher();
    // setHandleSplit(handle.split(".")[0]);
  }, [cid, uri]);
  return (
    <>
      {showCommentModal && classModal}
      <div className="w-full py-2 ml-2 px-2 shadow-custom rounded-lg mt-2">
        <div className="flex w-full gap-2">
          <div className="w-full">
            <div className="break-words w-full  mb-4 -mt-4 opacity-90 rounded-md">
              <div className="ml-7">{reply}</div>
            </div>
            <div className="flex w-full justify-between pl-[1.5rem] pr-[5rem]">
              <div>
                <div className="flex flex-col items-center">
                  <div
                    className="text-lg flex items-center cursor-pointer mt-[-3.5px]"
                    onClick={() => setShowCommentModal(true)}
                  >
                    <FiMessageCircle />
                    &nbsp;<p className="text-sm">{commentCnt}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center">
                  <div className="text-xl flex items-center">
                    <LuRepeat2
                      className={`cursor-pointer ${
                        repost ? "text-green-500" : ""
                      }`}
                      onClick={handleRepost}
                      style={{ opacity: 0.8 }}
                    />
                    <p className="text-sm">&nbsp;{repostCnt}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center">
                  <div className="text-lg flex items-center">
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
                    <p className="text-sm">&nbsp;{likeCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReplyInnerPOst;
