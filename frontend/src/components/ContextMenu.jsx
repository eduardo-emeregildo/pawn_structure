import React from "react";

const ContextMenu = ({ contextMenuPosition, isMenuVisible }) => {
  console.log("CONTEXT MENU POSITION IS: ", contextMenuPosition);
  return (
    // <button
    //   className={`btn bg-gray-900 absolute top-[${contextMenuPosition.y}px] left-[${contextMenuPosition.x}px] ${isMenuVisible ? "" : "hidden"}`}
    // >
    //   Button
    // </button>

    <ul
      style={{
        top: `${contextMenuPosition.y}px`,
        left: `${contextMenuPosition.x}px`,
      }}
      className={`menu bg-gray-900 rounded-box absolute ${isMenuVisible ? "" : " hidden"}`}
    >
      <li className="hover:bg-gray-700">
        <a>Delete Move</a>
      </li>
    </ul>
  );
};

export default ContextMenu;
