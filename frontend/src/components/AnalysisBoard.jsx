import React from "react";
import { Chess } from "chess.js";
import { Tree } from "../../MoveTree.js";
import { useState, useEffect } from "react";
import ContextMenu from "./ContextMenu.jsx";
//testing purposes
// import { tree } from "../../TestTree.js";

const AnalysisBoard = ({
  pgn,
  fetchFen,
  halfMoves,
  fetchHalfMoves,
  moves,
  currentChessNode,
  fetchMoves,
  fetchCurrentChessNode,
  handleLeft,
  handleRight,
}) => {
  // const [moves, fetchMoves] = useState(new Tree());
  const [header, setHeader] = useState({});
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  console.log("ISMENUVISIBLE: ", isMenuVisible);
  // let testTree = tree.treeRender(tree.root);

  const handleClick = (e, renderArr) => {
    let currNodeId = e.currentTarget.id.split(",");
    fetchHalfMoves([parseInt(currNodeId[0]), parseInt(currNodeId[1])]);
    fetchFen(
      renderArr[parseInt(e.currentTarget.getAttribute("i"))].halfMoveObj.after
    );
    fetchCurrentChessNode(
      renderArr[parseInt(e.currentTarget.getAttribute("i"))]
    );
  };

  useEffect(() => {
    if (pgn == "") {
      setHeader({});
      fetchMoves(moves.reset());
      fetchCurrentChessNode(moves.root);
    } else {
      const game = new Chess();
      game.loadPgn(pgn);
      let tmp = new Tree();
      tmp.init(game.history({ verbose: true }));
      fetchMoves(tmp);
      setHeader(game.header());
      // let renderArr = tmp.treeRender(tmp.root);
      // fetchCurrentChessNode(renderArr[halfMoves[1] - 1]);

      fetchCurrentChessNode(tmp.findNodeInMainline(halfMoves));
    }

    // return () => {};
  }, [pgn]);

  // useEffect(() => {
  //   if (pgn != "") {
  //     console.log(contextMenuPosition.x, " ", contextMenuPosition.y);
  //     setIsMenuVisible(true);
  //   }

  //   // return () => {};
  // }, [contextMenuPosition]);

  //takes in a renderArr[i] resulting from Tree.treeRender() such that renderArr[i] is a sideline, so an array itself
  function displaySideLine(arr) {
    let res = ["("];
    res = res.concat(
      arr.map((move, id) => {
        if (!Array.isArray(move)) {
          return (
            <span
              className={`hover:bg-sky-700 hover:cursor-pointer w-fit ${JSON.stringify(halfMoves) == JSON.stringify(move.nodeId) ? "bg-sky-700" : ""}`}
              key={move.nodeId}
              id={move.nodeId}
              i={id}
              onClick={(e) => {
                handleClick(e, arr);
              }}
            >
              {(move.halfMove % 2 == 0 && id != 0
                ? ""
                : moves.getMoveNum(move.halfMove)) +
                moves.getPieceSymbol(move.halfMove, move.halfMoveObj.san)}
            </span>
          );
        } else {
          return displaySideLine(move);
        }
      })
    );
    res.push(")");
    return res;
  }

  //takes in the full renderArr from Tree.treeRender()
  function renderToJsx(renderArr) {
    let res = [];
    let i = 0;
    // let newCurrentNodeIndex = null;
    while (i < renderArr.length) {
      //if current move is a mainline move, search to the right for all the side lines deviating from this move
      if (!Array.isArray(renderArr[i])) {
        //if its the last main line move
        if (i + 1 >= renderArr.length) {
          res.push(
            <div
              className={`hover:bg-sky-700 hover:cursor-pointer w-fit ${JSON.stringify(halfMoves) == JSON.stringify(renderArr[i].nodeId) ? "bg-sky-700" : ""}`}
              id={renderArr[i].nodeId}
              key={i}
              i={i}
              onClick={(e) => {
                handleClick(e, renderArr);
              }}
            >
              {moves.getMoveNum(renderArr[i].halfMove) +
                moves.getPieceSymbol(
                  renderArr[i].halfMove,
                  renderArr[i].halfMoveObj.san
                )}
            </div>
          );
          i += 1;
        }
        //current half move has no sidelines. Display both half moves on same line with 2 cols if current move is white. If its black just display the black move
        else if (!Array.isArray(renderArr[i + 1])) {
          if (renderArr[i].halfMove % 2 == 0) {
            res.push(
              <div
                className={`hover:bg-sky-700 hover:cursor-pointer w-fit ${JSON.stringify(halfMoves) == JSON.stringify(renderArr[i].nodeId) ? "bg-sky-700" : ""}`}
                id={renderArr[i].nodeId}
                key={i}
                i={i}
                onClick={(e) => {
                  handleClick(e, renderArr);
                }}
              >
                {moves.getMoveNum(renderArr[i].halfMove) +
                  moves.getPieceSymbol(
                    renderArr[i].halfMove,
                    renderArr[i].halfMoveObj.san
                  )}
              </div>
            );
            i += 1;
          } else {
            res.push(
              <div className="flex gap-7" key={i}>
                <div
                  className={`hover:bg-sky-700 hover:cursor-pointer w-fit ${JSON.stringify(halfMoves) == JSON.stringify(renderArr[i].nodeId) ? "bg-sky-700" : ""}`}
                  id={renderArr[i].nodeId}
                  i={i}
                  onClick={(e) => {
                    handleClick(e, renderArr);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    // let newPosition = { ...contextMenuPosition };
                    // newPosition.x = e.pageX;
                    // newPosition.y = e.pageY + 15;
                    handleClick(e, renderArr);
                    let rect = e.currentTarget.getBoundingClientRect();
                    setContextMenuPosition({
                      x: rect.left + window.scrollX,
                      y: rect.top + window.scrollY + 20,
                    });
                    setIsMenuVisible(true);
                    // handleClick(e, renderArr);

                    // setIsMenuVisible(true);
                    // console.log(e.pageX);
                    // console.log(e.pageY);
                  }}
                >
                  {moves.getMoveNum(renderArr[i].halfMove) +
                    moves.getPieceSymbol(
                      renderArr[i].halfMove,
                      renderArr[i].halfMoveObj.san
                    )}
                </div>

                <div
                  className={`hover:bg-sky-700 hover:cursor-pointer w-fit ${JSON.stringify(halfMoves) == JSON.stringify(renderArr[i + 1].nodeId) ? "bg-sky-700" : ""}`}
                  id={renderArr[i + 1].nodeId}
                  i={i + 1}
                  onClick={(e) => {
                    handleClick(e, renderArr);
                  }}
                  key={renderArr[i + 1].nodeId}
                >
                  {(renderArr[i + 1].halfMove % 2 == 0
                    ? ""
                    : moves.getMoveNum(renderArr[i + 1].halfMove)) +
                    moves.getPieceSymbol(
                      renderArr[i + 1].halfMove,
                      renderArr[i + 1].halfMoveObj.san
                    )}
                </div>
              </div>
            );
            i += 2;
          }
        }
        //there is at least one side line. First push main move, then search to the right and push all side lines stemming off of this point
        else {
          //first push the main move
          res.push(
            <div
              className={`hover:bg-sky-700 hover:cursor-pointer w-fit ${JSON.stringify(halfMoves) == JSON.stringify(renderArr[i].nodeId) ? "bg-sky-700" : ""}`}
              id={renderArr[i].nodeId}
              i={i}
              onClick={(e) => {
                handleClick(e, renderArr);
              }}
              key={i}
            >
              {moves.getMoveNum(renderArr[i].halfMove) +
                moves.getPieceSymbol(
                  renderArr[i].halfMove,
                  renderArr[i].halfMoveObj.san
                )}
            </div>
          );

          let counter = 0;
          let j = i + 1;
          while (Array.isArray(renderArr[j])) {
            res.push(
              <div className="pl-2 leading-relaxed" key={j}>
                {displaySideLine(renderArr[j])}
              </div>
            );
            counter += 1;
            j += 1;
          }
          i += counter + 1;
        }
      } else {
        //case where current elt is an array. displaySideline until you reach a main line node
        while (Array.isArray(renderArr[i])) {
          res.push(
            <div className="pl-2" key={i}>
              {displaySideLine(renderArr[i])}
            </div>
          );
          i += 1;
        }
      }
    }
    return res;
  }
  return (
    <div
      className="bg-gray-600 h-[40rem] w-[33rem] rounded-md max-h-[40rem] my-2 text-gray-100  flex flex-col gap-2 overflow-scroll focus:outline-none"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handleLeft();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          handleRight();
        } else if (e.key === "ArrowUp" && pgn != "") {
          e.preventDefault();
          fetchFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
          fetchCurrentChessNode(moves.root);
          fetchHalfMoves([1, 0]);
          const element = document.getElementById("heading");
          element.scrollIntoView({
            behavior: "instant",
            block: "nearest",
          });
        }
      }}
    >
      <div className="text-center font-bold" id="heading">
        {Object.keys(header).length === 0
          ? ""
          : `${header.White} - ${header.Black} (${header.Result == "1/2-1/2" ? "\u00BD - \u00BD" : header.Result})`}
      </div>

      {
        pgn == "" ? "" : renderToJsx(moves.treeRender(moves.root))
        //moves.treeRender(moves.root)
      }
      <ContextMenu
        contextMenuPosition={contextMenuPosition}
        isMenuVisible={isMenuVisible}
      />
    </div>
  );
};

export default AnalysisBoard;
