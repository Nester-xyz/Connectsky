import React from "react";

type Props = {};

const Left = (props: Props) => {
  return (
    <div className="left">
      {/* text */}
      <div className="leftContainer">
        <div className="text">
          <h1>WELCOME</h1>
          <p>lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec</p>
        </div>
        <div className="button-group">
          <button className="btn docs">Read more</button>
          <button className="btn github">Github?</button>
        </div>
      </div>
    </div>
  );
};

export default Left;
