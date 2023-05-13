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
import { HiEye } from "react-icons/hi";
import { HiEyeSlash } from "react-icons/hi2";

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
  const [submitted, setSubmitted] = useState(false);

  const [isVisible, setIsVisible] = useState<boolean>(true);

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

  useEffect(() => {
    if (attemptedLogin && !loggedInSuccess) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [attemptedLogin, submitted]);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const login = useCallback(async () => {
    try {
      await agent!.login({
        identifier: username,
        password: password,
      });
    } catch (error) {
      setSubmitted(true);
      setLoggedIn(true);
    }
  }, [username, password, agent]);

  const handleLoginSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAttemptedLogin(true);
      await login();
    },
    [login]
  );

  return (
    <>
      <div className="background_main">
        <div className="background_content"></div>
      </div>
      <div className="container">
        <div className="formTitle">
          <h1 className="login-heading">Login to Connectsky</h1>
        </div>
        <form id="login" className="loginForm" onSubmit={handleLoginSubmit}>
          <div className="input-container">
            <label htmlFor="username">
              Username&nbsp;/&nbsp;Email Address:&nbsp;
            </label>
            <input
              type="text"
              id="username"
              className="input-box"
              placeholder="example.bsky.social"
              onChange={(e) => {
                setAttemptedLogin(false);
                setUsername(e.target.value);
              }}
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
              onChange={(e) => {
                setAttemptedLogin(false);
                setPassword(e.target.value);
              }}
              value={password}
            />
            <div className="text-2xl absolute">
              <HiEye />
              <HiEyeSlash />
            </div>
          </div>
          {/* <br />
          <br /> */}
          {attemptedLogin && loggedInSuccess
            ? null
            : attemptedLogin &&
              submitted &&
              !loggedInSuccess && (
                <h5 className="login-msg"> Incorrect Credentials</h5>
              )}
          <button type="submit">Login</button>
          <div className="signUp">
            <p>
              Don't have an account? <span className="strong">Sign up</span> for
              free.
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
