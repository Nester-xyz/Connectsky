import React, { useState, useContext, useEffect, useRef } from "react";
import { appContext } from "../../../context/appContext";
import { useDebounce } from "use-debounce";

type Props = {
  showImage: boolean;
  imgUpload: string;
};

const arrayOfRandomPlaceholders = [
  "What's on your mind?",
  "If you build it, they will come.",
  "The stuff that dreams are made of.",
  "Made it, Ma! Top of the world.",
  "Don't wait for opportunity. Create it.",
  "Keep calm and carry on.",
  "Believe you can, and you're halfway there.",
];

const TextAreaBox = ({ showImage, imgUpload }: Props) => {
  const { postText, setPostText } = useContext(appContext);

  const textBox = useRef<HTMLTextAreaElement>(null);

  const [postTextLocal, setPostTextLocal] = useState("");
  const [debouncedPostText] = useDebounce(postTextLocal, 1000);
  const [cursorPosition, setCursorPosition] = useState(0);

  const randomPlacholder =
    arrayOfRandomPlaceholders[
      Math.floor(Math.random() * arrayOfRandomPlaceholders.length)
    ];
  useEffect(() => {
    setPostText(debouncedPostText);
  }, [debouncedPostText]);

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
    setCursorPosition(e.target.selectionStart);
    console.log(e.target.selectionStart);
  };

  useEffect(() => {
    const textBoxReact = textBox.current?.selectionStart;
    console.log(textBoxReact + "textBox");

    // console.log(textBoxRect.left, textBoxRect.top, textBoxRect.height);

    // style.position = "absolute";
    // style.left = `${textBoxReact}`;
    // style.top = `${
    //   textBoxRect.top + textBoxRect.height + textBox.current.clientTop
    // }px`;
  }, []);

  return (
    <>
      <div className="flex flex-col items-center relative">
        <textarea
          ref={textBox}
          name="post-textarea"
          id="post-textarea"
          placeholder={randomPlacholder}
          className="w-full h-40 resize-none px-4 py-2 rounded-xl focus:outline-none"
          onChange={handlePost}
          value={postText}
          onClick={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setCursorPosition(target.selectionStart);
          }}
        ></textarea>

        {showImage && (
          <div className="border w-40 h-full overflow-hidden items-center">
            <img src={imgUpload} alt="broken" className="object-contain w-40" />
          </div>
        )}
      </div>
    </>
  );
};

export default TextAreaBox;
