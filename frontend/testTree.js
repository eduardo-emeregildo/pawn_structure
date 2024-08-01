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

const treeRenderHybrid = (treeNode) => {
  let res = [];
  treeNode.children.forEach((mainChild) => {
    console.log(mainChild.halfMoveObj.san);
    res.push(mainChild.halfMoveObj.san);

    if (mainChild.nodeId[0] != 1) {
      //recursive call
      res = res.concat(treeRenderHybrid(mainChild));
    }
    // treeRenderHybrid(mainChild.children[0]);
  });
  if (treeNode.children.length > 0) {
    res = res.concat(treeRenderHybrid(treeNode.children[0]));
  }

  return res;
};

const treeRenderDfs = (treeNode) => {
  treeNode.children.map((mainChild) => {
    console.log(mainChild.halfMoveObj.san);
    treeRenderDfs(mainChild);
  });
};

let x = new Chess();
x.loadPgn(sample);
// console.log(x.history({ verbose: true }));

let tree = new Tree();
const halfMoves = x.history({ verbose: true });
tree.init(halfMoves);
console.log(tree.root);

printGameFromTree(tree, halfMoves);

console.log(tree.treeRender(tree.root));

// how to arbitrarily make new moves?
// Initialize a chess.js object with fen, then make the move you want to make(To get which piece,square use the props on react-chessboard, onPieceDrop etc.(After piece has been dropped, have to change the position prop to render new position) Also move validation will be taken care of by chess.js)

console.log("Testing navigation..");
let newVariation = tree.root.children[0];
let newPos = new Chess(newVariation.halfMoveObj.after);
let newMove = newPos.move("e5");
console.log(
  "The first node (That's not a parent has): ",
  newVariation.children.length,
  "Children. the san of this move is: ",
  newVariation.halfMoveObj.san
);

console.log("Now adding one a node...");
tree.addNode(newVariation, newMove);

console.log(
  "Should have 2 children.. ",
  newVariation.children.length,
  "Children"
);
console.log(
  "the node's second child should be e5: ",
  newVariation.children[1].halfMoveObj.san
);

console.log("The trees numVariations should be 2 now: ", tree.numVariations);
console.log("Adding a third child to first move:");
newPos = new Chess(newVariation.halfMoveObj.after);
newMove = newPos.move("Nf6");

tree.addNode(newVariation, newMove);

console.log(
  "Should have 3 children.. ",
  newVariation.children.length,
  "Children"
);

console.log(
  "the node's third child should be Nf6: ",
  newVariation.children[2].halfMoveObj.san,
  " with nodeId [3,1]: ",
  newVariation.children[2].nodeId
);

console.log("The trees numVariations should be 3 now: ", tree.numVariations);

console.log(
  "Now branching adding a move after e5(adding a child newVariation.children[1])"
);

newPos = new Chess(newVariation.children[1].halfMoveObj.after);
newMove = newPos.move("Nf3");
tree.addNode(newVariation.children[1], newMove);

console.log(
  "e5 should have 1 child: ",
  newVariation.children[1].children.length,
  "With nodeId [2,2]: ",
  newVariation.children[1].children[0].nodeId
);

console.log("Now adding two child nodes to Nf6 node: ");

console.log(
  newVariation.children[2].halfMoveObj.san,
  "children: ",
  newVariation.children[2].children.length
);

newPos = new Chess(newVariation.children[2].halfMoveObj.after);
newMove = newPos.move("c4");
tree.addNode(newVariation.children[2], newMove);

newPos = new Chess(newVariation.children[2].halfMoveObj.after);
newMove = newPos.move("Nf3");
tree.addNode(newVariation.children[2], newMove);

console.log(
  "Nf6 should now have 2 children: ",
  newVariation.children[2].children.length
);
console.log(
  "first child should have nodeId [3,2]: ",
  newVariation.children[2].children[0].nodeId
);

console.log(
  "Second child should have nodeId [4,1]: ",
  newVariation.children[2].children[1].nodeId
);

console.log("\nThe first three half moves of the game(mainline) are: ");
console.log(newVariation.halfMoveObj.san);
let temp = tree.handleRight(newVariation);
console.log(temp.halfMoveObj.san);
temp = tree.handleRight(temp);
console.log(temp.halfMoveObj.san);

console.log("Now calling tree render...");
let gameArr = tree.treeRender(tree.root);

gameArr.forEach((game) => {
  console.log(game.halfMoveObj.san);
});

// let newVariation = tree.root.children[0];

// analyze/ fix bfs, might be wrong. its going to be a variaton of bfs.
// Any non zero child(so sideline) will be printed in its entirety, then you continue the printing the mainline
