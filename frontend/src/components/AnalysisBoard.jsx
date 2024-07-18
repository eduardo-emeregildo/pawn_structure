import React from "react";
import { Chess } from "chess.js";
import { useState, useEffect } from "react";

const AnalysisBoard = ({ pgn }) => {
  const [moves, setMoves] = useState([]); // this will probably be where the tree is defined
  const [header, setHeader] = useState({});

  useEffect(() => {
    if (pgn == "") {
      setMoves([]);
      setHeader({});
    } else {
      const game = new Chess();
      game.loadPgn(pgn);
      setMoves(game.history());
      setHeader(game.header());
    }

    // return () => {};
  }, [pgn]);

  return (
    <div className="bg-gray-600 h-4/6 my-2 text-white rounded-sm flex flex-col gap-2">
      {pgn == ""
        ? ""
        : moves.map((move, id) =>
            id % 2 == 0 ? (
              <div className="flex gap-7">
                <div className="text-sm">{`${id / 2 + 1}.`}</div>
                <div>{move}</div>
                <div>{id + 1 > moves.length - 1 ? null : moves[id + 1]}</div>
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
