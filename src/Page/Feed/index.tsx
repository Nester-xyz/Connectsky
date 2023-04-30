import React, { useState, useEffect, useRef } from "react";
import { dummyData } from "./dummyData";
import PostSection from "../../components/PageComponents/Feed/PostSection";
import PostCard from "../../components/PageComponents/Feed/PostCard";
import { BskyAgent, AtpSessionData, AtpSessionEvent } from "@atproto/api";

//  Props = {
//   profileImg?: string;
//   author: string;
//   caption?: string;
//   image?: string;
//   likes: number;
//   comments: number;
// };
interface Author {
    displayName: string;
    avatar: string;
}

interface Caption {
    text: string;
}

interface Image {
    thumb: string;
}

interface Embed {
    images: Image[];
}

interface ImageObject {
    embed: Embed;
}

interface Item {
    author: Author;
    comments: number;
    likes: number;
    caption: Caption;
    image: ImageObject;
}

const differentButtonsForFeed = [
    {
        name: "Media",
        icon: undefined,
        action: () => { },
    },
    {
        name: "Links",
        icon: undefined,
        action: () => { },
    },
    {
        name: "GIF",
        icon: undefined,
        action: () => { },
    },
    {
        name: "Post",
        icon: undefined,
        action: () => { },
    },
];

const feedOptionsButtons = [
    {
        name: "For you",
        filter: "forYou",
        icon: undefined,
    },
    {
        name: "Following",
        filter: "following",
        icon: undefined,
    },
];

const Feed = () => {
    const [filterVariable, setFilterVariable] = useState<string>("forYou");
    const [cursor, setCursor] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [feedData, setFeedData] = useState<Item[]>([]);
    const lastElementRef = useRef<HTMLDivElement | null>(null);

    const agent = new BskyAgent({
        service: "https://bsky.social",
        persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
            console.log("first");
        },
    });

    async function followingFeed() {
        const sessData = localStorage.getItem("sess");
        if (sessData !== null) {
            const sessParse = JSON.parse(sessData);
            await agent.resumeSession(sessParse);
        }
        const { data } = await agent.getTimeline({
            limit: 20,
            cursor: cursor,
        });
        if (data.cursor == null) return;
        setCursor(data.cursor);
        const mappedData: Item[] = data.feed.map((feed: any) => {
            console.log(feed);
            const images = feed.post.embed && 'images' in feed.post.embed ? feed.post.embed.images : [];
            const firstImageThumb = images?.length > 0 ? images[0].thumb : '';

            return {
                author: {
                    displayName: feed.post.author.displayName,
                    avatar: feed.post.author.avatar,
                },
                likes: feed.post.likeCount,
                comments: feed.post.replyCount,
                caption: {
                    text: feed.post.record && "text" in feed.post.record ? feed.post.record.text : "",
                },
                image: {
                    embed: {
                        images: [{ thumb: firstImageThumb }]
                    }
                }
            };
        });
        setFeedData((prevData) => [...prevData, ...mappedData]);
    }
    const observerCallback: IntersectionObserverCallback = (entries) => {
        const firstEntry = entries[0];
        console.log(firstEntry);
        if (firstEntry.isIntersecting) {
            followingFeed();
            setIsLoading(true);
        }
    };
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 });

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
        <div className=" w-full  px-5">
            {/* create the top - post option */}

            <div className="grid grid-cols-4 gap-5 h-screen relative">
                <div className="col-span-4 md:col-span-3 mt-5">
                    <div className="flex gap-3 sticky top-0 pb-2 bg-white">
                        {feedOptionsButtons.map((item, index) => {
                            return (
                                <div key={index}>
                                    <button
                                        className="bg-white border rounded-md border-gray-300 flex-1 md:w-48 min-w-[100px]"
                                        onClick={() => setFilterVariable(item.filter)}
                                    >
                                        {item.name}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <PostSection differentButtonsForFeed={differentButtonsForFeed} />

                    {/* create the feed */}
                    <div className=" rounded-md  w-full flex flex-col gap-5 mt-5">
                        {
                            // here we will map the feed

                            feedData.map((item: Item, index) => {
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
                                            />
                                        </div>
                                    );
                                } else {
                                    return <div key={index}>
                                        <PostCard
                                            author={item.author.displayName}
                                            comments={item.comments}
                                            likes={item.likes}
                                            caption={item.caption.text}
                                            image={item.image.embed.images[0].thumb}
                                            profileImg={item.author.avatar}
                                        />
                                    </div>
                                }
                            })
                        }
                        {isLoading ? "Loading..." : ""}
                    </div>
                </div>
                <div className="bg-slate-50 hidden md:block col-span-1 sticky h-full top-5"></div>
            </div>
        </div>
    );
};

export default Feed;
