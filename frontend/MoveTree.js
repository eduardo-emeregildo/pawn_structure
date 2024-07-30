import { Chess } from "chess.js";
class ChessNode {
  // nodeId is two elt array, halfMove is the position object returned from chess.js. If halfMove is null, then this is the root node, which represents the starting position. parent is the parentNode, the root node will have a null parent, indicating no parent
  constructor(nodeId, halfMoveObj, parent) {
    this.nodeId = nodeId;
    this.halfMoveObj = halfMoveObj;
    this.children = [];
    this.parent = parent;
  }

  //adds child to current node
  add(nodeId, halfMoveObj, parent) {
    //parent is parent node
    this.children.push(new ChessNode(nodeId, halfMoveObj, parent));
  }
  //maybe remove in node in the future
}

class Tree {
  //numVariations is a count of how many variations there are. 1 would mean that only the main line exists. This is essentially how the first elt in nodeId will be filled when new variations are introduced
  constructor() {
    this.numVariations = 1;
    this.root = new ChessNode([1, 0], null, null);
    // this.lastNode = null; // might need this to go back a move
  }

  init(halfMoveObjArr) {
    //initialize the tree (main line). Takes in the array of objects that results from loadPgn method on chess.js
    let curr = this.root;
    for (let i = 0; i < halfMoveObjArr.length; i++) {
      curr.add([1, i + 1], halfMoveObjArr[i], curr);
      curr = curr.children[0];
    }
  }

  handleRight(currNode) {
    // go to the next move (child), if size is 0 the end of the line has been reached and returns null, otherwise returns the first child (user would have to click on the frontend to go other variations)
    if (currNode.children.length == 0) {
      return null;
    }

    return currNode.children[0];
  }

  handleLeft(currNode) {
    // go to previous move, if nodeId is [1,0] and parent is null, you have reached the starting position, so return null. Otherwise return parent node
    if (
      currNode.nodeId[0] == 1 &&
      currNode.nodeId[1] == 0 &&
      currNode.parent == null
    ) {
      return null;
    }

    return currNode.parent;
  }

  setVariationCount() {
    this.numVariations += 1;
  }
}

export { Tree };
