import React, { useEffect, useState, useRef } from "react";
import PostLoader from "../../components/PageComponents/Feed/PostLoader";
import { agent, refreshSession } from "../../utils";
import { dataGotFromApi } from "../../components/@types/Feed/Feed";
import PostCard from "../../components/PageComponents/Feed/PostCard";
type Props = {};

const index = (props: Props) => {
  const [userDiD, setUserDiD] = useState<string | undefined>("");
  const [displayName, setDisplayName] = useState<string | undefined>("");
  const [handle, setHandle] = useState<string | undefined>("");
  const [avatar, setAvatar] = useState<string | undefined>("");
  const [followersCount, setFollowersCount] = useState<Number | undefined>(0);
  const [followsCount, setFollowsCount] = useState<Number | undefined>(0);
  const [postsCount, setPostsCount] = useState<Number | undefined>(0);
  const [description, setDescription] = useState<string | undefined>("");
  const [cursor, setCursor] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedData, setFeedData] = useState<dataGotFromApi[]>([]);
  const [fetchedDataLength, setFetchedDataLength] = useState(21);
  const lastElementRef = useRef<HTMLDivElement | null>(null);


  function setUserDid() {
    const did = localStorage.getItem("did");
    if (did === null) return;
    console.log("here")
    setUserDiD(did);
  }
  async function fetchAuthorData() {
    try {
      setUserDid();
      if (userDiD === undefined) return;
      if (userDiD === "") return;
      await refreshSession();
      const { data } = await agent.getProfile({ actor: userDiD });
      console.log(data);
      setAvatar(data.avatar)
      setDescription(data.description)
      setDisplayName(data.displayName);
      setHandle(data.handle)
      setFollowersCount(data.followersCount)
      setFollowsCount(data.followsCount)
      setPostsCount(data.postsCount)
    } catch (error) {
      console.log(error);
    }
  }



  async function fetchAuthorFeed() {
    try {
      const did = localStorage.getItem("did");
      if (did === null) return;
      setUserDiD(did);
      await refreshSession();
      const { data } = await agent.getAuthorFeed({ actor: did, limit: 20, cursor: cursor })
      if (data.cursor == null) return;
      console.log("Author feed", data)
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
          },
          reply: {
            text: feed.reply?.parent?.record?.text,
            by: feed.reply?.parent?.author?.displayName,
          },
          author: {
            displayName: feed.post.author.displayName,
            avatar: feed.post.author.avatar,
            handle: feed.post.author.handle,
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
      fetchAuthorFeed();
      setIsLoading(true);
    }
  };
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 1,
  });
  useEffect(() => {
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
    fetchAuthorData();
  }, [userDiD])

  return (
    <div className="p-5">
      {/* cover */}

      <div className="bg-slate-50 w-full h-56 relative">
        {/* <img src={} alt="" /> //cover image */}
        <div className="px-5 py-1 border first-letter:rounded-md absolute right-5 top-5">
          Follow
        </div>
        {/* profile */}
        <div className="w-32 bg-slate-200 aspect-square rounded-full absolute left-10 -bottom-16  shadow-lg"><img src={avatar} alt="" className="rounded-full" /></div>
      </div>

      {/* profile details */}
      <div className="flex flex-col gap-3 mt-16">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{displayName}</div>
          <div className="text-sm text-slate-500">@{handle}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm">Bio</div>
          <div className="text-sm">
            {description}
          </div>
        </div>
      </div>
      {/* profile stats */}
      <div className="flex gap-2 items.center pt-1">
        <div>{followersCount?.toString()} <span className="text-slate-500">followers</span></div>
        <div>{followsCount?.toString()} <span className="text-slate-500">following</span></div>
        <div>{postsCount?.toString()} <span className="text-slate-500">posts</span></div>
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
                  />
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <PostCard
                    author={item.author.displayName}
                    handle={item.author.handle}
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
