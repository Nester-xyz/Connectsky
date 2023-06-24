import { useEffect } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";
import { formatDateAgo } from "../../../../../utils";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { appContext } from "../../../../../context/appContext";
type Props = {
  reply: string;
  post: any;
};

const QuotePost = ({ reply, post }: Props) => {
  const navigate = useNavigate();
  const { setActivePage } = useContext(appContext);
  console.log(post);
  return (
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
                <div className="text-lg flex items-center">
                  <FiMessageCircle />
                  &nbsp;<p className="text-sm">{post.replyCount}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <div className="text-xl flex items-center">
                  <BiRepost />
                  &nbsp; <p className="text-sm">{post.repostCount}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <div className="text-lg flex items-center">
                  <AiOutlineHeart />
                  &nbsp; <p className="text-sm">{post.likeCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePost;
