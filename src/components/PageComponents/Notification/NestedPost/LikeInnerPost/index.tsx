import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";

type Props = {
  reply: string;
  image?: string;
};

const LikeInnerPost = ({ reply, image }: Props) => {
  return (
    <div className="w-full py-2 ml-2 px-2 shadow-custom border rounded-lg mt-2">
      <div className="flex w-full gap-2">
        <div className="w-full">
          {image && (
            <img
              src={image}
              alt={reply}
              className="opacity-50"
              width={160}
              height={160}
            />
          )}
          <div className="line-clamp-2 w-full bg-slate-200 rounded-md p-1">
            {!image && reply}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeInnerPost;
