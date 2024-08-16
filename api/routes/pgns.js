const express = require("express");
const router = express.Router();
const queryHandler = require("../../queryHandler");

router.get(
  "/:baseName/:gameNumber/:tableName/:moveNumber",
  (req, res, next) => {
    if (!(req.params.tableName in queryHandler.defaultTables)) {
      return res.status(404).json({
        message: "Not found",
      });
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
