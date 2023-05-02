import React, { useState, useContext } from "react";
import { appContext } from "../../../context/appContext";
import TextAreaBox from "./TextAreaBox";

type differentButtonsForFeedProps = {
  name: string;
  icon: JSX.Element | undefined;
  action: () => void;
};

type Props = {
  differentButtonsForFeed: differentButtonsForFeedProps[];
};

const PostSection: React.FC<Props> = ({ differentButtonsForFeed = [] }) => {
  return (
    <div className="">
      <div className="w-full">
        <div className="bg-gray-300 border rounded-md border-gray-300 w-full">
          <TextAreaBox />
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
