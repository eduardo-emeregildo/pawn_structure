import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import Table from "./Table";
import AnalysisBoard from "./AnalysisBoard";
import { Chessboard } from "react-chessboard";
import { SlArrowDown } from "react-icons/sl";
import plans from "../plans.json";
import { Chess } from "chess.js";

// get the piece symbols on the pgn in the analysis board,implement handle right handle left functionality, fix styling, get engine analysis, try to make common ps and custom buttons align

const PlayArea = () => {
  const [games, setGames] = useState({ output: [], offset: 0, tableName: "" });

  const [caption, setCaption] = useState("");

  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  const [pgn, setPgn] = useState("");

  //code point for pieces, used in movearea
  const pieceSymbols = {
    BK: "\u2654",
    BQ: "\u2655",
    BR: "\u2656",
    BB: "\u2657",
    WN: "\u265E",
    BP: "\u2659",
    WK: "\u265A",
    WQ: "\u265B",
    WR: "\u265C",
    WB: "\u265D",
    BN: "\u2658",
    WP: "\u265F",
  };

  const fetchPgn = (newPgn) => {
    setPgn(newPgn);
  };

  const fetchFen = (newFen) => {
    setFen(newFen);
  };

  const fetchCaption = (captionName) => {
    setCaption(captionName);
  };

  const fetchGames = (gamesObj) => {
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
        <Chessboard boardWidth="650" position={fen} />
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
                  fetchFen={fetchFen}
                  fetchPgn={fetchPgn}
                />
              </li>
            ))}
          </ul>
        </details>

        <button className="btn m-1 align-top">Custom Pawn Structure</button>

        {/* Analysis board*/}
        <AnalysisBoard pgn={pgn} />

        <Table
          games={games}
          caption={caption}
          fetchGames={fetchGames}
          fetchFen={fetchFen}
          fetchPgn={fetchPgn}
        />
      </div>
    </div>
  );
};

export default PlayArea;
