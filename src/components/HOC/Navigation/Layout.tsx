// by the time that i am writing this. This components is only called from app.tsx
import React, { useContext } from "react";

// type import
import { activePageCheck } from "../../../App";
import { LoginContextType } from "../../@types/Login/Login";

// component import
import BottomBar from "./BottomBar";
import SideBar from "./SideBar";

// context import
import { LayoutProps } from "../../@types/Layout/Layout";

// the react component begins here
const Layout = ({ children, activePage, setActivePage }: LayoutProps) => {
  return (
    <div className="flex flex-col justify-between h-screen overflow-hidden bg-green-300">
      <div className="grid grid-cols-5 h-full overflow-scroll">
        {/* the side bar component only comes to view when the display is sent over 768px */}
        <div className="hidden md:block col-span-1">
          <SideBar activePage={activePage} setActivePage={setActivePage} />
        </div>
        <div className="w-full col-span-5 md:col-span-4">{children}</div>
      </div>

      {/* this component hides when the display is sent over 768px */}
      <div className="block md:hidden">
        <BottomBar activePage={activePage} setActivePage={setActivePage} />
      </div>
    </div>
  );
};

export default Layout;
