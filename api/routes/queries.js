const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {
    res.status(200).json(
        {
            message: "Handling GET Requests to /queries"
        });
});

router.post('/', (req,res,next) => {
    //Here write the logic to execute the query tcl, just call query function from queries_test.js
    res.status(200).json(
        {
            message: "Handling POST Requests to /queries"
        });
});

module.exports = router;