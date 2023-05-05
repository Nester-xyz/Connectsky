import React, { useState, useContext, useEffect } from "react";
import { appContext } from "../../../context/appContext";

import { useDebounce } from "use-debounce";

type Props = {
  showImage: boolean;
};

const TextAreaBox = ({ showImage }: Props) => {
  const { postText, setPostText } = useContext(appContext);

  // this is just a local declaration. It will change in the future
  const [postTextLocal, setPostTextLocal] = useState("");

  const [debouncedPostText] = useDebounce(postTextLocal, 1000);

  useEffect(() => {
    setPostText(debouncedPostText);
  }, [debouncedPostText]);

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostTextLocal(e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <textarea
        name="post-textarea"
        id="post-textarea"
        className="w-full h-40 resize-none px-4 py-2 focus:outline-none"
        onChange={handlePost}
        value={postTextLocal}
      ></textarea>
      {showImage && (
        <div className="border w-40 h-40 overflow-x-hidden items-center"></div>
      )}
    </div>
  );
};

export default TextAreaBox;
