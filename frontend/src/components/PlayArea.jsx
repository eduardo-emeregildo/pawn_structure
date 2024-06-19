import React from "react";
import Modal from "./Modal";
import Table from "./Table";
import { Chessboard } from "react-chessboard";
import { SlArrowDown } from "react-icons/sl";
import plans from "../plans.json";

// For tomorrow, dynamically set the modal/planObj fix bug of weird animation that happens when you click on a pawn structure, try to make common ps, custom buttons align

const PlayArea = () => {
  return (
    <div className="flex justify-evenly bg-[#101014] py-10 h-screen">
      {/* Chessboard */}
      <div>
        <Chessboard boardWidth="650" />
      </div>

      {/* List of games, pawn structure dropdown/button, moves area*/}

      <div>
        <div className="dropdown align-bottom">
          <div tabIndex={0} role="button" className="btn m-1">
            <SlArrowDown />
            Common Pawn Structures
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box h-52 overflow-auto block"
          >
            {plans.map((plan) => (
              <li key={plan.id}>
                <Modal id={plan.id} planObj={plan} />
              </li>
            ))}
          </ul>
        </div>

        <button className="btn m-1 align-top">Custom Pawn Structure</button>

        {/* Move area */}
        <div className="bg-gray-600 h-4/6 my-2 text-white rounded-sm ">
          The moves go here
        </div>

        <Table />
      </div>
    </div>
  );
};

export default PlayArea;
