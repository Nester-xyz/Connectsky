// by the time that i am writing this. This components is only called from app.tsx
import React, { useContext, useEffect, useState } from "react";

// type import
import { activePageCheck } from "../../../App";
import { LoginContextType } from "../../@types/Login/Login";
import { agent, refreshSession } from "../../../utils";
// component import
import BottomBar from "./BottomBar";
import SideBar from "./SideBar";

// context import
import { LayoutProps } from "../../@types/Layout/Layout";
import { useLocation } from "react-router-dom";

// the react component begins here
const Layout = ({ children, activePage, setActivePage }: LayoutProps) => {
  const [notiCount, setNotiCount] = useState<Number>(0);
  const location = useLocation();
  async function getUnreadNotifications() {
    try {
      await refreshSession();
      const { data } = await agent.countUnreadNotifications();
      setNotiCount(data.count);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (location.pathname == "/") {
      setActivePage("Home");
    }
  }, [activePage]);

  useEffect(() => {
    getUnreadNotifications();
    if (activePage == "Notifications") {
      setNotiCount(0);
      console.log("count 0");
    }
  }, [activePage]);

  return (
    <div className="flex flex-col justify-between h-screen overflow-hidden bg-gray">
      <div className="grid grid-cols-5 md:gap-40 lg:gap-0 h-full overflow-x-hidden">
        {/* the side bar component only comes to view when the display is sent over 768px */}

        <div className="hidden md:block col-span-1 h-screen top-0 min-w-[200px] sticky bg-green-400">
          <div className="bg-blue-300 h-full">
            <SideBar
              activePage={activePage}
              setActivePage={setActivePage}
              notiCount={notiCount}
            />
          </div>
        </div>
        <div className="w-full col-span-5 md:col-span-4">{children}</div>
      </div>

      {/* this component hides when the display is sent over 768px */}
      <div className="block md:hidden">
        <BottomBar
          activePage={activePage}
          setActivePage={setActivePage}
          notiCount={notiCount}
        />
      </div>
    </div>
  );
};

export default Layout;
