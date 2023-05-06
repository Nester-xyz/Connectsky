import React from "react";

type Props = {};

const LogInSuccess = (props: Props) => {
  function getExtensionIdFromUrl(url) {
    const urlObject = new URL(url);
    return urlObject.hostname.split('.')[0];
  }
  function handleExtension() {
    window.open(`chrome-extension://${getExtensionIdFromUrl(chrome.runtime.getURL("welcome.html"))}/index.html`, 'extensionPopup', 'width=400,height=600');
    console.log(getExtensionIdFromUrl(chrome.runtime.getURL('welcome.html')))
    window.close();
  }
  return (
    <div className="loginSuccess">
      <div className="heading">Success</div>
      <div className="login-message">
        <div className="sub-heading">You logged in.</div>
        <div className="message">
          Now you can just close this tab and open the extension to start your
          'work'!
        </div>
        <button className="close" onClick={handleExtension}>Open the extension</button>
      </div>
    </div>
  );
};

export default LogInSuccess;
