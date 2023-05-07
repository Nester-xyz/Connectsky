import React, { useState, useContext, useEffect } from "react";
import { appContext } from "../../../context/appContext";

import { useDebounce } from "use-debounce";

type Props = {
  showImage: boolean;
  imgUpload: string;
};

const TextAreaBox = ({ showImage, imgUpload }: Props) => {
  const { postText, setPostText } = useContext(appContext);

  // this is just a local declaration. It will change in the future
  const [postTextLocal, setPostTextLocal] = useState("");

  const [debouncedPostText] = useDebounce(postTextLocal, 1000);

  useEffect(() => {
    setPostText(debouncedPostText);
  }, [debouncedPostText]);

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <textarea
        name="post-textarea"
        id="post-textarea"
        className="w-full h-40 resize-none px-4 py-2 focus:outline-none"
        onChange={handlePost}
        value={postText}
      ></textarea>
      {showImage && (
        <div className="border w-40 h-full overflow-hidden items-center">
          <img src={imgUpload} alt="broken" className='object-contain w-40' />
        </div>
      )}
    </div>
  );
};

export default TextAreaBox;
