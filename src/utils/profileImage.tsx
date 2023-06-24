import React, { useEffect, useState } from "react";
import DefaultUserImage from "../components/UI/DefaultUserImage";

type Props = {
  style?: React.CSSProperties;
};

const ProfileImage = ({ style }: Props) => {
  const [avatarURL, setAvatarURL] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(["avatar"], function (result) {
      console.log("Value currently is " + result.avatar);
      setAvatarURL(result.avatar); // Set the state within the callback
      console.log(result.avatar);

      console.log(avatarURL);
    });
  }, []);

  return (
    <div className="scale-90">
      {avatarURL === undefined ? (
        <div className="mt-[-2.1px]">
          <DefaultUserImage style={style} />
        </div>
      ) : (
        <img className="rounded-full mt-[-3px]" src={avatarURL} style={style} />
      )}
    </div>
  );
};

export default ProfileImage;
