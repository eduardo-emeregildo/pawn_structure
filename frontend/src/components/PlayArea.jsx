import React from "react";
import { Chessboard } from "react-chessboard";
import { SlArrowDown } from "react-icons/sl";

// Look into using daisyui/shadcn/flowbite for styling components, use to include a hero section

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
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>White IQP</a>
            </li>
            <li>
              <a>Maroczy Bind</a>
            </li>
          </ul>
        </div>
        <button className="btn m-1">Custom Pawn Structure</button>
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
