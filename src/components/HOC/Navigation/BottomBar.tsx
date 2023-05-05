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

// this contains the actual links which will be made into the button
import { links } from "../../../App";

// the components code begins from here
const BottomBar = ({
  activePage,
  setActivePage,
  notiCount,
}: BottomBarProps) => {
  return (
    <div className="flex justify-evenly items-center h-16 border-t border-slate-200 bg-white">
      {links.map((link, index) => {
        return link.linkName !== "notification" ? (
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
              link={link.links}
            />
          </div>
        ) : (
          <div
            key={index}
            onClick={() => {
              setActivePage(link.linkName);
            }}
            className="w-10 h-10  relative"
          >
            {notiCount.valueOf() > 0 && (
              <span className="absolute flex items-center justify-center top-0 right-0 w-4 h-4 z-50 bg-blue-500 text-white rounded-full p-0 text-xs">
                {notiCount.toString()}
              </span>
            )}
            <HoverButtonIconOnly
              checkOne={activePage}
              checkTwo={link.linkName}
              icon={link.icon}
              text={link.linkName}
              link={link.links}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BottomBar;
