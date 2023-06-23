import React, { useState, useMemo, useCallback, FormEvent } from "react";
import * as bsky from "@atproto/api";
import type { AtpSessionEvent, AtpSessionData } from "@atproto/api";
import { HiEye } from "react-icons/hi";
import { HiEyeSlash } from "react-icons/hi2";
import { BsFillInfoCircleFill } from "react-icons/bs";
import Signup from "./Signup";

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
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [signUpClick, setSignUpClick] = useState<boolean>(false);
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);

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
      await agent!.login({
        identifier,
        password,
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

  function appPassword(): React.MouseEventHandler<HTMLDivElement> {
    return () => {
      window.open(
        "https://github.com/bluesky-social/atproto-ecosystem/blob/main/app-passwords.md",
        "_blank"
      );
    };
  }

  const handleAppPassword = appPassword();

  function handleSignUpClick() {
    setSignUpClick(true);
  }

  return (
    <>
      <div className="background_main">
        <div className="background_content"></div>
      </div>
      {signUpClick ? (
        <Signup
          attemptedLogin={attemptedLogin}
          setAttemptedLogin={setAttemptedLogin}
          loggedInSuccess={loggedInSuccess}
          setLoggedInSuccess={setLoggedInSuccess}
          setSignUpClick={setSignUpClick}
          agent={agent}
          setIsSignedUp={setIsSignedUp}
        />
      ) : (
        <div className="container">
          <div className="formTitle">
            <h1 className="login-heading">Login to Connectsky</h1>
          </div>

          <form id="login" className="loginForm" onSubmit={handleLoginSubmit}>
            {isSignedUp && (
              <h5 className="login-msg text-primary">
                Successfully signed up!
                <br /> Login to continue.
              </h5>
            )}
            <div className="input-container">
              <label htmlFor="identifier">
                Username&nbsp;/&nbsp;Email Address:&nbsp;
              </label>
              <input
                type="text"
                id="identifier"
                className="input-box"
                placeholder="john.bsky.social"
                onChange={(e) => {
                  setSubmitted(false);
                  setAttemptedLogin(false);
                  setIdentifier(e.target.value);
                }}
                value={identifier}
                required
              />
            </div>

            <div className="input-container password-container">
              <div className="tooltip-container">
                {showTooltip && (
                  <div className="tooltip">
                    Temporary password for third party applications!
                  </div>
                )}
              </div>
              <label htmlFor="app-password">
                App Password:&nbsp;{" "}
                <div
                  className="info-icon"
                  onClick={handleAppPassword}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <BsFillInfoCircleFill />
                </div>
              </label>
              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  id="app-password"
                  className="input-box "
                  placeholder="password"
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
                  <h5 className="login-msg"> Oops! Incorrect Credentials.</h5>
                )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                userSelect: "none",
                marginLeft: "-13px",
              }}
            >
              <input type="checkbox" id="newsletter-checkbox" defaultChecked />
              <label
                htmlFor="newsletter-checkbox"
                style={{
                  marginTop: "5px",
                }}
              >
                Subscribe to our Email Newsletter
              </label>
            </div>

            <button className="submit" type="submit">
              Login
            </button>
            <div className="signUp">
              <p>
                Don't have an account?{" "}
                <span
                  className="strong"
                  onClick={handleSignUpClick}
                  style={{ cursor: "pointer" }}
                >
                  Sign up
                </span>{" "}
                for free.
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
