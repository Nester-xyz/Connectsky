import React, { useState, useMemo, useCallback, FormEvent } from "react";

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

const calculateLoginIdentifier = (identifier: string) => {
  // If the identifier is a valid email address, use it as the identifier
  if (
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/.test(
      identifier
    )
  ) {
    return identifier;
  }
  // If user only gives identifier without .bsky.social, append it
  if (!identifier.endsWith(".bsky.social")) {
    return `${identifier}.bsky.social`;
  }
  return identifier;
};

const Login = ({
  attemptedLogin,
  setAttemptedLogin,
  loggedInSuccess,
  setLoggedInSuccess,
}: Props) => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
            // setSession(sess!);
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

  const login = useCallback(async () => {
    try {
      const parsedIdentifier = calculateLoginIdentifier(identifier);
      await agent!.login({
        identifier: parsedIdentifier,
        password: password,
      });
    } catch (error) {
      setSubmitted(true);
    }
  }, [identifier, password, agent]);

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
            <label htmlFor="identifier">
              Username&nbsp;/&nbsp;Email Address:&nbsp;
            </label>
            <input
              type="text"
              id="identifier"
              className="input-box"
              placeholder="example.bsky.social"
              onChange={(e) => {
                setSubmitted(false);
                setAttemptedLogin(false);
                setIdentifier(e.target.value);
              }}
              value={identifier}
            />
          </div>
          {/* <br /> */}
          <div className="input-container ">
            <label htmlFor="app-password">App Password:&nbsp;</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                id="app-password"
                className="input-box "
                placeholder="Password"
                onChange={(e) => {
                  setAttemptedLogin(false);
                  setSubmitted(false);
                  setPassword(e.target.value);
                }}
                value={password}
              />
              <div className="password-icons">
                {showPassword ? (
                  <HiEyeSlash onClick={() => setShowPassword(false)} />
                ) : (
                  <HiEye onClick={() => setShowPassword(true)} />
                )}
              </div>
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
