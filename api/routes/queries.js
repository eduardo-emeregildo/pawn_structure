const express = require("express");
const router = express.Router();
const queryHandler = require("../../queryHandler");

router.get("/:tableName/:offset", async (req, res, next) => {
  if (!(req.params.tableName in queryHandler.defaultTables)) {
    return res.status(404).json({
      message: "Not found",
    });
  }

  const output = await queryHandler.getGameInfo(
    req.params.tableName,
    req.params.offset
  );

  res.status(200).json({
    tableName: req.params.tableName,
    offset: req.params.offset,
    output: output,
  });
});

module.exports = router;
