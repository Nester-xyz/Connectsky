import React, { useState, useContext, useRef, useEffect } from "react";
import { appContext } from "../../../context/appContext";
import { BlobRef } from "@atproto/api";
import { readFileAsArrayBuffer } from "../../../utils";
import TextAreaBox from "./TextAreaBox";
import { agent, refreshSession } from "../../../utils";
import ImageCompression from "browser-image-compression";

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
  submitPost: boolean;
};

// the component begins here
const PostSection: React.FC<Props> = ({
  showImage,
  setShowImage,
  differentButtonsForFeed = [],
  setImage,
  setShowAddPost,
  submitPost,
}) => {
  const { postText, setPostText, fileRef, setUploadedFile, uploadedFile } =
    useContext(appContext);
  const [imgUpload, setImgUpload] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    setShowImage(true);
    if (files && files.length > 0) {
      const file = files[0];
      const localImageURL = URL.createObjectURL(file);
      setImgUpload(localImageURL);
      const fileArrrayBuffer = await readFileAsArrayBuffer({ file });
      const fileUint8Array = new Uint8Array(fileArrrayBuffer);
      setUploadedFile(fileUint8Array);
    }
  };

  async function fileToUint8Array(file: File) {
    return new Uint8Array(await file.arrayBuffer());
  }

  useEffect(() => {
    const processUploadedFile = async () => {
      if (uploadedFile) {
        console.log(`Uploaded file data is ${uploadedFile}`);
        try {
          await refreshSession();
          if (uploadedFile) {
            // Convert Uint8Array to Blob
            setIsUploading(true);
            const blob = new Blob([uploadedFile], { type: "image/jpeg" });

            // Convert Blob to File
            const file = new File([blob], "compressed-image.jpg", {
              type: "image/jpeg",
            });

            // Compress the image before uploading
            const compressionOptions = {
              maxSizeMB: 0.9, // Set the maximum size in MB
              maxWidthOrHeight: 1920, // Set the maximum width or height in pixels
              useWebWorker: true,
            };
            const compressedFile = await ImageCompression(
              file,
              compressionOptions
            );
            console.log("Compressed file:", compressedFile); // Log the compressed file

            // Convert compressed File to Uint8Array
            const compressedUint8Array = await fileToUint8Array(compressedFile);
            console.log("Compressed Uint8Array:", compressedUint8Array); // Log the compressed Uint8Array

            const resp = await agent.uploadBlob(compressedUint8Array, {
              encoding: "image/jpeg",
            });
            console.log("Response:", resp);
            const {
              data: { blob: image },
            } = resp;
            setImage(image);
            console.log("Uploaded image:", image); // Log the uploaded image
            setIsUploading(false);
          }
        } catch (error) {
          console.log("Error:", error); // Log the error
        }
      }
    };
    processUploadedFile();
  }, [uploadedFile]);

  return (
    <div className="">
      <div className="w-full relative">
        <button
          className="px-5 py-1 my-4 rounded-md bg-white border block md:hidden "
          onClick={() => {
            setShowAddPost(false);
            setShowImage(false);
            setImage(null);
            setPostText("");
            setUploadedFile(null), setImgUpload("");
          }}
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
                  disabled={isUploading}
                >
                  {item.icon}
                  {isUploading && item.name === "Media" ? "Uploading " : ""}
                  <span>
                    {item.name === "Post" && submitPost
                      ? "Loading..."
                      : item.name}
                  </span>
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
