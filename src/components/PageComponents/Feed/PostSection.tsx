import React, { useState, useContext } from "react";
import { appContext } from "../../../context/appContext";


type differentButtonsForFeedProps = {
  name: string;
  icon: JSX.Element | undefined;
  action: () => void;
};

type Props = {
  differentButtonsForFeed: differentButtonsForFeedProps[];
};

const PostSection: React.FC<Props> = ({ differentButtonsForFeed = [] }) => {
  const { postText, setPostText } = useContext(appContext);

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value)
  }
  return (
    <div className="">
      <div className="w-full">
        <div className="bg-gray-300 border rounded-md border-gray-300 w-full">
          <textarea
            name="post-textarea"
            id="post-textarea"
            className="w-full h-40 resize-none px-4 py-2 focus:outline-none"
            onChange={handlePost}
            value={postText}
          ></textarea>
        </div>
        <div className="flex gap-3 mt-4 flex-wrap">
          {differentButtonsForFeed.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white border rounded-md border-gray-300 flex-1 md:w-48 min-w-[100px]"
              >
                <button
                  className="flex gap-2 items-center justify-center w-full py-2"
                  onClick={item.action}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostSection;
