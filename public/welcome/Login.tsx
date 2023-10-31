import React, {
  useState,
  useMemo,
  useCallback,
  FormEvent,
  useEffect,
} from "react";
import * as bsky from "@atproto/api";
import type { AtpSessionEvent, AtpSessionData } from "@atproto/api";
import { HiEye } from "react-icons/hi";
import { HiEyeSlash } from "react-icons/hi2";
import { BsFillInfoCircleFill } from "react-icons/bs";
import Signup from "./Signup";
import { profile } from "console";

const { BskyAgent } = bsky;

type Props = {
  attemptedLogin: boolean;
  setAttemptedLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loggedInSuccess: boolean;
  setLoggedInSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = React.memo(
  ({
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
    const [isNewsLetterChecked, setIsNewsLetterChecked] = useState(true);
    const [agent, setAgent] = useState<any>(null);

    useEffect(() => {
      const agentInstance = new BskyAgent({
        service: "https://bsky.social",
        persistSession: async (
          _evt: AtpSessionEvent,
          sess?: AtpSessionData
        ) => {
          // Your existing logic here
          console.log("setSession", sess);
          // console.log(sess);
          if (sess == null) {
            return;
          }
          // Storing the email and handle at Server
          // const data = {
          //   username: sess?.handle,
          //   email: sess?.email,
          // };
          // if (isNewsLetterChecked) {
          //   console.log("newsletter checked", isNewsLetterChecked);
          //   try {
          //     const url =
          //       "https://connect-sky-backend-4wyymuz0y-yogesh0918npl.vercel.app/users/";
          //     fetch(url, {
          //       method: "POST",
          //       headers: { "Content-Type": "application/json" },
          //       body: JSON.stringify(data),
          //       credentials: "include",
          //       mode: "no-cors",
          //     }).then((res) => {
          //       console.log(res.body);
          //     });
          //   } catch (error) {
          //     console.log(error);
          //   }
          // }
          console.log(agent);
          const response = await agentInstance.getProfile({
            actor: sess?.did,
          });
          console.log(response.data.avatar);
          const avatar = response.data.avatar;
          const handle = sess?.handle;
          const accessJWT = sess?.accessJwt;
          const refreshJWT = sess?.refreshJwt;
          const did = sess?.did;
          const email = sess?.email;

          // localStorage.setItem("handle", sess?.handle);
          // localStorage.setItem("accessJWT", sess?.accessJwt);
          // localStorage.setItem("refreshJWT", sess?.refreshJwt);
          // localStorage.setItem("did", sess?.did);
          // if (sess?.email) localStorage.setItem("email", sess?.email);
          const sessData = JSON.stringify(sess);
          // localStorage.setItem("sess", sessData);
          chrome.storage.sync.set(
            { sessData, avatar, handle, accessJWT, refreshJWT, did, email },
            function () {
              console.log("Session data has been saved");

              chrome.storage.sync.get("sessData", function (result) {
                console.log("sessData is", result.sessData);
              });
              chrome.storage.sync.get("avatar", function (result) {
                console.log("avatar is", result.avatar);
              });
              chrome.storage.sync.get("handle", function (result) {
                console.log("handle is", result.handle);
              });
              chrome.storage.sync.get("accessJWT", function (result) {
                console.log("accessJWT is", result.accessJWT);
              });
              chrome.storage.sync.get("refreshJWT", function (result) {
                console.log("refreshJWT is", result.refreshJWT);
              });
              chrome.storage.sync.get("did", function (result) {
                console.log("did is", result.did);
              });
              chrome.storage.sync.get("email", function (result) {
                console.log("email is", result.email);
              });
            }
          );
          // console.log("avatar is" + chrome.storage.sync.get("avatar"));
          // console.log("handle is" + chrome.storage.sync.get("handle"));
          // console.log("accessJWT is" + chrome.storage.sync.get("accessJWT"));
          // console.log("refreshJWT is" + chrome.storage.sync.get("refreshJWT"));
          // console.log("did is" + chrome.storage.sync.get("did"));
          // console.log("email is" + chrome.storage.sync.get("email"));
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
              //send message to service worker to check notification count intially
              chrome.runtime.sendMessage(
                { action: "triggerFunction" },
                (response) => {
                  // Handle the response if needed
                }
              );
            });
          }
        },
      });
      setAgent(agentInstance);
    }, [agent]);

    // const agent = useMemo(
    //   () =>
    //     new BskyAgent({
    //       service: "https://bsky.social",
    //       persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
    //         console.log("setSession", sess);
    //         console.log(sess);
    //         if (sess == null) {
    //           return;
    //         }
    //         // Storing the email and handle at Server
    //         const data = {
    //           username: sess?.handle,
    //           email: sess?.email
    //         }
    //         if (isNewsLetterChecked) {
    //           console.log("newsletter checked", isNewsLetterChecked)
    //         }
    //         // try {
    //         //   const url = "https://connect-sky-backend-4wyymuz0y-yogesh0918npl.vercel.app/users/"
    //         //   fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'include', mode: 'no-cors' }).then((res) => {
    //         //     console.log(res.body);
    //         //   })
    //         // } catch (error) {
    //         //   console.log(error);
    //         // }

    //         localStorage.setItem("handle", sess?.handle);
    //         localStorage.setItem("accessJWT", sess?.accessJwt);
    //         localStorage.setItem("refreshJWT", sess?.refreshJwt);
    //         localStorage.setItem("did", sess?.did);
    //         if (sess?.email) localStorage.setItem("email", sess?.email);
    //         const sessData = JSON.stringify(sess);
    //         localStorage.setItem("sess", sessData);
    //         if (sess != null) {
    //           // setSession(sess!);
    //           setLoggedInSuccess(true);
    //           // Store a value in chrome storage

    //           chrome.storage.sync.set({ isLoggedIn: true }, function () {
    //             // console.log(result);
    //             chrome.runtime.sendMessage(true, function (response) {
    //               if (response) {
    //                 console.log("Message sent successfully!");
    //               }
    //             });
    //           });
    //         }
    //       },
    //     }),
    //   []
    // );

    const handleCheckBoxChange = () => {
      // console.log("tweaked", !isNewsLetterChecked)
      setIsNewsLetterChecked((prevState) => !prevState);
    };

    const login = async () => {
      try {
        await agent!.login({
          identifier,
          password,
        });
      } catch (error) {
        setSubmitted(true);
      }
    };

    const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAttemptedLogin(true);
      await login();
    };

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

    useEffect(() => {
      console.log("tweaked", isNewsLetterChecked);
    }, [isNewsLetterChecked]);
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

              {/* <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  userSelect: "none",
                  marginLeft: "-25px",
                }}
              >
                <input
                  type="checkbox"
                  id="newsletter-checkbox"
                  checked={isNewsLetterChecked}
                  onChange={handleCheckBoxChange}
                />
                <label
                  htmlFor="newsletter-checkbox"
                  style={{
                    marginTop: "5px",
                  }}
                >
                  Subscribe to our Email Newsletter
                </label>
              </div> */}

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
  }
);

export default Login;
