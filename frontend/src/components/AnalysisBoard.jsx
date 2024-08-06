import React from "react";
import { Chess } from "chess.js";
import { Tree } from "../../MoveTree.js";
import { useState, useEffect } from "react";
//testing purposes
import { tree } from "../../TestTree.js";

const AnalysisBoard = ({ pgn, fetchFen, halfMoves, fetchHalfMoves }) => {
  const [moves, setMoves] = useState(new Tree()); // this will probably be where the tree is defined
  const [header, setHeader] = useState({});

  //stores a reference to current chess node. This will be useful for handleLeft/Right and adding a move since all of these are dependent on the current node. The on click functionality is handled differently since it doesnt depend on current node. initialize to root
  const [currentChessNode, setCurrentChessNode] = useState(moves.root);
  console.log(
    `Current Chess Node is: ${currentChessNode.parent == null ? "Parent" : currentChessNode.halfMoveObj.san}`
  );

  // Another posibility is to make a game state variable and set it to a chess.js object:
  // const [game,setGame] = useState(new Chess());

  //this approach can prove useful to keep track of the game(movenumber, previous position, next position etc)

  // let testTree = tree.treeRender(tree.root);

  const handleLeft = () => {
    let res = moves.handleLeft(currentChessNode);
    if (res != null) {
      if (res.parent == null) {
        //show starting position
        fetchFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        setCurrentChessNode(moves.root);
        fetchHalfMoves([1, 0]);
      } else {
        fetchFen(res.halfMoveObj.after);
        setCurrentChessNode(res);
        fetchHalfMoves(res.nodeId);
      }
    }
  };

  const handleRight = () => {
    let res = moves.handleRight(currentChessNode);
    if (res != null) {
      fetchFen(res.halfMoveObj.after);
      setCurrentChessNode(res);
      fetchHalfMoves(res.nodeId);
    }
  };

  const handleClick = (e, renderArr) => {
    let currNodeId = e.currentTarget.id.split(",");
    fetchHalfMoves([parseInt(currNodeId[0]), parseInt(currNodeId[1])]);
    fetchFen(
      renderArr[parseInt(e.currentTarget.getAttribute("i"))].halfMoveObj.after
    );
    setCurrentChessNode(renderArr[parseInt(e.currentTarget.getAttribute("i"))]);
  };

  // const decodeName = (name) => {};
  useEffect(() => {
    // setMoves(moves.reset());
    if (pgn == "") {
      setHeader({});
      setMoves(moves.reset());
      setCurrentChessNode(moves.root);
    } else {
      const game = new Chess();
      game.loadPgn(pgn);
      console.log("GAME IS: ", game);
      let tmp = new Tree();
      tmp.init(game.history({ verbose: true }));
      setMoves(tmp);
      setHeader(game.header());
      // let renderArr = tmp.treeRender(tmp.root);
      // setCurrentChessNode(renderArr[halfMoves[1] - 1]);
      setCurrentChessNode(tmp.findNodeInMainline(halfMoves));
    }

    // return () => {};
  }, [pgn]);

  //takes in a renderArr[i] resulting from Tree.treeRender() such that renderArr[i] is a sideline, so an array itself
  function displaySideLine(arr) {
    let res = ["("];
    res = res.concat(
      arr.map((move, id) => {
        if (!Array.isArray(move)) {
          // this.getMoveNum(mainChild.halfMove) +
          //   this.getPieceSymbol(mainChild.halfMove, mainChild.halfMoveObj.san)

          // return <span>{+move.halfMoveObj.san}</span>;

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
        // if (JSON.stringify(halfMoves) == JSON.stringify(renderArr[i].nodeId)) {
        //   newCurrentNodeIndex = i;
        // }
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
        //current half move has no sidelines. Display both half moves on same line with 2 cols
        else if (!Array.isArray(renderArr[i + 1])) {
          // if (
          //   JSON.stringify(halfMoves) == JSON.stringify(renderArr[i + 1].nodeId)
          // ) {
          //   newCurrentNodeIndex = i + 1;
          // }
          res.push(
            <div className="flex gap-7" key={i}>
              <div
                className={`hover:bg-sky-700 hover:cursor-pointer w-fit ${JSON.stringify(halfMoves) == JSON.stringify(renderArr[i].nodeId) ? "bg-sky-700" : ""}`}
                id={renderArr[i].nodeId}
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
              <div className="pl-2">{displaySideLine(renderArr[j])}</div>
            );
            counter += 1;
            j += 1;
          }
          i += counter + 1;
        }
      }
    }
    // setCurrentChessNode(renderArr[newCurrentNodeIndex]);
    // console.log(
    //   "current chess node (coming from rendertojsx)",
    //   renderArr[newCurrentNodeIndex]
    // );
    return res;
  }

  return (
    <div
      className="bg-gray-600 h-[40rem] w-[33rem] rounded-md max-h-[40rem] my-2 text-gray-100  flex flex-col gap-2 overflow-scroll focus:outline-none"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          handleLeft();
        } else if (e.key === "ArrowRight") {
          handleRight();
        } else if (e.key === "ArrowUp") {
          fetchFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
          setCurrentChessNode(moves.root);
          fetchHalfMoves([1, 0]);
        }
      }}
    >
      <div className="text-center font-bold">
        {Object.keys(header).length === 0
          ? ""
          : `${header.White} - ${header.Black} (${header.Result == "1/2-1/2" ? "\u00BD - \u00BD" : header.Result})`}
      </div>

      {
        pgn == "" ? "" : renderToJsx(moves.treeRender(moves.root))
        //main branch code
        //  moves.map((move, id) =>
        //     id % 2 == 0 ? (
        //       <div className="flex gap-7" key={id}>
        //         <div className="text-sm">{`${id / 2 + 1}.`}</div>
        //         <div
        //           className={
        //             "hover:bg-sky-700 hover: cursor-pointer " +
        //             (halfMoves == id + 1 ? "bg-sky-700" : "")
        //           }
        //           id={`m${id}`}
        //           onClick={(e) => {
        //             fetchFen(moves[id].after);
        //             fetchHalfMoves(parseInt(e.currentTarget.id.slice(1)) + 1);
        //           }}
        //         >
        //           {move.san[0] == move.san[0].toUpperCase() &&
        //           move.san[0] != "O"
        //             ? `${whitePieceSymbols[move.san[0]]}${move.san.slice(1)}`
        //             : move.san}
        //         </div>
        //         <div
        //           className={
        //             "hover:bg-sky-700 hover: cursor-pointer " +
        //             (halfMoves == id + 2 ? "bg-sky-700" : "")
        //           }
        //           id={`m${id + 1}`}
        //           onClick={(e) => {
        //             fetchFen(moves[id + 1].after);
        //             fetchHalfMoves(parseInt(e.currentTarget.id.slice(1)) + 1);
        //           }}
        //         >
        //           {id + 1 > moves.length - 1
        //             ? null
        //             : moves[id + 1].san[0] ==
        //                   moves[id + 1].san[0].toUpperCase() &&
        //                 moves[id + 1].san[0] != "O"
        //               ? `${blackPieceSymbols[moves[id + 1].san[0]]}${moves[id + 1].san.slice(1)}`
        //               : moves[id + 1].san}
        //         </div>
        //       </div>
        //     ) : null
        //   )
      }
    </div>
  );
};

export default AnalysisBoard;
