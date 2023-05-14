import React, { useState } from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import Login from "./Login";

type Props = {
  attemptedLogin: boolean;
  setAttemptedLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loggedInSuccess: boolean;
  setLoggedInSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const Signup: React.FC<Props> = (props) => {
  const [sendBack, setSendBack] = useState<boolean>(false);

  function handleSendBackward() {
    setSendBack(true);
  }
  return (
    <>
      {sendBack ? (
        <Login {...props} />
      ) : (
        <>
          <div className="back-icon" onClick={handleSendBackward}>
            <IoChevronBackCircleSharp />
          </div>
          <div></div>{" "}
        </>
      )}
    </>
  );
};
export default Signup;
