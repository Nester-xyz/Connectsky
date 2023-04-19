// when i am writing this text, this component is only called from Layout.tsx

import React from "react";
// react icons imports
import { AiFillRobot } from "react-icons/ai";
import { BsFillGearFill, BsPencilSquare } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
// type imports
import { SideBarProps, linksType } from "../../@types/Layout/SideBar";
// component imports
import HoverButton from "../../UI/HoverButton";

// this contains the actual links which will be made into the buttons
const links: linksType[] = [
  {
    linkName: "post",
    links: "",
    icon: <BsPencilSquare />,
  },
  {
    linkName: "notification",
    links: "",
    icon: <IoNotifications />,
  },
  {
    linkName: "bot",
    links: "",
    icon: <AiFillRobot />,
  },
  {
    linkName: "settings",
    links: "",
    icon: <BsFillGearFill />,
  },
];

// the components code begins from here
const SideBar = ({ activePage, setActivePage }: SideBarProps) => {
  return (
    <div className="flex flex-col items-start gap-14 py-7 px-3 h-screen w-52 border-t-2 bg-neutral-300">
      {links.map((link, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              setActivePage(link.linkName);
            }}
            className="relative bg-yellow-300 w-44"
          >
            {/* since this button doesn't do anything yet I haven't added anything to the action */}
            <HoverButton
              checkOne={activePage}
              checkTwo={link.linkName}
              icon={link.icon}
              text={link.linkName}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
