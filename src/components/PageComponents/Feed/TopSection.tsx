import React from "react";

type Props = {
  feedOptionsButtons: {
    name: string;
    filter: string;
  };
  setFilterVariable: (filter: string) => void;
};

const TopSection = ({ feedOptionsButtons, setFilterVariable }: Props) => {
  return (
    <>
      Hello
      {/* {feedOptionsButtons.map((item, index) => {
        return (
          <div key={index}>
            <button
              className="bg-white border rounded-md border-gray-300 flex-1 md:w-48 min-w-[100px]"
              onClick={() => setFilterVariable(item.filter)}
            >
              {item.name}
            </button>
          </div>
        );
      })} */}
    </>
  );
};

export default TopSection;
