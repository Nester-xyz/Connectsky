import React, { useState, useContext, useEffect, useRef } from "react";
import { appContext } from "../../../context/appContext";
import { CiFaceSmile } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import { useDebounce } from "use-debounce";

type Props = {
  showImage: boolean;
  imgUpload: string;
};

const TextAreaBox = ({ showImage, imgUpload }: Props) => {
  const { postText, setPostText } = useContext(appContext);

  const textBox = useRef<HTMLTextAreaElement>(null);
  const emoji = useRef<HTMLDivElement>(null);

  const [postTextLocal, setPostTextLocal] = useState("");
  const [debouncedPostText] = useDebounce(postTextLocal, 1000);
  const [showEmoji, setShowEmoji] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    setPostText(debouncedPostText);
  }, [debouncedPostText]);

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const onEmojiClick = (emojiObject: any) => {
    setPostText(postText + emojiObject.emoji);
    setShowEmoji(false);
  };

  useEffect(() => {
    if (showEmoji && textBox.current && emoji.current) {
      const textBoxRect = textBox.current.getBoundingClientRect();
      const { style } = emoji.current;

      console.log(textBoxRect.left, textBoxRect.top, textBoxRect.height);

      style.position = "absolute";
      style.left = `${textBoxRect.left + textBox.current.clientLeft}px`;
      style.top = `${
        textBoxRect.top + textBoxRect.height + textBox.current.clientTop
      }px`;
    }
  }, [showEmoji, cursorPosition]);

  return (
    <div className="flex flex-col items-center relative">
      <textarea
        ref={textBox}
        name="post-textarea"
        id="post-textarea"
        className="w-full h-56 resize-none px-4 py-2 rounded-xl focus:outline-none"
        onChange={handlePost}
        value={postText}
        onClick={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setCursorPosition(target.selectionStart);
        }}
      ></textarea>
      <div className="absolute mt-5 ml-5" ref={emoji}>
        {showEmoji && <EmojiPicker onEmojiClick={onEmojiClick} />}
      </div>
      <div
        className="rounded-full w-8 h-8 absolute right-2 bottom-2"
        onClick={() => {
          setShowEmoji(!showEmoji);
        }}
      >
        <CiFaceSmile className="w-full h-full" />
      </div>
      <div className="bg-blue-300 rounded-md w-8 h-8 absolute left-2 bottom-2"></div>
      {showImage && (
        <div className="border w-40 h-full overflow-hidden items-center">
          <img src={imgUpload} alt="broken" className="object-contain w-40" />
        </div>
      )}
    </div>
  );
};

export default TextAreaBox;
