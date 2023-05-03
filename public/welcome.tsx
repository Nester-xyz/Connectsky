import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./welcome/Login";

const Welcome = () => {
  return (
    <div className="screen ">
      <Login />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Welcome />
  </React.StrictMode>
);
