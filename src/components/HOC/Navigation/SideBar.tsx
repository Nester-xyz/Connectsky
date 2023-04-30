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
const SideBar = ({ activePage, setActivePage }: SideBarProps) => {
  return (
    <div className="flex flex-col items-start gap-14 py-7 px-3 h-screen w-full border-t-2 bg-neutral-300">
      {links.map((link, index) => {
        return (
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
              text={link.linkName}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
