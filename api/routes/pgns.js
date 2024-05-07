const express = require('express');
const router = express.Router();
const queryHandler = require("../../queryHandler");

// get pgn given db name(scid) and gamenumber
router.get('/:baseName/:gameNumber', async (req,res,next) => {
    const result =  queryHandler.getPgn(req.params.baseName,req.params.gameNumber);
    res.status(200).json(
        {
            message: "iT WoERKS",
            output: result

        });
});



module.exports = router;