import React, { useState, useEffect } from "react";
import { agent, refreshSession, formatDateAgo } from "../../../utils";
import ReplyInnerPOst from "./NestedPost/ReplyInnerPost";
import LikeInnerPost from "./NestedPost/Like&RepostInnerPost";
import Badges from "./Badges";
import QuotePost from "./NestedPost/QuotePost";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { appContext } from "../../../context/appContext";
import { userImage } from "../../UI/DefaultUserImage";
type NotificationCardProps = {
  image: string;
  title: "repost" | "follow" | "reply" | "like" | "mention" | "quote";
  author: string;
  handle: string;
  authorDiD: string;
  createdAt: Date;
  reply: string;
  reasonSubject: string;
  post: any;
  uri: string;
  cid: string;
};

const NotificationCard = ({
  image,
  title,
  author,
  handle,
  createdAt,
  reply,
  authorDiD,
  reasonSubject,
  post,
  uri,
  cid,
}: NotificationCardProps) => {
  const [handleSplit, setHandleSplit] = useState("");
  const [ogText, setOgText] = useState<any | unknown>({});
  const [isAvailabePost, setIsAvailabePost] = useState(true);
  const { setActivePage } = useContext(appContext);
  const navigate = useNavigate();
  useEffect(() => {
    setHandleSplit(handle.split(".")[0]);
    setOgText(post);
  }, []);

  let reason = "";
  let color = "";
  switch (title) {
    case "repost": {
      color = "bg-blue-500";
      reason = "reposted your post!";
      break;
    }
    case "follow": {
      color = "bg-blue-500";
      reason = "follows you!";
      break;
    }
    case "reply": {
      color = "bg-green-600";
      reason = "replied on your post!";
      break;
    }
    case "like": {
      color = "bg-red-500";
      reason = "liked your post!";
      break;
    }
    case "mention": {
      color = "bg-blue-500";
      reason = "mentioned you on a post!";
      break;
    }
    default: {
      break;
    }
  }

  return (
    <div className="bg-white shadow-custom rounded-xl px-2">
      <div className="flex flex-row gap-5 py-2 items-center justify-between">
        {/* left side for the image */}
        <div className="flex flex-row relative items-center">
          <div className="relative ">
            <div className="rounded-full w-12 h-12 overflow-hidden">
              <img src={image === undefined ? userImage : image} alt={title} />
            </div>
            <Badges title={title} color={color} />
          </div>
          {/* <div
            className={`absolute bottom-0 right-0 w-6 h-6  rounded-full ${color}`}
          >
          </div> */}
          <div className="flex flex-col px-2 py-2">
            <div
              className="flex gap-2 cursor-pointer hover:underline"
              onClick={() => {
                console.log(authorDiD);
                navigate(`/profile/${authorDiD}`);
                setActivePage("Profile");
              }}
            >
              <p className="line-clamp-1 break-all">
                {author === undefined ? handleSplit : author}
              </p>
              {title == "quote" && (
                <div className="text-slate-500 break-all line-clamp-1">
                  @{handle}
                </div>
              )}
            </div>
            <p className="text-blue-800 line-clamp-2">{reason}</p>
          </div>
        </div>

        {/* right side for the title and description */}
        <div className="flex justify-between">
          <span>{formatDateAgo(createdAt)}</span>
        </div>
      </div>
      {isAvailabePost && (
        <div
          className={`${title === "reply" ||
            title === "like" ||
            title === "repost" ||
            title === "mention" ||
            title === "quote"
            ? "block"
            : "hidden"
            } px-3 w-full -mt-3 py-1`}
        >
          {title === "reply" && <ReplyInnerPOst reply={reply} post={post} image={image} uri={uri} cid={cid} author={author} handle={handle} />}
          {title === "mention" && (
            <div className="mt-[-0.2rem]">
              <ReplyInnerPOst reply={reply} post={post} image={image} uri={uri} cid={cid} author={author} handle={handle} />
            </div>
          )}
          {title === "like" && <LikeInnerPost ogText={ogText} />}
          {title === "repost" && <LikeInnerPost ogText={ogText} />}
          {title === "quote" && <QuotePost reply={reply} post={post} image={image} uri={uri} cid={cid} author={author} handle={handle} />}
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
