// Importing required modules from React and React Router libraries
import { useEffect, useState, useRef } from "react";
import Layout from "./components/HOC/Navigation/Layout";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { appContext } from "./context/appContext";
import "./interceptors/axios";
// Importing components for different pages of the application
import Feed from "./Page/Feed";
import Notification from "./Page/Notification";
import WillComeSoon from "./components/PageComponents/WillComeSoon";
import Profile from "./Page/Profile";
import { activePageCheck } from "./utils";

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

  useEffect(() => {
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
              <Route path="/notifications" element={<Notification />} />
              <Route path="/settings" element={<WillComeSoon />} />
              <Route path="/profile" element={<WillComeSoon />} />
            </Routes>
          </Layout>
        </Router>
      </appContext.Provider>
    </div>
  );
}

// Exporting the App component as the main component of the application
export default App;
