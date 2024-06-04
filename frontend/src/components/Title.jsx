import React from "react";
import { SiChessdotcom } from "react-icons/si";

const Title = () => {
  return (
    <>
      <div className=" flex justify-center m-2 gap-6">
        <SiChessdotcom className="text-white" size={70} />
        <h1 className="text-5xl text-center m-2 text-gray-50 ">
          Pawn Structure Search
        </h1>
        <SiChessdotcom className="text-black" size={70} />
      </div>

      <p className="text-gray-50 text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum
      </p>
    </>
  );
};

export default Title;
