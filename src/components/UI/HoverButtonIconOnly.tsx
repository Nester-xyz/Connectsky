import React from "react";

import { Link } from "react-router-dom";

// types import
import { Props } from "../@types/UI/HoverButton";

const HoverButtonIconOnly = ({
  checkOne,
  checkTwo,
  icon,
  text,
  link,
  action,
}: Props) => {
  // it scales the button from 75% to 100% depending on wether it is active or not
  return link ? (
    <Link to={link}>
      <button
        onClick={action}
        className={`absolute text-xl  p-2 bg-white  ${
          checkOne === checkTwo ? "border-2 rounded-full " : "border-none"
        }`}
      >
        {icon}
      </button>
    </Link>
  ) : (
    <button
      onClick={action}
      className={`absolute text-xl  bg-white  ${
        checkOne === checkTwo ? "border-2 rounded-full " : "border-none"
      }`}
    >
      {icon}
    </button>
  );
};

export default HoverButtonIconOnly;
