import React, {
  useState,
  useMemo,
  useCallback,
  FormEvent,
  ChangeEvent,
  useEffect,
} from "react";

import * as bsky from "@atproto/api";
import type { AtpSessionEvent, AtpSessionData } from "@atproto/api";

const { BskyAgent } = bsky;

type Props = {
  attemptedLogin: boolean;
  setAttemptedLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loggedInSuccess: boolean;
  setLoggedInSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = ({
  attemptedLogin,
  setAttemptedLogin,
  loggedInSuccess,
  setLoggedInSuccess,
}: Props) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [session, setSession] = useState<AtpSessionData>();

  const agent = useMemo(
    () =>
      new BskyAgent({
        service: "https://bsky.social",
        persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
          console.log("setSession", sess);
          console.log(sess);
          if (sess == null) {
            return;
          }
          localStorage.setItem("handle", sess?.handle);
          localStorage.setItem("accessJWT", sess?.accessJwt);
          localStorage.setItem("refreshJWT", sess?.refreshJwt);
          localStorage.setItem("did", sess?.did);
          if (sess?.email) localStorage.setItem("email", sess?.email);
          const sessData = JSON.stringify(sess);
          localStorage.setItem("sess", sessData);
          if (sess != null) {
            setSession(sess!);
            setLoggedInSuccess(true);
            // Store a value in chrome storage

            chrome.storage.sync.set({ isLoggedIn: true }, function () {
              console.log("Value is set to " + "isLoggedIn");
              // console.log(result);
              chrome.runtime.sendMessage(true, function (response) {
                if (response) {
                  console.log("Message sent successfully!");
                }
              });
            });
          }
        },
      }),
    []
  );

  // useEffect(() => {
  //   if (isSess != null) {
  //     setAttemptedLogin(true);
  //   }
  // }, []);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const login = useCallback(async () => {
    setAttemptedLogin(true);
    await agent!.login({
      identifier: username,
      password: password,
    });
    setLoggedIn(true);
  }, [username, password, agent]);

  const handleLoginSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await login();
    },
    [login]
  );

  const handleUsernameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    },
    [] 
  );      

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value); 
    },
    []       
  );  

  return (
    <>  
      <div className="background_main"><div className="background_content"></div></div>
      <div className="container">
        <div className="formTitle">
          <h1 className="login-heading">Log in to Bsky</h1>
        </div>
        <form id="login" className="loginForm" onSubmit={handleLoginSubmit}>
          <div className="input-container">
            <label htmlFor="username">Username&nbsp;/&nbsp;Email Address:&nbsp;</label>
            <input
              type="text"
              id="username"
              className="input-box"
              placeholder="Username"
              onChange={handleUsernameChange}
              value={username}
            />
          </div>
          {/* <br /> */}
          <div className="input-container">
            <label htmlFor="app-password">App Password:&nbsp;</label>
            <input
              type="password"
              id="app-password"
              className="input-box" 
              placeholder="Password"
              onChange={handlePasswordChange}
              value={password}
            />
          </div>
          {/* <br />
          <br /> */}  
          {attemptedLogin
          ? loggedInSuccess
            ? null
            : <h5 className="login-msg">Incorrect credentials!</h5>
          : null}
          <button type="submit" disabled={loggedIn}>
            Login
          </button>
          <div className="signUp"> 
            <p>Don't have an account? <span className="strong">Sign up</span> for free.</p>
          </div> 
        </form>
      </div>     
    </>
  );
};

export default Login;
