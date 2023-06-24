import React, { useContext, useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { BiShare } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { fieldDataProps } from "../../../components/@types/Feed/Feed";
import { appContext } from "../../../context/appContext";
import {
  agent,
  formatDateAgo,
  handleLinks,
  handleSplit,
  refreshSession,
} from "../../../utils";
import { userImage } from "../../UI/DefaultUserImage";
import "../../UI/static.css";
import PostLoader from "./PostLoader";
// just a random Image I grabbed from the internet to show when no image is provided

const MAX_WORDS = 40; // Maximum number of words to display initially
const PostCard = ({
  author,
  handle,
  did,
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
  isFromProfile,
}: fieldDataProps) => {
  const [like, setLike] = useState(false);
  const [repost, setRepost] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [repostCnt, setRepostCnt] = useState(repostCount);
  const [isFetching, setIsFetching] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const [showEmbedFullText, setShowEmbedFullText] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  // const [handleSplit, setHandleSplit] = useState<string | undefined>("");
  const navigate = useNavigate();
  const { setActivePage } = useContext(appContext);
  const params = useParams();
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

  const handleLongText = (text: string | undefined, isEmbed: boolean) => {
    if (!text?.length) return;
    // console.log(showFullText);

    // firstly i should handle the \n break line thing
    const processedText = text.replaceAll(/\n/g, " <br/> ");
    const wordListLong = processedText.split(" ");
    const wordListSmall = processedText.split(" ").slice(0, MAX_WORDS);

    const linkRegex =
      /(https?:\/\/[^\s/$.?#]+\.[^\s/$.?#_]+(?:\/[^\s]*)?)\s*/gi;

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
      if (part === "<br/>") {
        return (
          <span>
            <br />
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
      if (part === "<br/>") {
        return (
          <span>
            <br />
          </span>
        );
      }
      return part + " ";
    });

    const handleToggleText = () => {
      setShowFullText(!showFullText);
    };
    const handleEmbedToggleText = () => {
      setShowEmbedFullText(!showEmbedFullText);
    };
    if (!isEmbed) {
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
        return <div>{processSmall}</div>;
      }
    } else {
      if (wordListLong.length > MAX_WORDS) {
        if (showEmbedFullText) {
          return (
            <>
              {processLong}
              {
                <button
                  onClick={handleEmbedToggleText}
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
                  onClick={handleEmbedToggleText}
                  className="text-sm text-blue-500"
                >
                  See More
                </button>
              }
            </>
          );
        }
      } else {
        return <div>{processSmall}</div>;
      }
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
        {/* {replyParent && (
          <div className="-mx-5 border-b border-slate-200">
            <PostCard
              author={replyParent?.author?.displayName}
              handle={replyParent?.author?.handle}
              did={replyParent?.author?.did}
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
              isFromProfile={isFromProfile}
            />
          </div>
        )} */}
        <div className="flex flex-col mt-3 w-full ">
          {/* Render author's profile image, name and caption */}
          {reason?.by !== undefined && (
            <div className={`text-slate-600 flex flex-row items-center `}>
              <div className="text-base flex items-center">
                <AiOutlineRetweet /> &nbsp;{" "}
              </div>
              <div
                className={`break-all text-sm line-clamp-1 ${
                  reason?.did !== params.did && "cursor-pointer"
                }`}
                onClick={() => {
                  console.log(reason);
                  if (reason?.did == params.did) return;
                  navigate(`/profile/${reason?.did}`);
                  setActivePage("Profile");
                  isFromProfile && window.location.reload();
                }}
              >
                {" "}
                Reposted by{" "}
                <span
                  className={`${
                    reason?.did !== params.did && "hover:underline"
                  }`}
                >
                  {reason?.by}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className={`flex flex-col ${reply?.did ? "ml-3" : ""}`}>
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
                  <div className="text-xl flex flex-col">
                    <div className="flex flex-row-reverse items-center gap-2 bg--300 h-10 flex-nowrap">
                      {/* time stamp */}
                      <div className="flex items-center gap-2">
                        <div>·</div>
                        <div className="text-sm text-slate-500">
                          {formatDateAgo(indexedAt)}
                        </div>
                      </div>

                      {/* handle and username */}
                      <div
                        className={`flex items-center gap-2  ${
                          did !== params.did && "cursor-pointer hover:underline"
                        }`}
                        onClick={() => {
                          console.log(did);
                          if (did == params.did) return;
                          navigate(`/profile/${did}`);
                          setActivePage("Profile");
                          isFromProfile && window.location.reload();
                        }}
                      >
                        <div className="text-md  break-all line-clamp-1">
                          {author === undefined ? handleSplit(handle) : author}
                        </div>
                        <div className="text-sm text-slate-500 break-all line-clamp-1">
                          @{handle}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-14">
                  {reply?.by !== undefined && (
                    <div className="text-slate-600 flex flex-row items-center -mt-2">
                      <div className="text-lg flex items-center">
                        <BiShare /> &nbsp;{" "}
                      </div>
                      <div
                        className={`text-sm break-all line-clamp-1 ${
                          reply?.did !== params.did && "cursor-pointer"
                        }`}
                        onClick={() => {
                          console.log(reply);
                          if (reply?.did == params.did) return;
                          navigate(`/profile/${reply?.did}`);
                          setActivePage("Profile");
                          isFromProfile && window.location.reload();
                        }}
                      >
                        Replied to{" "}
                        <span
                          className={`${
                            reply?.did !== params.did && "hover:underline"
                          }`}
                        >
                          {reply?.by}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`flex ${reply?.did ? "ml-3" : ""}`}>
              <p className="text-[15px] font-light tracking-[.020em] text-slate-800 feed-caption">
                <span
                // dangerouslySetInnerHTML={{
                //   __html: handleLongText(caption),
                // }}
                >
                  {handleLongText(caption, true)}
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
                <div className="aspect-video overflow-hidden">
                  <img
                    src={image}
                    alt=""
                    className="h-full object-contain  cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />
                </div>
              </div>
            )}
        {embed?.$type === "app.bsky.embed.record#view" &&
          embed?.data?.$type !== "app.bsky.feed.defs#generatorView" && (
            <div className="flex flex-col p-4 border border-slate-300 rounded-lg mt-[4px]">
              <div className="flex flex-row justify-between items-center ">
                {/* section of the profileImage,handle,time, */}
                <div className="flex flex-row items-center w-full gap-2">
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
                  <div
                    className={`flex items-center gap-2  ${
                      embed.data?.author?.did !== params.did &&
                      "cursor-pointer hover:underline"
                    }`}
                    onClick={() => {
                      console.log(did);
                      if (embed.data?.author?.did == params.did) return;
                      navigate(`/profile/${embed.data?.author?.did}`);
                      setActivePage("Profile");
                      isFromProfile && window.location.reload();
                    }}
                  >
                    <div className="text-lg break-all line-clamp-1">
                      {embed?.data?.author?.displayName === undefined
                        ? handleSplit(embed?.data?.author?.handle)
                        : embed?.data?.author?.displayName}
                    </div>
                    <div className="text-sm text-slate-500 break-all line-clamp-1">
                      @{embed?.data?.author?.handle}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg">·</div>
                    <div className="text-sm text-slate-500">
                      {formatDateAgo(embed?.data?.indexedAt)}
                    </div>
                  </div>
                </div>
              </div>
              {/* section for text */}
              <div className="text-base mt-1 feed-caption">
                {handleLongText(embed?.data?.value?.text, false)}
              </div>
              <div>
                {/* section for image if available; */}
                {embed.data?.embeds && embed.data?.embeds[0]?.images && (
                  <img src={embed?.data?.embeds[0]?.images[0]?.thumb} alt="" />
                )}
              </div>
            </div>
          )}

        <div>
          {/* Render the number of likes and comments */}
          <div
            className={`flex mt-5 text-xl gap-[4rem] items-center select-none ${
              reply?.did ? "ml-[10px]" : ""
            }`}
          >
            <div className="flex items-center gap-1">
              <FiMessageCircle />
              <p className="text-sm">{comments}</p>
            </div>
            <div className="flex items-center  gap-1">
              <AiOutlineRetweet
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
        {/* Modal here */}
        <div
          id="modal"
          onClick={() => setShowImageModal(false)}
          className={`${
            showImageModal ? "opacity-100" : "opacity-0 pointer-events-none"
          } fixed top-0 left-0 z-40 w-screen h-screen bg-black/70 flex justify-center items-center transition-opacity duration-300`}
        >
          {/* <a
            className="fixed z-90 top-6 right-8 text-white text-5xl font-bold"
            href="javascript:void(0)"
            onClick={() => setShowImageModal(false)}
          >
            HI
          </a> */}
          <div className="relative">
            <div>
              <img
                id="modal-img"
                src={image}
                className=" max-w-[384px] max-h-96 object-contain relative"
              />
              <div className="absolute -top-12 -right-4 w-4 h-4">
                <div
                  className="text-5xl text-white font-bold cursor-pointer"
                  onClick={() => setShowImageModal(false)}
                >
                  &times;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
