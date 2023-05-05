// when i am writing this text, this component is only called from Layout.tsx

import React from "react";
// react icons imports
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillGearFill, BsPencilSquare } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
// type imports
import { SideBarProps, linksType } from "../../@types/Layout/SideBar";
// component imports
import HoverButton from "../../UI/HoverButton";

import { links } from "../../../App";

// the components code begins from here
const SideBar = ({ activePage, setActivePage, notiCount }: SideBarProps) => {
  return (
    <div className="flex flex-col items-start gap-14 py-7 px-3 h-screen w-full bg-neutral-300">
      {links.map((link, index) => {
        return link.linkName !== "notification" ? (
          <div
            key={index}
            onClick={() => {
              setActivePage(link.linkName);
            }}
            className="relative bg-yellow-300 w-full"
          >
            {/* since this button doesn't do anything yet I haven't added anything to the action */}
            <HoverButton
              link={link.links}
              checkOne={activePage}
              checkTwo={link.linkName}
              icon={link.icon}
              activeIcon={link.activeIcon}
              text={link.linkName}
            />
          </div>
        ) : (
          <div
            key={index}
            onClick={() => {
              setActivePage(link.linkName);
            }}
            className="relative bg-yellow-300 w-full"
          >
            {/* Badge */}
            {notiCount.valueOf() > 0 && (
              <span className="absolute flex items-center justify-center top-0 right-0 w-4 h-4 z-50 bg-blue-500 text-white rounded-full p-0 text-xs">
                {notiCount.toString()}
              </span>
            )}

            {/* Button */}
            <HoverButton
              link={link.links}
              checkOne={activePage}
              checkTwo={link.linkName}
              icon={link.icon}
              activeIcon={link.activeIcon}
              text={link.linkName}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
