// Importing required modules from React and React Router libraries
import { useState, useContext } from "react";
import Layout from "./components/HOC/Navigation/Layout";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { appContext } from "./context/appContext";
import "./interceptors/axios";
// Importing components for different pages of the application
import Feed from "./Page/Feed";
import Notification from "./Page/Notification";
import Search from "./Page/Search";
import Setting from "./Page/Setting";
import { linksType } from "./components/@types/Layout/SideBar";
import { BsFillGearFill, BsPencilSquare } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";

// Defining type for active page check, with limited values
export type activePageCheck = "feed" | "search" | "notification" | "setting";
// this contains the actual links which will be made into the buttons

export const links: linksType[] = [
  {
    linkName: "Feed",
    links: "/",
    icon: <BsPencilSquare />,
  },
  {
    linkName: "search",
    links: "/search",
    icon: <AiOutlineSearch />,
  },
  {
    linkName: "notification",
    links: "/notification",
    icon: <IoNotifications />,
  },
  {
    linkName: "settings",
    links: "/search",
    icon: <BsFillGearFill />,
  },
];

function App() {
  // State to manage the currently active page of the application
  const [activePage, setActivePage] = useState<activePageCheck>("feed");
  const [postText, setPostText] = useState<string>("");
  return (
    <div>
      <appContext.Provider value={{ postText, setPostText }}>
        {/* Setting up the router for the application */}
        <Router>
          {/* Wrapping the Layout component around the application */}
          <Layout activePage={activePage} setActivePage={setActivePage}>
            {/* Setting up the routes for the application */}
            <Routes>
              {/* Defining routes for different pages */}
              <Route path="/" element={<Feed />} />
              <Route path="/search" element={<Search />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
          </Layout>
        </Router>
      </appContext.Provider>
    </div>
  );
}

// Exporting the App component as the main component of the application
export default App;
