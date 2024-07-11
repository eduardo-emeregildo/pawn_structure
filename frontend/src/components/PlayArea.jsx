import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import Table from "./Table";
import { Chessboard } from "react-chessboard";
import { SlArrowDown } from "react-icons/sl";
import plans from "../plans.json";

// update the tables in psql to have the extra movenumber column (https://stackoverflow.com/questions/8910494/how-to-update-selected-rows-with-values-from-a-csv-file-in-postgres),get chessboard to work , try to make common ps and custom buttons align

const PlayArea = () => {
  const [games, setGames] = useState({ output: [], offset: 0, tableName: "" });

  const [caption, setCaption] = useState("");

  const fetchCaption = (captionName) => {
    // const res = await fetch("api/queries/IQP/0");
    // const data = await res.json();
    // return data.output;
    setCaption(captionName);
  };

  const fetchGames = (gamesObj) => {
    // const res = await fetch("api/queries/IQP/0");
    // const data = await res.json();
    // return data.output;
    setGames(gamesObj);
  };

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        document.getElementById("mainDropdown").removeAttribute("open");
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className="flex justify-evenly bg-[#101014] py-10 min-h-screen ">
      {/* Chessboard */}
      <div>
        <Chessboard boardWidth="650" />
      </div>

      {/* List of games, pawn structure dropdown/button, moves area*/}

      <div>
        <details className="dropdown" id="mainDropdown" ref={menuRef}>
          <summary tabIndex={0} role="button" className="btn m-1 align-bottom">
            <SlArrowDown />
            Common Pawn Structures
          </summary>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box h-52 overflow-auto block"
          >
            {plans.map((plan) => (
              <li key={plan.id}>
                <Modal
                  id={plan.id}
                  planObj={plan}
                  fetchGames={fetchGames}
                  fetchCaption={fetchCaption}
                />
              </li>
            ))}
          </ul>
        </details>

        <button className="btn m-1 align-top">Custom Pawn Structure</button>

        {/* Move area */}
        <div className="bg-gray-600 h-4/6 my-2 text-white rounded-sm">
          The moves go here
        </div>

        <Table games={games} caption={caption} fetchGames={fetchGames} />
      </div>
    </div>
  );
};

export default PlayArea;
