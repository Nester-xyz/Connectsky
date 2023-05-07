// Importing required modules from React and React Router libraries
import { useState, useRef } from "react";
import Layout from "./components/HOC/Navigation/Layout";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { appContext } from "./context/appContext";
import "./interceptors/axios";
// Importing components for different pages of the application
import Feed from "./Page/Feed";
import Notification from "./Page/Notification";
import { linksType } from "./components/@types/Layout/SideBar";
import {
  IoNotifications,
  IoSearch,
  IoSearchOutline,
  IoSettings,
  IoSettingsOutline,
} from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import WillComeSoon from "./components/PageComponents/WillComeSoon";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";

// Defining type for active page check, with limited values
export type activePageCheck = "Home" | "Search" | "Notifications" | "Setting";
// this contains the actual links which will be made into the buttons

export const links: linksType[] = [
  {
    linkName: "Home",
    links: "/",
    icon: <AiOutlineHome />,
    activeIcon: <AiFillHome />,
  },
  {
    linkName: "Search",
    links: "/search",
    icon: <IoSearchOutline />,
    activeIcon: <IoSearch />,
  },
  {
    linkName: "Notifications",
    links: "/notification",
    icon: <IoMdNotificationsOutline />,
    activeIcon: <IoMdNotifications />,
  },
  // replace the icon with a seperate compoenent wohich only returns an profile picure
  {
    linkName: "Settings",
    links: "/search",
    icon: <IoSettingsOutline />,
    activeIcon: <IoSettings />,
  },
];

function App() {
  // State to manage the currently active page of the application
  const [activePage, setActivePage] = useState<activePageCheck>("Home");
  const [postText, setPostText] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<Uint8Array | null>(null);

  return (
    <div>
      <appContext.Provider
        value={{
          postText,
          setPostText,
          fileRef,
          setUploadedFile,
          uploadedFile,
        }}
      >
        {/* Setting up the router for the application */}
        <Router>
          {/* Wrapping the Layout component around the application */}
          <Layout activePage={activePage} setActivePage={setActivePage}>
            {/* Setting up the routes for the application */}
            <Routes>
              {/* Defining routes for different pages */}
              <Route path="/" element={<Feed />} />
              <Route path="/search" element={<WillComeSoon />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/setting" element={<WillComeSoon />} />
            </Routes>
          </Layout>
        </Router>
      </appContext.Provider>
    </div>
  );
}

// Exporting the App component as the main component of the application
export default App;
