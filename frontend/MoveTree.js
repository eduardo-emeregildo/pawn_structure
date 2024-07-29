import { Chess } from "chess.js";
class ChessNode {
  // nodeId is two elt array, halfMove is the position object returned from chess.js. If halfMove is null, then this is the root node, which represents the starting position
  constructor(nodeId, halfMoveObj) {
    this.nodeId = nodeId;
    this.halfMoveObj = halfMoveObj;
    this.children = [];
  }

  add(node, halfMoveObj) {
    this.children.push(new ChessNode(node, halfMoveObj));
  }

  // remove(data) {
  //   this.children = this.children.filter((node) => {
  //     return node.data !== data;
  //   });
  // }
}

class Tree {
  //numVariations is a count of how many variations there are. 1 would mean that only the main line exists. This is essentially how the first elt in nodeId will be filled when new variations are introduced
  constructor() {
    this.numVariations = 1;
    this.root = new ChessNode([1, 0], null);
    // this.lastNode = null; // might need this to go back a move
  }

  init(halfMoveObjArr) {
    //initialize the tree (main line). Takes in the array of objects that results from loadPgn method on chess.js
    let curr = this.root;
    for (let i = 0; i < halfMoveObjArr.length; i++) {
      curr.add([1, i + 1], halfMoveObjArr[i]);
      curr = curr.children[0];
    }
  }
}

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
let x = new Chess();
x.loadPgn(sample);
// console.log(x.history({ verbose: true }));

let tree = new Tree();
const halfMoves = x.history({ verbose: true });
tree.init(halfMoves);
console.log(tree.root);

function printGameFromTree(tree, history) {
  let curr = tree.root.children[0];
  for (let i = 0; i < history.length; i++) {
    console.log(curr.halfMoveObj.san);
    // console.log(curr);
    curr = curr.children[0];
  }
}
printGameFromTree(tree, halfMoves);
