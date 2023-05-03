import React, {
  useState,
  useMemo,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";

import * as bsky from "@atproto/api";
import type { AtpSessionEvent, AtpSessionData } from "@atproto/api";

const { BskyAgent } = bsky;

type Props = {};

const Login = (props: Props) => {
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
          if (sess.email) localStorage.setItem("email", sess?.email);
          const sessData = JSON.stringify(sess);
          localStorage.setItem("sess", sessData);
          if (sess != null) {
            setSession(sess!);
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
            // setTimeout(() => {
            //   window.close();
            // }, 1000);
          }
        },
      }),
    []
  );

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const login = useCallback(async () => {
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
    <div className="container">
      <h1 className="login-heading">Log in to Bsky</h1>
      <form id="login" onSubmit={handleLoginSubmit}>
        <div className="input-container">
          <label htmlFor="username">Username:&nbsp;</label>
          <input
            type="text"
            id="username"
            className="input-box"
            placeholder="username"
            onChange={handleUsernameChange}
            value={username}
          />
        </div>
        <br />
        <div className="input-container">
          <label htmlFor="app-password">App Password:&nbsp;</label>
          <input
            type="password"
            id="app-password"
            className="input-box"
            placeholder="password"
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        <br />
        <br />
        <button type="submit" disabled={loggedIn}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
