import React, { useState, useContext } from "react";
import { appContext } from "../../../context/appContext";

type Props = {};

const TextAreaBox = (props: Props) => {
  const { postText, setPostText } = useContext(appContext);

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  return (
    <textarea
      name="post-textarea"
      id="post-textarea"
      className="w-full h-40 resize-none px-4 py-2 focus:outline-none"
      onChange={handlePost}
      value={postText}
    ></textarea>
  );
};

export default TextAreaBox;
