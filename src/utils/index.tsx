import moment from "moment";
import { BskyAgent, AtpSessionEvent, AtpSessionData } from "@atproto/api";
import { linksType } from "../components/@types/Layout/SideBar";
import { IoSearch, IoSearchOutline } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import ProfileImage from "./profileImage";

export function readFileAsArrayBuffer({
  file,
}: {
  file: File;
}): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
// Import moment.js

// Defining type for active page check, with limited values
export type activePageCheck =
  | "Home"
  | "Search"
  | "Notifications"
  | "Settings"
  | "Profile";
// this contains the actual links which will be made into the buttons

export async function getUserDid(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("did", (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result.did || null);
      console.log(result.did);
    });
  });
}

export const links: linksType[] = [
  {
    linkName: "Home",
    links: "/",
    icon: <AiOutlineHome />,
    activeIcon: <AiFillHome />,
  },
  {
    linkName: "Search",
    links: "/search",
    icon: <IoSearchOutline />,
    activeIcon: <IoSearch />,
  },
  {
    linkName: "Notifications",
    links: "/notifications",
    icon: <IoMdNotificationsOutline />,
    activeIcon: <IoMdNotifications />,
  },
  // replace the icon with a seperate compoenent wohich only returns an profile picure
  // {
  //   linkName: "Settings",
  //   links: "/settings",
  //   icon: <IoSettingsOutline />,
  //   activeIcon: <IoSettings />,
  // },
  {
    linkName: "Profile",
    links: `/profile/${getUserDid()}`,
    icon: <ProfileImage />,
    activeIcon: (
      <ProfileImage
        style={{
          border: "1px solid #005A9C",
          borderRadius: "50%",
          padding: "1px",
          objectFit: "cover",
          scale: "1.2",
        }}
      />
    ),
  },
];

// Function to format date in desired output
export function formatDateAgo(date: Date) {
  const now = moment();
  const diff = moment.duration(now.diff(date));

  if (diff.asDays() >= 1) {
    return `${Math.floor(diff.asDays())}d `;
  } else if (diff.asHours() >= 1) {
    return `${Math.floor(diff.asHours())}h `;
  } else if (diff.asMinutes() >= 1) {
    return `${Math.floor(diff.asMinutes())}m `;
  } else {
    return "now";
  }
}

export const agent = new BskyAgent({
  service: "https://bsky.social",
  persistSession: async (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
    console.log(sess);
    const sessData = JSON.stringify(sess);
    chrome.storage.sync.set({ sessData }, function () {
      console.log("Session data has been saved");
      chrome.storage.sync.get("sessData", function (result) {
        console.log("sessData from new agent is", result.sessData);
      });
    });
  },
});

export async function refreshSession(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.sync.get("sessData", async (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      const sessData = result.sessData;
      console.log(sessData);
      console.log("refreshsession" + sessData);
      if (sessData !== null && sessData !== undefined) {
        try {
          await agent.resumeSession(sessData);
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        resolve();
      }
    });
  });
}

// const MAX_WORDS = 20; // Maximum number of words to display initially
// export function handleLongText(
//   str: string | undefined
// ): { __html: string } | undefined {
//   const longText = /^(?!\/).{31,}$/;
//   if (!str) {
//     return undefined;
//   }
//   const processedLinks = handleLinks(str);
//   const stringWithLinksHandled = processedLinks?.__html || str;

//   // Split the string into individual words
//   const words = stringWithLinksHandled.split(' ');
//   // Check if the number of words is greater than MAX_WORDS
//   if (words.length > MAX_WORDS) {
//     // If yes, then join the first MAX_WORDS number of words
//     const shownText = words.slice(0, MAX_WORDS).join(' ');
//     // And join the remaining words
//     const hiddenText = words.slice(MAX_WORDS).join(' ');
//     // Add 'Show more'/'Show less' links around the hidden text
//     return {
//       __html: shownText + ' <a href="#" class="show-more">Show more</a><span class="hidden-text" style="display: none;">' +
//         hiddenText + ' <a href="#" class="show-less">Show less</a></span>',
//     };
//   } else {
//     // If the number of words is less than or equal to MAX_WORDS, return the text as is
//     return {
//       __html: stringWithLinksHandled.replace(
//         longText,
//         (match) =>
//           `<div class="w-full overflow-hidden"><span class="break-words">${match}</span></div>`
//       ),
//     };
//   }
// }

export function handleLinks(
  str: string | undefined
): { __html: string } | undefined {
  const linkRegex =
    /(\bhttps?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|.]*)\S*/gi;
  if (!str) {
    return undefined;
  }

  return {
    __html: str.replace(
      linkRegex,
      (match) =>
        `<span class="break-all"><a href="${match}" class="text-indigo-600" target="_blank">${match}</a></span>`
    ),
  };
}

export function handleSplit(handle: string | undefined) {
  if (!handle) return "";
  return handle.split(".")[0];
}

export async function disLikeApi(uri: string, cid: string) {
  await refreshSession();
  const res = await agent.like(uri, cid);
  await agent.deleteLike(res.uri);
}

export async function likeApi(uri: string, cid: string) {
  await refreshSession();
  await agent.like(uri, cid);
}

export async function isAvailable(handle: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    chrome.storage.sync.get("handle", (result) => {
      const localHandle = result.handle;
      console.log(localHandle);
      resolve(handle === localHandle);
    });
  });
}

export async function deleteRepostApi(uri: string, cid: string) {
  await refreshSession();
  const res = await agent.repost(uri, cid);
  await agent.deleteRepost(res.uri);
}
export async function repostApi(uri: string, cid: string) {
  await refreshSession();
  await agent.repost(uri, cid);
}

export async function checkIfLikedApi(uri: string, cid: string) {
  try {
    const { data } = await agent.getLikes({ uri, cid });
    const alreadyLiked = data.likes.some((item) =>
      isAvailable(item.actor.handle)
    );
    return alreadyLiked;
  } catch (error) {
    console.log(error);
  }
  return false;
}

export async function checkIfAlreadyRepost(uri: string, cid: string) {
  try {
    const { data } = await agent.getRepostedBy({ uri, cid });
    const alreadyReposted = data.repostedBy.some((item) =>
      isAvailable(item.handle)
    );
    return alreadyReposted;
  } catch (error) {
    console.log(error);
  }
  return false;
}
