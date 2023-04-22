import React from "react";
import ReactDOM from "react-dom/client";

// for Ankit to change
const text =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non unde saepe? Quis iusto molestias";

const Welcome = () => {
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
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Password" />
            </div>
            <button className="btn login">Login</button>
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
