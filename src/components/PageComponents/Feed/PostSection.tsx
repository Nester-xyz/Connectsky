import React, { useState, useContext, useRef, useEffect } from "react";
import { appContext } from "../../../context/appContext";
import { BlobRef } from "@atproto/api";
import { readFileAsArrayBuffer } from "../../../utils";
import TextAreaBox from "./TextAreaBox";
import { agent, refreshSession } from "../../../utils";
type differentButtonsForFeedProps = {
  name: string;
  icon: JSX.Element | undefined;
  action: () => void;
};

type Props = {
  showImage: boolean;
  setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
  differentButtonsForFeed: differentButtonsForFeedProps[];
  setImage: React.Dispatch<React.SetStateAction<BlobRef | null>>;
  setShowAddPost: React.Dispatch<React.SetStateAction<boolean>>;
};

// the component begins here
const PostSection: React.FC<Props> = ({
  showImage,
  setShowImage,
  differentButtonsForFeed = [],
  setImage,
  setShowAddPost,
}) => {
  const { setPostText, fileRef, setUploadedFile, uploadedFile } =
    useContext(appContext);
  const [imgUpload, setImgUpload] = useState<string>("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    setShowImage(true);
    if (files && files.length > 0) {
      const file = files[0];
      const localImageURL = URL.createObjectURL(file);
      setImgUpload(localImageURL);
      console.log(file.size);
      const fileArrrayBuffer = await readFileAsArrayBuffer(file);
      const fileUint8Array = new Uint8Array(fileArrrayBuffer);
      setUploadedFile(fileUint8Array);
    }
  };

  useEffect(() => {
    const processUploadedFile = async () => {
      if (uploadedFile) {
        console.log(`Uploaded file data is ${uploadedFile}`);
        try {
          await refreshSession();
          if (uploadedFile) {
            const resp = await agent.uploadBlob(uploadedFile, {
              encoding: "image/jpeg",
            });
            const {
              data: { blob: image },
            } = resp;
            setImage(image);
            console.log(image);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    processUploadedFile();
  }, [uploadedFile]);
  return (
    <div className="">
      <div className="w-full">
        <button
          className="px-5 py-1 my-4 rounded-md bg-white border block md:hidden "
          onClick={() => { setShowAddPost(false); setShowImage(false); setImage(null); setPostText(""); setUploadedFile(null), setImgUpload("") }}
        >
          &lt; Go Back
        </button>
        <div className="bg-gray-300 border rounded-md border-gray-300 w-full">
          <TextAreaBox showImage={showImage} imgUpload={imgUpload} />
        </div>
        <div className="flex gap-3 mt-4 flex-wrap">
          {differentButtonsForFeed.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white border rounded-md border-gray-300 flex-1 md:w-48 min-w-[100px]"
              >
                <input
                  type="file"
                  ref={fileRef}
                  onChange={handleFileChange}
                  hidden
                />
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
