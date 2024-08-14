import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import Table from "./Table";
import AnalysisBoard from "./AnalysisBoard";
import { Chessboard } from "react-chessboard";
import { SlArrowDown } from "react-icons/sl";
import { GiCycle } from "react-icons/gi";
import plans from "../plans.json";
import { Chess } from "chess.js";
import { toast } from "react-toastify";
import { Tree } from "../../MoveTree.js";

//continue testing to find any bugs. Also continue testing on different screen sizes to see if there are additional media queries that need to be added

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

  const [moves, setMoves] = useState(new Tree());
  //stores a reference to current chess node. This will be useful for handleLeft/Right and adding a move since all of these are dependent on the current node. The on click functionality is handled differently since it doesnt depend on current node. initialize to root
  const [currentChessNode, setCurrentChessNode] = useState(moves.root);

  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [isMenuVisible, setIsMenuVisible] = useState(false);

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
  const fetchMoves = (newMoves) => {
    setMoves(newMoves);
  };

  const fetchCurrentChessNode = (newNode) => {
    setCurrentChessNode(newNode);
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

  const handleLeft = () => {
    let res = moves.handleLeft(currentChessNode);
    if (res != null) {
      if (res.parent == null) {
        //show starting position
        setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        setCurrentChessNode(moves.root);
        setHalfMoves([1, 0]);
        if (window.screen.width >= 1280) {
          const element = document.getElementById("heading");
          element.scrollIntoView({
            behavior: "instant",
            block: "nearest",
          });
        }
      } else {
        setFen(res.halfMoveObj.after);
        setCurrentChessNode(res);
        setHalfMoves(res.nodeId);
        if (window.screen.width >= 1280) {
          const element = document.getElementById(res.nodeId.join());
          element.scrollIntoView({
            behavior: "instant",
            block: "nearest",
          });
        }
      }
    }
  };

  const handleRight = () => {
    let res = moves.handleRight(currentChessNode);
    if (res != null) {
      setFen(res.halfMoveObj.after);
      setCurrentChessNode(res);
      setHalfMoves(res.nodeId);
      if (window.screen.width >= 1280) {
        const element = document.getElementById(res.nodeId.join());
        element.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    }
  };

  useEffect(() => {
    if (pgn != "") {
      if (window.screen.width >= 1280) {
        const element = document.getElementById(currentChessNode.nodeId.join());
        element.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    }
  }, [moves]);

  function makeAMove(sourceSquare, targetSquare, piece) {
    if (pgn == "") {
      return false;
    }
    try {
      // check if move has already been made
      if (currentChessNode.children.length != 0) {
        for (const child of currentChessNode.children) {
          if (
            child.halfMoveObj.from == sourceSquare &&
            child.halfMoveObj.to == targetSquare
          ) {
            setHalfMoves(child.nodeId);
            setCurrentChessNode(child);
            setFen(child.halfMoveObj.after);

            if (window.screen.width >= 1280) {
              const element = document.getElementById(child.nodeId.join());
              element.scrollIntoView({
                behavior: "instant",
                block: "nearest",
              });
            }
            return true;
          }
        }
      }
      let pos = new Chess(fen);
      let newMove = pos.move({
        from: sourceSquare,
        to: targetSquare,
      });
      let newTree = new Tree();
      newTree.numVariations = moves.numVariations;
      newTree.root = moves.root;

      newTree.addNode(currentChessNode, newMove);

      setHalfMoves(
        currentChessNode.children[currentChessNode.children.length - 1].nodeId
      );
      setCurrentChessNode(
        (oldNode) => oldNode.children[oldNode.children.length - 1]
      );
      setFen((oldFen) => newMove.after);
      setMoves(newTree);

      return true;
      // console.log(AnalysisBoard.getCurrentChessNode());}
    } catch (error) {
      // console.log("Try blocked failed with error: ", error);
      return false;
    }
  }

  function promotionPieceSelect(piece, promoteFromSquare, promoteToSquare) {
    if (pgn == "") {
      return false;
    }
    try {
      // check if move has already been made
      if (currentChessNode.children.length != 0) {
        for (const child of currentChessNode.children) {
          if (
            child.halfMoveObj.from == promoteFromSquare &&
            child.halfMoveObj.to == promoteToSquare &&
            child.halfMoveObj.promotion == piece[1].toLowerCase()
          ) {
            setHalfMoves(child.nodeId);
            setCurrentChessNode(child);
            setFen(child.halfMoveObj.after);
            if (window.screen.width >= 1280) {
              const element = document.getElementById(child.nodeId.join());
              element.scrollIntoView({
                behavior: "instant",
                block: "nearest",
              });
            }
            return true;
          }
        }
      }

      let pos = new Chess(fen);
      console.log(fen);
      let newMove = pos.move({
        from: promoteFromSquare,
        to: promoteToSquare,
        promotion: piece[1].toLowerCase(),
      });
      let newTree = new Tree();
      newTree.numVariations = moves.numVariations;
      newTree.root = moves.root;
      newTree.addNode(currentChessNode, newMove);
      setHalfMoves(
        currentChessNode.children[currentChessNode.children.length - 1].nodeId
      );
      setCurrentChessNode(
        (oldNode) => oldNode.children[oldNode.children.length - 1]
      );
      setFen((oldFen) => newMove.after);
      setMoves(newTree);
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <div
      className="flex flex-col items-center bg-[#101014] py-10 min-h-screen xl:flex-row xl:justify-evenly xl:items-start"
      onClick={() => {
        if (isMenuVisible) {
          setContextMenuPosition({ x: 0, y: 0 });
          setIsMenuVisible(false);
        }
      }}
    >
      {/* Chessboard */}
      <div
        className="focus:outline-none pb-3"
        tabIndex="0"
        onKeyDown={(e) => {
          if (isMenuVisible) {
            setContextMenuPosition({ x: 0, y: 0 });
            setIsMenuVisible(false);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            handleLeft();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            handleRight();
          } else if (e.key === "ArrowUp" && pgn != "") {
            e.preventDefault();
            setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
            setCurrentChessNode(moves.root);
            setHalfMoves([1, 0]);
            if (window.screen.width >= 1280) {
              const element = document.getElementById("heading");
              element.scrollIntoView({
                behavior: "instant",
                block: "nearest",
              });
            }
          }
        }}
        onDragStart={() => {
          if (isMenuVisible) {
            setContextMenuPosition({ x: 0, y: 0 });
            setIsMenuVisible(false);
          }
        }}
      >
        <Chessboard
          boardWidth={
            window.screen.width >= 768
              ? 650
              : window.screen.width - ~~(window.screen.width * 0.05)
          }
          position={fen}
          animationDuration={150}
          boardOrientation={boardOrientation}
          showPromotionDialog={true}
          onPieceDrop={makeAMove}
          onPromotionPieceSelect={promotionPieceSelect}
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

      <div className="max-[460px]:w-11/12">
        <details className="dropdown" id="mainDropdown" ref={menuRef}>
          <summary
            tabIndex={0}
            role="button"
            className={`btn${window.screen.width <= 460 ? " btn-sm " : " "}m-1 align-bottom`}
          >
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

        <button
          className={`btn${window.screen.width <= 460 ? " btn-sm " : " "}m-1 align-top  ${pgn == "" ? "pointer-events-none bg-gray-500 border-gray-500" : ""}`}
          onClick={() => {
            let headers = pgn.split("\n\r")[0];
            navigator.clipboard.writeText(
              headers + "\n" + moves.treeRenderPgn(moves.root).join("")
            );

            toast.success("Pgn copied to clipboard");
          }}
        >
          Copy Pgn to Clipboard
        </button>

        {/* Analysis board*/}
        <AnalysisBoard
          pgn={pgn}
          fetchFen={fetchFen}
          halfMoves={halfMoves}
          fetchHalfMoves={fetchHalfMoves}
          moves={moves}
          currentChessNode={currentChessNode}
          fetchMoves={fetchMoves}
          fetchCurrentChessNode={fetchCurrentChessNode}
          handleLeft={handleLeft}
          handleRight={handleRight}
          isMenuVisible={isMenuVisible}
          setIsMenuVisible={setIsMenuVisible}
          contextMenuPosition={contextMenuPosition}
          setContextMenuPosition={setContextMenuPosition}
          fetchPgn={fetchPgn}
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
