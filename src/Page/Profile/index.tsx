import React, { useEffect, useState, useRef } from "react";
import PostLoader from "../../components/PageComponents/Feed/PostLoader";
import { agent, refreshSession, getUserDid } from "../../utils";
import { dataGotFromApi } from "../../components/@types/Feed/Feed";
import PostCard from "../../components/PageComponents/Feed/PostCard";
import { useParams } from "react-router-dom";
import { userImage } from "../../components/UI/DefaultUserImage";
import "../../components/UI/static.css";

type Props = {};

const index = (props: Props) => {
  const [userDiD, setUserDiD] = useState<string | undefined>("");
  const [displayName, setDisplayName] = useState<string | undefined>("");
  const [handle, setHandle] = useState<string | undefined>("");
  const [avatar, setAvatar] = useState<string | undefined>("");
  const [followersCount, setFollowersCount] = useState<number | undefined>(0);
  const [followsCount, setFollowsCount] = useState<Number | undefined>(0);
  const [postsCount, setPostsCount] = useState<Number | undefined>(0);
  const [description, setDescription] = useState<string | undefined>("");
  const [cursor, setCursor] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedData, setFeedData] = useState<dataGotFromApi[]>([]);
  const [fetchedDataLength, setFetchedDataLength] = useState(21);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const [isFollowing, setisFollowing] = useState<boolean>(false);
  const [followsYou, setfollowsYou] = useState<boolean>(false);
  const [followURI, setFollowURI] = useState<string | undefined>("");
  const [userDID, setUserDID] = useState<string | null>(null);

  const params = useParams();

  async function fetchAuthorData() {
    try {
      // setUserDid();
      if (userDiD === undefined) return;
      if (userDiD === "") return;
      await refreshSession();
      const { data } = await agent.getProfile({ actor: userDiD });
      setFollowURI(data.viewer?.following);
      if (data.viewer?.following !== undefined) {
        setisFollowing(true);
      }
      if (data.viewer?.followedBy !== undefined) {
        setfollowsYou(true);
      }
      setAvatar(data.avatar);
      setDescription(data.description);
      setDisplayName(data.displayName);
      setHandle(data.handle);
      setFollowersCount(data.followersCount);
      setFollowsCount(data.followsCount);
      setPostsCount(data.postsCount);
    } catch (error) {
      console.log(error);
    }
  }

  async function follow() {
    try {
      if (userDiD == null) return;
      await refreshSession();
      const data = await agent.follow(userDiD);
      setisFollowing(true);
      setFollowURI(data.uri);
    } catch (error) {
      console.log(error);
    }
  }

  async function unfollow() {
    try {
      if (followURI == null) return;
      await refreshSession();
      await agent.deleteFollow(followURI);
      setisFollowing(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAuthorFeed() {
    try {
      // const did = localStorage.getItem("did");
      // setUserDiD(params.did);
      if (params.did === null) return;
      await refreshSession();
      const { data } = await agent.getAuthorFeed({
        actor: params.did!,
        limit: 20,
        cursor: cursor,
      });
      if (data.cursor == null) return;
      // console.log("Author feed", data);
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
    } catch (error) {
      console.log(error);
    }
  }

  const observerCallback: IntersectionObserverCallback = (entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting) {
      setUserDiD(params.did);
      fetchAuthorFeed();
      setIsLoading(true);
    }
  };
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 1,
  });
  useEffect(() => {
    setUserDiD(params.did);
    if (!isLoading) {
      fetchAuthorFeed();
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

  useEffect(() => {
    setUserDiD(params.did);
    fetchAuthorData();
    const fetchData = async () => {
      try {
        const did = await getUserDid();
        setUserDID(did);
      } catch (error) {
        console.error("Failed to fetch user DID:", error);
      }
    };

    fetchData();
  }, [userDiD]);

  return (
    <div className="p-5">
      {/* cover */}

      <div className="bg-blue-700 w-full h-32 relative">
        {/* <img src={} alt="" /> //cover image */}
        {/* profile */}
        <div className="flex items-center">
          <div className="flex w-24 bg-slate-200 aspect-square rounded-full absolute left-4 -bottom-12 shadow-lg">
            <img
              src={avatar === undefined ? userImage : avatar}
              alt=""
              className="rounded-full"
            />
          </div>
          {userDID && userDID !== params.did && (
            <button
              onClick={isFollowing ? unfollow : follow}
              className={`px-5 py-1 select-none ${
                isFollowing ? `bg-slate-700` : ` bg-blue-600`
              } cursor-pointer absolute rounded-lg right-10 top-3 mt-[8rem] text-white`}
            >
              {isFollowing ? "Following" : "+ Follow"}
            </button>
          )}
        </div>
      </div>

      {/* profile details */}
      <div className="flex flex-col gap-3 mt-[64px]">
        <div className="flex flex-col">
          <div className="text-2xl display-font ml-2">
            {displayName === undefined ? handle : displayName}
          </div>
          <div className="flex ml-2 gap-2">
            {followsYou ? (
              <button className="bg-slate-200 text-[10px] rounded-md p-1">
                Follows You
              </button>
            ) : null}
            <div className="text-sm text-slate-500">@{handle}</div>
          </div>
        </div>
        <div>
          {/* <div className="text-sm">Bio</div> */}
          <div className="text-sm ml-2">{description}</div>
        </div>
      </div>
      {/* profile stats */}
      <div className="flex gap-8 pt-2 ml-2">
        <div className="flex gap-1 items-center">
          <div className="text-[15px]">{followersCount?.toString()} </div>
          <span className="text-slate-500 text-[13px]">followers</span>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-[15px]">{followsCount?.toString()} </div>
          <span className="text-slate-500 text-[13px]">following</span>
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-[15px]">{postsCount?.toString()} </div>
          <span className="text-slate-500 text-[13px]">posts</span>
        </div>
      </div>

      {/* posts */}
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
                    isFromProfile={true}
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
                    isFromProfile={true}
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
  );
};

export default index;
