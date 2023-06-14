import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";

type Props = {
  reply: string;
  image?: string;
};

const ReplyInnerPOst = ({ reply, image }: Props) => {
  return (
    <div className="w-full py-2 ml-2 px-2 shadow-custom rounded-lg mt-2">
      <div className="flex w-full gap-2">
        <div className="w-full">
          <div className="break-words w-full  mb-4 -mt-4 opacity-70 rounded-md">
            <div className="ml-7">{reply}</div>
          </div>
          <div className="flex w-full justify-between px-6">
            <div>
              <div className="flex flex-col items-center">
                <div className="text-lg">
                  <FiMessageCircle />
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <div className="text-xl">
                  <BiRepost />
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <div className="text-lg">
                  <AiOutlineHeart />
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
