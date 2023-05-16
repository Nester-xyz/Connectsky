import React, { useContext, useEffect, useRef } from "react";
import { appContext } from "../../../context/appContext";

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

  const randomPlacholder =
    arrayOfRandomPlaceholders[
      Math.floor(Math.random() * arrayOfRandomPlaceholders.length)
    ];

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  useEffect(() => {
    const textBoxReact = textBox.current?.selectionStart;
    console.log(textBoxReact + "textBox");
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
