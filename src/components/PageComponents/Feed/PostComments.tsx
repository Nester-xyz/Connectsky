import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  CSSProperties,
} from "react";
import { SlClose } from "react-icons/sl";
import { agent, refreshSession, handleSplit } from "../../../utils";
import ClipLoader from "react-spinners/ClipLoader";
import { userImage } from "../../UI/DefaultUserImage";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};
type props = {
  setShowCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  profileImg: string | undefined;
  caption: string | undefined;
  author: string | undefined;
  uri: string | undefined;
  cid: string | undefined;
  handle: string;
  setCommentCnt: React.Dispatch<React.SetStateAction<number>>;
};
const PostComments = ({
  setShowCommentModal,
  profileImg,
  caption,
  author,
  uri,
  cid,
  handle,
  setCommentCnt,
}: props) => {
  const [textFieldValue, setTextFieldValue] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextFieldValue(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    if (textFieldValue.length === 0) return;
    setIsReplying(true);
    try {
      e.preventDefault();
      console.log(textFieldValue);
      if (uri === undefined && cid === undefined) return;
      await refreshSession();
      const response = await agent.post({
        text: textFieldValue,
        reply: {
          root: { uri: uri!, cid: cid! },
          parent: { uri: uri!, cid: cid! },
        },
      });
      console.log(response);
      setCommentCnt((prev) => prev + 1);
      setIsReplying(false);
      setTextFieldValue("");
      setShowCommentModal(false);
    } catch (error) {
      console.log(error);
      setIsReplying(false);
    }
    // Perform your desired operation or API call here
    // Update the status based on the operation result
  };

  useEffect(() => {
    chrome.storage.sync.get(["avatar"], function (result) {
      console.log("Value currently is " + result.avatar);
      setAvatarURL(result.avatar); // Set the state within the callback
      console.log(result.avatar);
    });
  }, []);

  return (
    <div className="flex justify-center items-center p-2 min-w-[400px]">
      <div className="bg-white rounded-lg shadow-lg p-3 w-full">
        {/* Header */}
        <div className="flex justify-between mb-2">
          <button
            onClick={() => setShowCommentModal(false)}
            className=" rounded-md focus:outline-none font-bold text-xl"
          >
            <SlClose size={22} />
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-blue-500 text-white text-md py-2 rounded-full focus:outline-none ${
              isReplying ? "px-[22.75px]" : "px-4"
            }`}
          >
            {isReplying ? (
              <ClipLoader
                color={"#ffffff"}
                loading={isReplying}
                cssOverride={override}
                size={18}
                aria-label="Loading Spinner"
                data-testid="loader"
                speedMultiplier={0.5}
              />
            ) : (
              "Reply"
            )}
          </button>
        </div>

        {/* Data Section */}
        <div className="flex gap-2 border-y-[1px] border-slate-300 py-2">
          <div className="w-10 h-10 flex-shrink-0">
            <img
              src={profileImg === undefined ? userImage : profileImg}
              alt=""
              className="rounded-full w-10 h-10 aspect-square"
            />
          </div>
          <div>
            <p className="text-lg">
              {author === undefined ? handleSplit(handle) : author}
            </p>
            <p className="text-md line-clamp-3">{caption}</p>
          </div>
        </div>

        {/* Text Field */}

        <div className="flex gap-1 items-start my-4">
          <div className="w-10 h-10 flex-shrink-0">
            <img
              src={avatarURL}
              alt="profile-img"
              className="rounded-full w-10 h-10 aspect-square"
            />
          </div>
          <div className="w-full">
            <textarea
              value={textFieldValue}
              onChange={handleInputChange}
              placeholder="Write your reply"
              className="w-full h-20 px-3 py-1 border-none resize-none focus:outline-none text-base"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComments;
