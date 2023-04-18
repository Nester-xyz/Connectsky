import React from "react";
import { AiFillRobot } from "react-icons/ai";
import { BsFillGearFill, BsPencilSquare } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { activePageCheck } from "../../../App";
type Props = {
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<activePageCheck>>;
};

type linksType = {
  linkName: activePageCheck;
  links: string;
  icon: JSX.Element | string;
};

type linksTypeArrays = linksType[];

const links: linksTypeArrays = [
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

const BottomBar = ({ activePage, setActivePage }: Props) => {
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
            <div
              className={`absolute transition-all duration-500 origin-center text-3xl p-4 -my-2 bg-white ${
                activePage === link.linkName
                  ? "scale-100 -translate-y-5 rounded-full "
                  : "scale-75"
              }`}
            >
              {link.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BottomBar;
