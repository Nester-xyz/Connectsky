import React from "react";

let isWindowCreate = true;

const LogInSuccess = () => {
  async function handleExtension() {
    await chrome.runtime.sendMessage({ isWindowCreate: isWindowCreate });
    window.close();
  }
  return (
    <>
      <div className="background_main">
        <div className="background_content"></div>
      </div>
      <div className="container formTitle loginForm">
        <div className="login-heading">
          <div>Logged In Successfully!</div>
        </div>
        <button className="submit" onClick={handleExtension}>
          OPEN APP
        </button>
      </div>
    </>
  );
};

export default LogInSuccess;
