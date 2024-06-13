import React from "react";
import Modal from "./Modal";
import { Chessboard } from "react-chessboard";
import { SlArrowDown } from "react-icons/sl";
// import plans from "../plans.json";

// For tomorrow, dynamically set the modal/plans, fix bug of weird animation that happens when you click on a pawn structure, try to make common ps, custom buttons align

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
            <li>
              <Modal modalName={"IQP"} />
            </li>
            <li>
              <Modal modalName={"Hanging Pawns"} />
            </li>
            <li>
              <Modal modalName={"Carlsbad"} />
            </li>
            <li>
              <Modal modalName={"Slav Formation"} />
            </li>
            <li>
              <Modal modalName={"Stonewall"} />
            </li>

            <li>
              {/* Najdorf type 2 in book */}
              <Modal modalName={"Sicilian"} />
            </li>

            <li>
              <Modal modalName={"Maroczy Bind"} />
            </li>

            <li>
              <Modal modalName={"Benoni"} />
            </li>
            <li>
              {/* KID Type 3 in the book */}
              <Modal modalName={"King's Indian"} />
            </li>

            <li>
              {/* French type 3 */}
              <Modal modalName={"French Advance"} />
            </li>

            <li>
              <Modal modalName={"Closed Ruy Lopez"} />
            </li>
          </ul>
        </div>
        <button className="btn m-1 align-top">Custom Pawn Structure</button>
        {/* Move area */}
        <div className="bg-gray-600 h-4/6 my-2 text-white rounded-sm ">
          The moves go here
        </div>
        <div className="overflow-x-auto">
          <table className="table bg-white">
            {/* head */}
            <thead>
              <tr>
                <th>White name</th>
                <th>White Elo</th>
                <th>Black name</th>
                <th>Black elo</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr className="hover">
                <th className="font-normal">Alexander Alekhine</th>
                <td>2720</td>
                <td>Jose Capablanca</td>
                <td>2730</td>
                <td>1-0</td>
              </tr>
              {/* row 2 */}
              <tr className="hover">
                <th className="font-normal">Kasparov</th>
                <td>2750</td>
                <td>Karpov</td>
                <td>2720</td>
                <td>1-0</td>
              </tr>
              {/* row 3 */}
              <tr className="hover">
                <th className="font-normal">Stein</th>
                <td>2720</td>
                <td>Korchnoi</td>
                <td>2721</td>
                <td>1-0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayArea;
