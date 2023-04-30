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
        className={`absolute transition-all duration-500 origin-center text-3xl p-4 -my-2 bg-white ${
          checkOne === checkTwo
            ? "scale-100 -translate-y-5 rounded-full "
            : "scale-75"
        }`}
      >
        {icon}
      </button>
    </Link>
  ) : (
    <button
      onClick={action}
      className={`absolute transition-all duration-500 origin-center text-3xl p-4 -my-2 bg-white ${
        checkOne === checkTwo
          ? "scale-100 -translate-y-5 rounded-full "
          : "scale-75"
      }`}
    >
      {icon}
    </button>
  );
};

export default HoverButtonIconOnly;
