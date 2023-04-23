import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BskyAgent, AtpAgentLoginOpts } from "@atproto/api";

// for Ankit to change
const agent = new BskyAgent({
  service: "https://bsky.social",
  persistSession: (evt, sess) => {
    localStorage.setItem("bsky-session", JSON.stringify(sess));
    // store the session-data for reuse
    // [how to do this??]
    console.log("Persisting session data...");
  },
});

const text =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non unde saepe? Quis iusto molestias";

const Welcome = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Call the login method with the appropriate options
      const loginOptions: AtpAgentLoginOpts = {
        identifier: "yourUsername",
        password: "yourPassword",
      };
      const response = await agent.login(loginOptions);
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

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

          <form action="">
            <h1>LOGIN</h1>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn login" onClick={handleLogin}>
              Login
            </button>
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
