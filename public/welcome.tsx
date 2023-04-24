import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useMemo, useCallback, FormEvent, ChangeEvent } from "react";
import * as bsky from "@atproto/api";
const { BskyAgent } = bsky;
import type { AtpSessionEvent, AtpSessionData } from "@atproto/api";

// for Ankit to change
const text =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non unde saepe? Quis iusto molestias";

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
      <div className="container">
        <div className="left">
          {/* text */}
          <div className="text">
            <h1>WELCOME</h1>
            <p>{text}</p>
          </div>
          <div className="button-group">
            <button className="btn docs">Read more</button>
            <button className="btn guithub">Github?</button>
          </div>
        </div>
        <div className="right">
          {/* login */}

          <form id="login" onSubmit={handleLoginSubmit}>
            Username:&nbsp;
            <input
              type="text"
              placeholder="username"
              onChange={handleUsernameChange}
              value={username}
            />
            <br />
            Password:&nbsp;
            <input
              type="password"
              placeholder="password"
              onChange={handlePasswordChange}
              value={password}
            />
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
