import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { BsReplyFill, BsFillChatLeftQuoteFill } from "react-icons/bs";
import { VscMention } from "react-icons/vsc";
import { MdPersonAddAlt1 } from "react-icons/md";

type Props = {
  color: string;
  title: string;
};

const Badges = ({ color, title }: Props) => {
  return (
    <div
      className={`w-4 h-4 ${color} rounded-full items-center absolute text-white -right-0 -bottom-0`}
    >
      {title === "like" && (
        <div className="mt-[0.15rem] ml-[0.13rem]">
          <AiFillHeart />
        </div>
      )}
      {title === "repost" && (
        <div className="mt-[0.05rem] ml-[0.05rem] text-sm">
          <BiRepost />
        </div>
      )}
      {title === "follow" && (
        <div className="mt-[0.1rem] ml-[0.15rem]">
          <MdPersonAddAlt1 />
        </div>
      )}
      {title === "reply" && (
        <div className="mt-[0.1rem] ml-[0.15rem]">
          <BsReplyFill />
        </div>
      )}
      {title === "mention" && (
        <div className="text-[1rem]">
          <VscMention />
        </div>
      )}
    </div>
  );
};

export default Badges;
