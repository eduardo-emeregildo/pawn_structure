import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import Table from "./Table";
import AnalysisBoard from "./AnalysisBoard";
import { Chessboard } from "react-chessboard";
import { SlArrowDown } from "react-icons/sl";
import { GiCycle } from "react-icons/gi";
import plans from "../plans.json";

//implement adding a move, highlight right half move on piece drag, get engine analysis, make the analysis board scroll down on arrow key press, try to make common ps and custom buttons align

const PlayArea = () => {
  const [games, setGames] = useState({ output: [], offset: 0, tableName: "" });

  const [caption, setCaption] = useState("");
  const [boardOrientation, setBoardOrientation] = useState("white");

  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  //halfMoves will hold the nodeId of the current node being displayed, defaults to [1,0] since root node has nodeId [1,0]
  const [halfMoves, setHalfMoves] = useState([1, 0]);
  const [pgn, setPgn] = useState("");
  //   const test = `[Event "European Women's Blitz Championship 2023"]
  // [Site "?"]
  // [Date "????.??.??"]
  // [Round "6.20"]
  // [White "Guichard, Pauline"]
  // [Black "Dubois, Martine"]
  // [Result "1-0"]
  // [WhiteElo "2157"]
  // [BlackElo "1923"]
  // [ECO "D26d"]
  // [Source "LichessBroadcast"]
  // [WhiteTitle "IM"]
  // [BlackTitle "WIM"]
  // [Opening "Queen's Gambit Accepted: Old Variation"]

  // 1.d4 d5 2.c4 dxc4 3.e3 Nf6 4.Bxc4 e6 5.Nf3 a6 6.O-O Nbd7 7.Nbd2 c5 8.e4 b5 9.e5 bxc4 10.exf6 Qxf6 11.Nxc4 Bb7 12.Nfe5 Nxe5 13.dxe5 Qg6 14.Qa4+ Ke7 15.f3 Rd8 16.Be3 Rd5 17.Qb3 Bc6 18.Qb6 Bd7 19.Rad1 Ke8 20.Rxd5 exd5 21.Qb8+ Ke7 22.Bxc5+ Ke6 23.Bxf8 Rxf8 24.Qxf8 dxc4 25.Qd6+ Kf5 26.Qxd7+ 1-0
  // `;
  //   const read = new Chess();
  //   read.loadPgn(test);
  //   console.log(read.history({ verbose: true }));

  const fetchHalfMoves = (newHalfMoves) => {
    setHalfMoves(newHalfMoves);
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
        <Chessboard
          boardWidth="650"
          position={fen}
          animationDuration={150}
          boardOrientation={boardOrientation}
        />
        <button
          className="btn btn-xs mt-3"
          onClick={() => {
            boardOrientation == "white"
              ? setBoardOrientation("black")
              : setBoardOrientation("white");
          }}
        >
          <GiCycle />
        </button>
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
                  fetchHalfMoves={fetchHalfMoves}
                />
              </li>
            ))}
          </ul>
        </details>

        <button className="btn m-1 align-top">Custom Pawn Structure</button>

        {/* Analysis board*/}
        <AnalysisBoard
          pgn={pgn}
          fetchFen={fetchFen}
          halfMoves={halfMoves}
          fetchHalfMoves={fetchHalfMoves}
        />

        <Table
          games={games}
          caption={caption}
          fetchGames={fetchGames}
          fetchFen={fetchFen}
          fetchPgn={fetchPgn}
          fetchHalfMoves={fetchHalfMoves}
        />
      </div>
    </div>
  );
};

export default PlayArea;
