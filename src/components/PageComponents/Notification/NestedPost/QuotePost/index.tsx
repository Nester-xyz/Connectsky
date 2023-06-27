import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import { formatDateAgo, checkIfAlreadyRepost, checkIfLikedApi, deleteRepostApi, repostApi, disLikeApi, likeApi } from "../../../../../utils";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { appContext } from "../../../../../context/appContext";
import PostComments from "../../../Feed/PostComments";
import { LuRepeat2 } from "react-icons/lu";
type Props = {
  reply: string;
  post: any;
  image?: string;
};

const QuotePost = ({ reply, post, image }: Props) => {
  const navigate = useNavigate();
  const { setActivePage } = useContext(appContext);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [like, setLike] = useState(false);
  const [repost, setRepost] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [repostCnt, setRepostCnt] = useState(post.repostCount);

  async function handleRepost() {
    try {
      if (repost) {
        setRepost(!repost);
        setRepostCnt((prev: number) => prev - 1);
        await deleteRepostApi(post.uri, post.cid);
      } else {
        setRepost(!repost);
        setRepostCnt((prev: number) => prev + 1);
        await repostApi(post.uri, post.cid);
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
        await disLikeApi(post.uri, post.cid);
      } else {
        setLike(!like);
        setLikeCount((prev: number) => prev + 1);
        await likeApi(post.uri, post.cid);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function checkAlreadyLiked() {
    try {
      const alreadyLiked = await checkIfLikedApi(post.uri, post.cid);
      setLike(alreadyLiked);
    } catch (error) {
      console.log(error);
    }
  }
  async function checkAlreadyRepost() {
    try {
      const alreadyReposted = await checkIfAlreadyRepost(post.uri, post.cid);
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
        <PostComments setShowCommentModal={setShowCommentModal} profileImg={image} caption={reply} author={post.author.displayName} uri={post.uri} cid={post.cid} handle={post.author.handle} />
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
  }, [post.cid, post.uri]);

  return (
    <>
      {showCommentModal && classModal}
      <div className="w-full py-2 ml-2 px-2 shadow-custom rounded-lg mt-2">
        <div className="flex w-full gap-2">
          <div className="w-full">
            <div className="break-words w-full  mb-2 -mt-6 opacity-90 rounded-md">
              <div className="ml-7">{reply}</div>
            </div>
            {/* Section for the card */}
            <div className="w-6/7 bg-slate-100 mx-auto p-2 rounded-md shadow-md ml-7">
              <div
                className="flex gap-2 justify-start items-center cursor-pointer "
                onClick={() => {
                  console.log(post?.author?.did);
                  navigate(`/profile/${post?.author?.did}`);
                  setActivePage("Profile");
                }}
              >
                {/* Author details section */}
                <div className="w-6 h-6">
                  <img
                    src={post.author.avatar}
                    className="rounded-full"
                    alt="avatar"
                  />
                </div>
                <div className="hover:underline flex gap-2">
                  <p className="break-all line-clamp-1 ">
                    {post.author.displayName}
                  </p>
                  <p className="text-slate-500 line-clamp-1 break-all">
                    @{post.author.handle}
                  </p>
                </div>
                <p className="pl-1 text-slate-500">
                  &nbsp; · &nbsp; {formatDateAgo(post.indexedAt)}
                </p>
              </div>
              <div className="w-5/6 mx-auto ml-7 pt-1">
                <p> {post.record.text} </p>
                <div>
                  {post.embed?.images! && post.embed.images[0]?.thumb && (
                    <img
                      src={post.embed.images[0].thumb}
                      alt="embed-image"
                      className="rounded-sm"
                    />
                  )}
                </div>
              </div>
              <div>
                <img src="" alt="" />
              </div>
            </div>

            {/* Section for the buttons */}
            <div className="flex justify-between px-6 pt-4">
              <div>
                <div className="flex flex-col items-center">
                  <div className="text-lg flex items-center cursor-pointer" onClick={() => setShowCommentModal(true)}>
                    <FiMessageCircle />
                    &nbsp;<p className="text-sm">{post.replyCount}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center">
                  <div className="text-xl flex items-center">
                    <LuRepeat2
                      className={`cursor-pointer ${repost ? "text-green-500" : ""}`}
                      onClick={handleRepost}
                      style={{ opacity: 0.8 }}
                    /><p className="text-sm">&nbsp;{repostCnt}</p>
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

export default QuotePost;
