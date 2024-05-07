const express = require('express');
const router = express.Router();
const queryHandler = require("../../queryHandler");


// get gameinfo given the table name and offset, might need to add some logic to cover the case of custom table
router.get('/:tableName/:offset', async (req,res,next) => {
    const output = await queryHandler.getGameInfo(req.params.tableName,req.params.offset);

    res.status(200).json(
        {
            message: "Handling GET Requests to /queries/tablename/offset",
            tableName: req.params.tableName,
            offset: req.params.offset,
            output: output

        });
});

router.post('/', async(req,res,next) => {
    //Here write the logic to execute the query tcl, just call query function from queries_test.js
    await queryHandler.query(req.body.baseName,req.body.query,req.body.filename);
    console.log("QUERY FINISHED!!!");

    res.status(201).json(
        {
            message: "Handling POST Requests to /queries",
        });
});

router.delete('/', (req, res) => { 
        res.send("DELETE Request Called"); 
    }) 

module.exports = router;