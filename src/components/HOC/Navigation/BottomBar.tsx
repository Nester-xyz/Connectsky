// when i am writing this text, this component is only called from Layout.tsx
import React from "react";

// react icons imports
import { AiFillRobot } from "react-icons/ai";
import { BsFillGearFill, BsPencilSquare } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";

// type imports
import { BottomBarProps, linksType } from "../../@types/Layout/BottomBar";

// component imports
import HoverButtonIconOnly from "../../UI/HoverButtonIconOnly";

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
const BottomBar = ({ activePage, setActivePage }: BottomBarProps) => {
  return (
    <div className="flex justify-evenly items-center h-16 border-t-2 border-black bg-white">
      {links.map((link, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              setActivePage(link.linkName);
            }}
            className="w-10 h-10  relative"
          >
            <HoverButtonIconOnly
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

export default BottomBar;
