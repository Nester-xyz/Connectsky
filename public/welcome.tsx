import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Login from "./welcome/Login";
import LogInSuccess from "./welcome/LogInSuccess";

const Welcome = () => {
  const [attemptedLogin, setAttemptedLogin] = useState(false);
  const [loggedInSuccess, setLoggedInSucces] = useState(false);
  return (
    <div className="screen ">
      {attemptedLogin ? (
        loggedInSuccess ? (
          <LogInSuccess />
        ) : (
          <Login
            attemptedLogin={attemptedLogin}
            setAttemptedLogin={setAttemptedLogin}
            loggedInSuccess={loggedInSuccess}
            setLoggedInSuccess={setLoggedInSucces}
          />
        )
      ) : (
        <Login
          attemptedLogin={attemptedLogin}
          setAttemptedLogin={setAttemptedLogin}
          loggedInSuccess={loggedInSuccess}
          setLoggedInSuccess={setLoggedInSucces}
        />
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Welcome />
  </React.StrictMode>
);
