import React from "react";
import BottomBar from "./BottomBar";
import { activePageCheck } from "../../../App";
type Props = {
  children: string | JSX.Element | JSX.Element[];
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<activePageCheck>>;
};

const Layout = ({ children, activePage, setActivePage }: Props) => {
  return (
    <div className="flex flex-col justify-between h-screen bg-green-300">
      {children}
      <BottomBar activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
};

export default Layout;
