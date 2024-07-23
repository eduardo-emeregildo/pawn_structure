const express = require("express");
const router = express.Router();
const queryHandler = require("../../queryHandler");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");

// get pgn given db name(scid) and gamenumber
//if tableName is not in default tables, will check auth header
router.get(
  "/:baseName/:gameNumber/:tableName/:moveNumber",
  (req, res, next) => {
    if (!(req.params.tableName in queryHandler.defaultTables)) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
      } catch (error) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
    }

    const result = queryHandler.getPgn(
      req.params.baseName,
      req.params.gameNumber,
      req.params.moveNumber
    );
    const splitResult = result.split(":FEN:");

    res.status(200).json({
      pgn: splitResult[0],
      fen: splitResult[1],
      halfMoves: parseInt(splitResult[2]),
    });
  }
);

module.exports = router;
