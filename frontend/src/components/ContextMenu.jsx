import { Tree } from "../../MoveTree";

const ContextMenu = ({
  contextMenuPosition,
  isMenuVisible,
  currentChessNode,
  fetchCurrentChessNode,
  moves,
  fetchMoves,
  fetchFen,
  fetchHalfMoves,
  fetchPgn,
}) => {
  return (
    <ul
      style={{
        top: `${contextMenuPosition.y}px`,
        left: `${contextMenuPosition.x}px`,
      }}
      className={`menu bg-gray-900 rounded-box absolute ${isMenuVisible ? "" : " hidden"}`}
    >
      <li
        className="hover:bg-gray-700"
        onClick={(e) => {
          let newTree = new Tree();
          newTree.numVariations = moves.numVariations;
          newTree.root = moves.root;
          let newCurr = currentChessNode.parent;
          newTree.deleteNode(currentChessNode);
          //if parent is root node and
          if (newCurr.nodeId[0] == 1 && newCurr.nodeId[1] == 0) {
            if (currentChessNode.nodeId[0] == 1) {
              fetchPgn("");
              fetchHalfMoves([1, 0]);
              //fetchCurrentChessNode(newCurr);
              fetchFen(
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              );
              //fetchMoves(newTree);
            } else {
              fetchHalfMoves(newCurr.children[0].nodeId);
              fetchCurrentChessNode(newCurr.children[0]);
              fetchFen(newCurr.children[0].halfMoveObj.after);
              fetchMoves(newTree);
            }
          } else {
            fetchHalfMoves(newCurr.nodeId);
            fetchCurrentChessNode(newCurr);
            fetchFen(newCurr.halfMoveObj.after);
            fetchMoves(newTree);
          }
        }}
      >
        <a>Delete Move</a>
      </li>
    </ul>
  );
};

export default ContextMenu;
