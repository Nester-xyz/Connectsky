import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";

type Props = {
  reply: string;
  image?: string;
  post?: any;
};

const ReplyInnerPOst = ({ reply, image, post }: Props) => {
  console.log(reply);
  return (
    <div className="w-full py-2 ml-2 px-2 shadow-custom rounded-lg mt-2">
      <div className="flex w-full gap-2">
        <div className="w-full">
          <div className="break-words w-full  mb-4 -mt-4 opacity-90 rounded-md">
            <div className="ml-7">{reply}</div>
          </div>
          <div className="flex w-full justify-between px-6">
            <div>
              <div className="flex flex-col items-center">
                <div className="text-lg flex items-center">
                  <FiMessageCircle />&nbsp;<p className='text-sm'>{post?.replyCount}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <div className="text-xl flex items-center">
                  <BiRepost />&nbsp; <p className='text-sm'>{post?.repostCount}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <div className="text-lg flex items-center">
                  <AiOutlineHeart />&nbsp; <p className='text-sm'>{post?.likeCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyInnerPOst;
