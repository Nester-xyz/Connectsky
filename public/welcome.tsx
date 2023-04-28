import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useMemo, useCallback, FormEvent, ChangeEvent } from "react";
import * as bsky from "@atproto/api";
import type { AtpSessionEvent, AtpSessionData } from "@atproto/api";
import Left from "./welcome/Left";
const { BskyAgent } = bsky;

const Welcome = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [session, setSession] = useState<AtpSessionData>();

  const agent = useMemo(
    () =>
      new BskyAgent({
        service: "https://bsky.social",
        persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
          console.log("setSession", sess);
          if (sess != null) {
            setSession(sess!);
            chrome.runtime.sendMessage(true, function (response) {
              if (response) {
                console.log("Message sent successfully!");
              } else {
                console.log("Error sending message.");
              }
            });
            window.close();
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
    <div className="screen">
      <div className="text">
        <div className="title">Welcome</div>
        <div className="sub-title">to Unnamed</div>
      </div>
      <div className="container">
        {/* <Left /> */}
        {/* text */}
        <div className="right">
          {/* login */}

          <form id="login" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="username">Username:&nbsp;</label>
              <input
                type="text"
                id="username"
                placeholder="username"
                onChange={handleUsernameChange}
                value={username}
              />
            </div>
            <br />
            <div>
              <label htmlFor="app-password">App Password:&nbsp;</label>
              <input
                type="password"
                id="app-password"
                placeholder="password"
                onChange={handlePasswordChange}
                value={password}
              />
            </div>
            <input type="submit" value="login" disabled={loggedIn} />
            <br />
            <br />
          </form>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Welcome />
  </React.StrictMode>
);
