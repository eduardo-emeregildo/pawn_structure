import React from "react";
import { Chess } from "chess.js";
import { useState, useEffect } from "react";

const AnalysisBoard = ({ pgn, fetchFen, halfMoves, fetchHalfMoves }) => {
  const [moves, setMoves] = useState([]); // this will probably be where the tree is defined
  const [header, setHeader] = useState({});
  // Another posibility is to make a game state variable and set it to a chess.js object:
  // const [game,setGame] = useState(new Chess());

  //this approach can prove useful to keep track of the game(movenumber, previous position, next position etc)

  //code point for pieces, used in movearea

  const blackPieceSymbols = {
    K: "\u2654",
    Q: "\u2655",
    R: "\u2656",
    B: "\u2657",
    P: "\u2659",
    N: "\u2658",
  };
  const whitePieceSymbols = {
    N: "\u265E",
    K: "\u265A",
    Q: "\u265B",
    R: "\u265C",
    B: "\u265D",
    P: "\u265F",
  };

  const handleLeft = () => {
    if (halfMoves > 0) {
      fetchFen(moves[halfMoves - 1].before);
      fetchHalfMoves(halfMoves - 1);
    }
  };

  const handleRight = () => {
    if (halfMoves < moves.length) {
      fetchFen(moves[halfMoves].after);
      fetchHalfMoves(halfMoves + 1);
    }
  };

  useEffect(() => {
    if (pgn == "") {
      setMoves([]);
      setHeader({});
    } else {
      const game = new Chess();
      game.loadPgn(pgn);
      console.log("GAME IS: ", game);
      setMoves(game.history({ verbose: true }));
      setHeader(game.header());
    }

    // return () => {};
  }, [pgn]);

  return (
    <div
      className="bg-gray-600 h-4/6 my-2 text-gray-100 rounded-sm flex flex-col gap-2 overflow-y-scroll focus:outline-none"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          handleLeft();
        } else if (e.key === "ArrowRight") {
          handleRight();
        } else if (e.key === "ArrowUp") {
          fetchFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
          fetchHalfMoves(0);
        } else if (e.key === "ArrowDown") {
          fetchFen(moves[moves.length - 1].after);
          fetchHalfMoves(moves.length);
        }
      }}
    >
      {pgn == ""
        ? ""
        : moves.map((move, id) =>
            id % 2 == 0 ? (
              <div className="flex gap-7" key={id}>
                <div className="text-sm">{`${id / 2 + 1}.`}</div>
                <div
                  className={
                    "hover:bg-sky-700 hover: cursor-pointer " +
                    (halfMoves == id + 1 ? "bg-sky-700" : "")
                  }
                  id={`m${id}`}
                  onClick={(e) => {
                    fetchFen(moves[id].after);
                    fetchHalfMoves(parseInt(e.currentTarget.id.slice(1)) + 1);
                  }}
                >
                  {move.san[0] == move.san[0].toUpperCase() &&
                  move.san[0] != "O"
                    ? `${whitePieceSymbols[move.san[0]]}${move.san.slice(1)}`
                    : move.san}
                </div>
                <div
                  className={
                    "hover:bg-sky-700 hover: cursor-pointer " +
                    (halfMoves == id + 2 ? "bg-sky-700" : "")
                  }
                  id={`m${id + 1}`}
                  onClick={(e) => {
                    fetchFen(moves[id + 1].after);
                    fetchHalfMoves(parseInt(e.currentTarget.id.slice(1)) + 1);
                  }}
                >
                  {id + 1 > moves.length - 1
                    ? null
                    : moves[id + 1].san[0] ==
                          moves[id + 1].san[0].toUpperCase() &&
                        moves[id + 1].san[0] != "O"
                      ? `${blackPieceSymbols[moves[id + 1].san[0]]}${moves[id + 1].san.slice(1)}`
                      : moves[id + 1].san}
                </div>
              </div>
            ) : null
          )}

      {/* <div className="flex gap-7">
      <div className="text-sm">1.</div>
      <div>e4</div>
      <div>e5</div>
    </div>
    <div className="flex gap-7">
      <div className="text-sm">2.</div>
      <div>{`${pieceSymbols.WN}f3`}</div>
      <div>{`${pieceSymbols.BN}c6`}</div>
    </div>
    <div>This is a variation</div>
    <div className="flex gap-7">
      <div className="text-sm">3.</div>
      <div>{`${pieceSymbols.WB}b5`}</div>
      <div>a6</div>
    </div> */}
    </div>
  );
};

export default AnalysisBoard;
