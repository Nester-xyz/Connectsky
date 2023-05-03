import React, { useState, useContext, useRef, useEffect } from "react";
import { appContext } from "../../../context/appContext";
import { BskyAgent, AtpSessionData, AtpSessionEvent, AppBskyEmbedImages, BlobRef } from "@atproto/api";
import { readFileAsArrayBuffer } from "../../../utils";
type differentButtonsForFeedProps = {
  name: string;
  icon: JSX.Element | undefined;
  action: () => void;
};

type Props = {
  differentButtonsForFeed: differentButtonsForFeedProps[];
  setImage: (param: BlobRef) => void;
};

const PostSection: React.FC<Props> = ({ differentButtonsForFeed = [], setImage }) => {
  const { postText, setPostText, fileRef, setUploadedFile, uploadedFile } = useContext(appContext);


  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value)
  }
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log(files)
    if (files && files.length > 0) {
      const file = files[0];
      console.log(file.size);
      const fileArrrayBuffer = await readFileAsArrayBuffer(file);
      const fileUint8Array = new Uint8Array(fileArrrayBuffer);
      setUploadedFile(fileUint8Array);
    }
  };

  const agent = new BskyAgent({
    service: "https://bsky.social",
    persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
      console.log("first");
      const sessData = JSON.stringify(sess)
      localStorage.setItem("sess", sessData)
    },
  });

  useEffect(() => {
    const processUploadedFile = async () => {
      if (uploadedFile) {
        console.log(`Uploaded file data is ${uploadedFile}`);
        try {
          const sessData = localStorage.getItem("sess");
          if (sessData !== null) {
            const sessParse = JSON.parse(sessData);
            await agent.resumeSession(sessParse);
          }
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
    }
    processUploadedFile();
  }, [uploadedFile]);
  return (
    <div className="">
      <div className="w-full">
        <div className="bg-gray-300 border rounded-md border-gray-300 w-full">
          <textarea
            name="post-textarea"
            id="post-textarea"
            className="w-full h-40 resize-none px-4 py-2 focus:outline-none"
            onChange={handlePost}
            value={postText}
          ></textarea>
        </div>
        <div className="flex gap-3 mt-4 flex-wrap">
          {differentButtonsForFeed.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white border rounded-md border-gray-300 flex-1 md:w-48 min-w-[100px]"
              >
                <input type="file" ref={fileRef} onChange={handleFileChange} hidden />
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
