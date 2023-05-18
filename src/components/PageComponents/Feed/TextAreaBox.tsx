import React, { useState, useContext, useEffect, useRef } from "react";
import { appContext } from "../../../context/appContext";
import { CiFaceSmile } from "react-icons/ci";
import { useDebounce } from "use-debounce";

type Props = {
  showImage: boolean;
  imgUpload: string;
  ref: React.RefObject<HTMLInputElement>;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
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

const TextAreaBox = ({
  ref,
  showImage,
  imgUpload,
  handleFileChange,
}: Props) => {
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

  const fileRef = useRef(null) as React.RefObject<HTMLInputElement>;

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

        <input type="file" ref={fileRef} onChange={handleFileChange} hidden />
        <div
          className="bg-blue-300 rounded-md w-8 h-8 absolute left-2 bottom-2"
          onClick={() => {
            fileRef.current?.click();
          }}
        ></div>
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
