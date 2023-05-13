import moment from "moment";
import { BskyAgent, AtpSessionEvent, AtpSessionData } from "@atproto/api";
import { linksType } from "../components/@types/Layout/SideBar";
import {
  IoNotifications,
  IoSearch,
  IoSearchOutline,
  IoSettings,
  IoSettingsOutline,
} from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
// Import moment.js

// Defining type for active page check, with limited values
export type activePageCheck = "Home" | "Search" | "Notifications" | "Settings";
// this contains the actual links which will be made into the buttons

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
  {
    linkName: "Settings",
    links: "/settings",
    icon: <IoSettingsOutline />,
    activeIcon: <IoSettings />,
  },
];

// Function to format date in desired output
export function formatDateAgo(date: Date) {
  const now = moment();
  const diff = moment.duration(now.diff(date));

  if (diff.asDays() >= 1) {
    return `${Math.floor(diff.asDays())}d ago`;
  } else if (diff.asHours() >= 1) {
    return `${Math.floor(diff.asHours())}h ago`;
  } else if (diff.asMinutes() >= 1) {
    return `${Math.floor(diff.asMinutes())}m ago`;
  } else {
    return "just now";
  }
}

export const agent = new BskyAgent({
  service: "https://bsky.social",
  persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
    // console.log("first");
    const sessData = JSON.stringify(sess);
    localStorage.setItem("sess", sessData);
  },
});

export async function refreshSession() {
  const sessData = localStorage.getItem("sess");
  if (sessData !== null) {
    const sessParse = JSON.parse(sessData);
    await agent.resumeSession(sessParse);
  }
}


export function handleLongText(str: string | undefined): { __html: string } | undefined {
  const longText = /^(?!\/).{31,}$/;
  if (!str) {
    return undefined;
  }
  const processedLinks = handleLinks(str);
  const stringWithLinksHandled = processedLinks?.__html || str;
  return {
    __html: stringWithLinksHandled.replace(
      longText,
      (match) => `<div class="w-full overflow-hidden"><span class="break-all">${match}</span></div>`
    ),
  };
}

function handleLinks(str: string | undefined): { __html: string } | undefined {
  const linkRegex = /(\bhttps?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|.]*)\S*/gi;
  if (!str) {
    return undefined;
  }
  console.log(str);
  return {
    __html: str.replace(
      linkRegex,
      (match) => `<span class="break-all"><a href="${match}" class="text-indigo-600" target="_blank">${match}</a></span>`
    ),
  };
}


