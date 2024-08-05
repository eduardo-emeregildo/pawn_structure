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

class ChessNode {
  // nodeId is two elt array, halfMove is the position object returned from chess.js. If halfMove is null, then this is the root node, which represents the starting position. parent is the parentNode, the root node will have a null parent, indicating no parent
  constructor(nodeId, halfMoveObj, parent, halfMove = 0) {
    this.nodeId = nodeId;
    this.halfMoveObj = halfMoveObj;
    this.children = [];
    this.parent = parent;
    this.halfMove = halfMove;
  }

  //adds child to current node. variationCount is current tree.numVariations that will get passed in. will return new variationCount
  add(variationCount, halfMoveObj) {
    if (this.children.length == 0) {
      this.children.push(
        new ChessNode(
          [this.nodeId[0], this.nodeId[1] + 1],
          halfMoveObj,
          this,
          this.halfMove + 1
        )
      );

      return variationCount;
    } else {
      this.children.push(
        new ChessNode(
          [variationCount + 1, 1],
          halfMoveObj,
          this,
          this.halfMove + 1
        )
      );

      return variationCount + 1;
    }
  }

  //maybe remove in node in the future
}

class Tree {
  //numVariations is a count of how many variations there are. 1 would mean that only the main line exists. This is essentially how the first elt in nodeId will be filled when new variations are introduced
  constructor() {
    this.numVariations = 1;
    this.root = new ChessNode([1, 0], null, null);
  }

  init(halfMoveObjArr) {
    //initialize the tree (main line). Takes in the array of objects that results from loadPgn method on chess.js
    let curr = this.root;
    for (let i = 0; i < halfMoveObjArr.length; i++) {
      // curr.add(1, halfMoveObjArr[i]);
      this.addNode(curr, halfMoveObjArr[i]);
      curr = curr.children[0];
    }

    return this;
  }

  handleRight(currNode) {
    // go to the next move (child), if size is 0 the end of the line has been reached and returns null, otherwise returns the first child (user would have to click on the frontend to go other variations)
    if (currNode.children.length == 0) {
      return null;
    }

    return currNode.children[0];
  }

  handleLeft(currNode) {
    // go to previous move, if current nodeId is [1,0] and parent is null, you have reached the starting position(root node), so return null. Otherwise return parent node
    if (
      currNode.nodeId[0] == 1 &&
      currNode.nodeId[1] == 0 &&
      currNode.parent == null
    ) {
      return null;
    }

    return currNode.parent;
  }

  reset() {
    this.numVariations = 1;
    this.root = new ChessNode([1, 0], null, null);
    return this;
  }

  incVariationCount() {
    this.numVariations += 1;
  }

  //adds a child to node
  addNode(node, halfMoveObj) {
    let varCount = node.add(this.numVariations, halfMoveObj);
    this.numVariations = varCount;
  }

  //given halfMovenum will return move number(i.e. 1. or 1...) halfMove=1 is first halfMove
  getMoveNum(halfMove) {
    if (halfMove % 2 == 0) {
      return `${halfMove / 2}...`;
    } else return `${(halfMove + 1) / 2}.`;
  }

  // returns the correct move notation(with piece symbols given the halfmove and san)
  getPieceSymbol(halfMove, san) {
    if (san[0] == san[0].toUpperCase() && san[0] != "O") {
      return `${halfMove % 2 == 1 ? whitePieceSymbols[san[0]] : blackPieceSymbols[san[0]]}${san.slice(1)} `;
    } else {
      //a pawn move
      return san + " ";
    }
  }
  //returns renderArray, which is an array of nodes, with sideLines being represented as nested arrays. Give it the root node to return the whole game in array form
  treeRender(treeNode) {
    let res = [];
    treeNode.children.forEach((mainChild) => {
      // if you are the main line, i.e. a childs nodeId = [parent.nodeid[0], parent.nodeid[1] + 1]
      if (
        JSON.stringify(mainChild.parent.nodeId) ==
        JSON.stringify([mainChild.nodeId[0], mainChild.nodeId[1] - 1])
      ) {
        res.push(
          // this.getMoveNum(mainChild.halfMove) +
          //   this.getPieceSymbol(mainChild.halfMove, mainChild.halfMoveObj.san)
          mainChild
        );
      } else {
        //recursive call
        // res = res.concat(this.treeRender(mainChild));

        //below is to switch from using parenthesis to nested arrays
        let tmp = [
          // this.getMoveNum(mainChild.halfMove) + mainChild.halfMoveObj.san,
          mainChild,
        ];
        res.push(tmp.concat(this.treeRender(mainChild)));

        // let tmp = `(${this.getMoveNum(halfMove) + this.getPieceSymbol(halfMove, mainChild.halfMoveObj.san)} `;
        // res.push(tmp + this.treeRender(mainChild, halfMove + 1) + ")");
      }
    });
    if (treeNode.children.length > 0) {
      res = res.concat(this.treeRender(treeNode.children[0]));
    }

    return res;
  }

  // treeRender(treeNode) {
  //   let res = [];
  //   treeNode.children.forEach((mainChild) => {
  //     // if you are the main line, i.e. a childs nodeId = [parent.nodeid[0], parent.nodeid[1] + 1]
  //     if (
  //       JSON.stringify(mainChild.parent.nodeId) ==
  //       JSON.stringify([mainChild.nodeId[0], mainChild.nodeId[1] - 1])
  //     ) {
  //       res.push(mainChild.halfMoveObj.san);
  //     } else {
  //       //recursive call
  //       // res = res.concat(this.treeRender(mainChild));
  //       let tmp = [mainChild.halfMoveObj.san];
  //       res.push(tmp.concat(this.treeRender(mainChild)));
  //     }
  //   });
  //   if (treeNode.children.length > 0) {
  //     res = res.concat(this.treeRender(treeNode.children[0]));
  //   }

  //   return res;
  // }
}

export { Tree };
