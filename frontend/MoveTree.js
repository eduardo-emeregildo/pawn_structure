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
}

class Tree {
  //numVariations is a count of how many total variations have existed. 1 would mean that only the main line existed. ex: If numVariations = 3 and a node is deleted, numVariations wont change as 3 is still the total number of variations that have existed. This is essentially how the first elt in nodeId will be filled when new variations are introduced
  constructor() {
    this.numVariations = 1;
    this.root = new ChessNode([1, 0], null, null);
  }

  //initialize the tree (main line). Takes in the array of objects that results from loadPgn method on chess.js
  init(halfMoveObjArr) {
    let curr = this.root;
    for (let i = 0; i < halfMoveObjArr.length; i++) {
      this.addNode(curr, halfMoveObjArr[i]);
      curr = curr.children[0];
    }

    return this;
  }

  handleRight(currNode) {
    if (currNode.children.length == 0) {
      return null;
    }

    return currNode.children[0];
  }

  handleLeft(currNode) {
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

  addNode(node, halfMoveObj) {
    let varCount = node.add(this.numVariations, halfMoveObj);
    this.numVariations = varCount;
  }
  // If node is mainline(nodeid[0] = 1) parent's children is set to [] to preserve main line
  deleteNode(targetNode) {
    if (targetNode.parent == null) {
      return;
    }

    //handles deleting a mainline move. clears the parent
    if (targetNode.nodeId[0] == 1) {
      //if its the first main line move that is being deleted, reset tree since there would be no variation to show
      if (targetNode.nodeId[1] == 1) {
        this.reset();
      } else {
        targetNode.parent.children = [];
      }
    } else {
      //search for index in parent children array. Does linear search for array size <= 128 since it performs better than binary search at these sizes
      if (targetNode.parent.children.length <= 128) {
        let arrIndex = targetNode.parent.children.indexOf(targetNode);
        targetNode.parent.children.splice(arrIndex, 1);
      } else {
        let l = 0;
        let r = targetNode.parent.children.length - 1;
        while (l <= r) {
          let m = Math.floor((l + r) / 2);
          if (targetNode.nodeId[0] > targetNode.parent.children[m].nodeId[0]) {
            l = m + 1;
          } else if (
            targetNode.nodeId[0] < targetNode.parent.children[m].nodeId[0]
          ) {
            r = m - 1;
          } else {
            targetNode.parent.children.splice(m, 1);
          }
        }
      }
    }
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
    treeNode.children.forEach((mainChild, index) => {
      // if you are the main line, i.e. a childs nodeId = [parent.nodeid[0], parent.nodeid[1] + 1]
      if (index == 0) {
        res.push(mainChild);
      } else {
        let tmp = [mainChild];
        res.push(tmp.concat(this.treeRender(mainChild)));
      }
    });
    if (treeNode.children.length > 0) {
      res = res.concat(this.treeRender(treeNode.children[0]));
    }
    return res;
  }

  //same as treeRender but returns an array of strings that can be joined to form a new pgn
  treeRenderPgn(treeNode) {
    let res = [];
    treeNode.children.forEach((mainChild, index) => {
      // if you are the main line, i.e. a childs nodeId = [parent.nodeid[0], parent.nodeid[1] + 1]
      if (index == 0) {
        res.push(
          (mainChild.halfMove % 2 == 0
            ? ""
            : this.getMoveNum(mainChild.halfMove)) +
            " " +
            mainChild.halfMoveObj.san +
            " "
        );
      } else {
        let tmp =
          "(" +
          this.getMoveNum(mainChild.halfMove) +
          " " +
          mainChild.halfMoveObj.san +
          " ";
        res.push(tmp + this.treeRenderPgn(mainChild).join("") + ") ");
      }
    });
    if (treeNode.children.length > 0) {
      res = res.concat(this.treeRenderPgn(treeNode.children[0]));
    }
    return res;
  }

  //given a node id in the main line, return the chessNode matching the nodeID. returns null if not found or if nodeID not in mainline
  findNodeInMainline(nodeId, start = this.root) {
    if (nodeId[0] != 1) {
      return null;
    }
    if (JSON.stringify(start.nodeId) == JSON.stringify(nodeId)) {
      return start;
    } else if (start.children.length == 0) {
      return null;
    } else return this.findNodeInMainline(nodeId, start.children[0]);
  }

  //deep copying whole tree. Call with no args. Unfortunate but seems like I must do this to update state in react
  deepCopy(start = this.root, parent = null) {
    let tree = new Tree();

    tree.numVariations = this.numVariations;
    let newHalfMove =
      start.halfMoveObj == null ? null : { ...start.halfMoveObj };

    tree.root = new ChessNode(
      [...start.nodeId],
      newHalfMove,
      parent,
      start.halfMove
    );
    if (start.children.length != 0) {
      for (let i = 0; i < start.children.length; i++) {
        let tmp = this.deepCopy(start.children[i], tree.root);
        tree.root.children.push(tmp.root);
      }
    }
    return tree;
  }

  //find a node in the whole tree
  findNode(nodeId, start = this.root) {
    if (JSON.stringify(start.nodeId) == JSON.stringify(nodeId)) {
      return start;
    }

    if (start.children.length == 0) {
      return null;
    }

    for (const child of start.children) {
      let res = this.findNode(nodeId, child);
      if (res != null) {
        return res;
      }
    }
  }
}

export { Tree };
