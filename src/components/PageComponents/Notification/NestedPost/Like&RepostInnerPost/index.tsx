import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";

type Props = {
  reply?: string;
  image?: string;
  ogText?: any;
};

const LikeInnerPost = ({ reply, image, ogText }: Props) => {
  console.log(ogText);
  return (
    <div className="w-full py-2 ml-2 px-2 shadow-custom opacity-70 rounded-lg mt-2">
      <div className="flex w-full gap-2">
        <div className="w-full -mt-5">
          <div className="ml-7">
            <div className="line-clamp-2 w-full rounded-md">
              {!image && ogText.record?.text}
            </div>
            <div className="ml-0.25 mt-1">
              {ogText?.embed?.images && ogText?.embed?.images[0]?.thumb && (
                <img
                  src={ogText.embed.images[0].thumb}
                  alt={reply}
                  className="shadow-sm"
                  width={100}
                  height={100}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeInnerPost;
