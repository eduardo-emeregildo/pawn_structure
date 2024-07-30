import { Tree } from "./MoveTree.js";
import { Chess } from "chess.js";

const sample = `[Event "European Women's Blitz Championship 2023"]
[Site "?"]
[Date "????.??.??"]
[Round "6.20"]
[White "Guichard, Pauline"]
[Black "Dubois, Martine"]
[Result "1-0"]
[WhiteElo "2157"]
[BlackElo "1923"]
[ECO "D26d"]
[Source "LichessBroadcast"]
[WhiteTitle "IM"]
[BlackTitle "WIM"]
[Opening "Queen's Gambit Accepted: Old Variation"]

1.d4 d5 2.c4 dxc4 3.e3 Nf6 4.Bxc4 e6 5.Nf3 a6 6.O-O Nbd7 7.Nbd2 c5 8.e4 b5 9.e5 bxc4 10.exf6 Qxf6 11.Nxc4 Bb7 12.Nfe5 Nxe5 13.dxe5 Qg6 14.Qa4+ Ke7 15.f3 Rd8 16.Be3 Rd5 17.Qb3 Bc6 18.Qb6 Bd7 19.Rad1 Ke8 20.Rxd5 exd5 21.Qb8+ Ke7 22.Bxc5+ Ke6 23.Bxf8 Rxf8 24.Qxf8 dxc4 25.Qd6+ Kf5 26.Qxd7+ 1-0
`;

function printGameFromTree(tree, history) {
  let curr = tree.root.children[0];
  for (let i = 0; i < history.length; i++) {
    console.log(
      "Current NodeId: ",
      curr.nodeId,
      " Current move: ",
      curr.halfMoveObj.san,
      " Current node's parent nodeId: ",
      curr.parent.nodeId
    );
    // console.log(curr);
    curr = curr.children[0];
  }
}

let x = new Chess();
x.loadPgn(sample);
// console.log(x.history({ verbose: true }));

let tree = new Tree();
const halfMoves = x.history({ verbose: true });
tree.init(halfMoves);
console.log(tree.root);

printGameFromTree(tree, halfMoves);

// how to arbitrarily make new moves?
// Initialize a chess.js object with fen, then make the move you want to make(To get which piece,square use the props on react-chessboard, onPieceDrop etc.(After piece has been dropped, have to change the position prop to render new position) Also move validation will be taken care of by chess.js)

console.log("Testing navigation..");
let newVariation = tree.root.children[0];
let newPos = new Chess(newVariation.halfMoveObj.after);
let newMove = newPos.move("e5");
console.log(
  "The first node (That's not a parent has): ",
  newVariation.children.length,
  "Children"
);
console.log("Now adding one a node...");
newVariation.add([2, 1], newMove, newVariation);
console.log(
  "Should have 2 children.. ",
  newVariation.children.length,
  "Children"
);
// console.log(newVariation.children[1].halfMoveObj.san);
console.log("\nThe first three half moves of the game are: ");
console.log(newVariation.halfMoveObj.san);
let temp = tree.handleRight(newVariation);
console.log(temp.halfMoveObj.san);
temp = tree.handleRight(temp);
console.log(temp.halfMoveObj.san);
console.log(
  "Now setting the current node to the second child of the first non-root node"
);
temp = newVariation.children[1];
console.log("The san of the current node is: ", temp.halfMoveObj.san);

console.log(
  "After calling handleRight, result should be null because it is the end of line. Result is -> ",
  tree.handleRight(temp)
);
temp = tree.handleLeft(temp);
console.log(
  "After calling handleLeft, the resulting node's san should be d4. Result is -> ",
  temp.halfMoveObj.san
);

console.log(
  "Now we are back in the main line. The next 3 halfmove sans should be: d5 c4 dxc4"
);
temp = tree.handleRight(temp);
console.log(temp.halfMoveObj.san);
temp = tree.handleRight(temp);
console.log(temp.halfMoveObj.san);
temp = tree.handleRight(temp);
console.log(temp.halfMoveObj.san);
