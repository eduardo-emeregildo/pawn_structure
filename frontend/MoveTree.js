import { Chess } from "chess.js";
class ChessNode {
  // nodeId is two elt array, halfMove is the position object returned from chess.js. If halfMove is null, then this is the root node, which represents the starting position. parent is the parentNode, the root node will have a null parent, indicating no parent
  constructor(nodeId, halfMoveObj, parent) {
    this.nodeId = nodeId;
    this.halfMoveObj = halfMoveObj;
    this.children = [];
    this.parent = parent;
  }

  //adds child to current node. variationCount is current tree.numVariations that will get passed in. will return new variationCount
  add(variationCount, halfMoveObj) {
    if (this.children.length == 0) {
      this.children.push(
        new ChessNode([this.nodeId[0], this.nodeId[1] + 1], halfMoveObj, this)
      );

      return variationCount;
    } else {
      this.children.push(
        new ChessNode([variationCount + 1, 1], halfMoveObj, this)
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

  // returns an array with right ordering(similar ordering to chess.com) for rendering in react. Give it the root node and will include all lines
  treeRender(treeNode) {
    let res = [];
    treeNode.children.forEach((mainChild) => {
      res.push(mainChild);

      if (mainChild.nodeId[0] != 1) {
        //recursive call
        res = res.concat(this.treeRender(mainChild));
      }
    });
    if (treeNode.children.length > 0) {
      res = res.concat(this.treeRender(treeNode.children[0]));
    }

    return res;
  }
}

export { Tree };
