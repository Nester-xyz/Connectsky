import React from "react";

type Props = {};

const LogInSuccess = (props: Props) => {
  return (
    <div className="loginSuccess">
      <div className="heading">Success</div>
      <div className="login-message">
        <div className="sub-heading">You logged in.</div>
        <div className="message">
          Now you can just close this tab and open the extension to start your
          'work'!
        </div>
        <button className="close">Open the extension</button>
      </div>
    </div>
  );
};

export default LogInSuccess;
