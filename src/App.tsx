// Importing required modules from React and React Router libraries
import { useEffect, useRef, useState } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/HOC/Navigation/Layout";
import { appContext } from "./context/appContext";
import "./interceptors/axios";
// Importing components for different pages of the application
import Discovery from "./Page/Discovery";
import Feed from "./Page/Feed";
import Notification from "./Page/Notification";
import Profile from "./Page/Profile";
import WillComeSoon from "./components/PageComponents/WillComeSoon";
import { activePageCheck } from "./utils";

export interface ProfileView {
  did: string;
}

function App() {
  // State to manage the currently active page of the application
  const [activePage, setActivePage] = useState<activePageCheck>(() => {
    const storedValue = localStorage.getItem("activePage");
    // const path = storedValue ? JSON.parse(storedValue) : "Feed";
    return storedValue ? (JSON.parse(storedValue) as activePageCheck) : "Home";
  });
  const [postText, setPostText] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<Uint8Array | null>(null);
  const [isFollows, setIsFollows] = useState<ProfileView[]>([]);

  useEffect(() => {
    // await agent.getFollows({
    //   actor: response.data.did,
    // });
    // Update localStorage whenever activePage changes
    localStorage.setItem("activePage", JSON.stringify(activePage));
  }, [activePage]);
  return (
    <div>
      <appContext.Provider
        value={{
          postText,
          setPostText,
          fileRef,
          setUploadedFile,
          uploadedFile,
          setActivePage,
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
              <Route path="/search" element={<Discovery />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/settings" element={<WillComeSoon />} />
              <Route path="/profile/:did" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </appContext.Provider>
    </div>
  );
}

// Exporting the App component as the main component of the application
export default App;
