const express = require('express');
const router = express.Router();
const queryHandler = require("../../queryHandler");
const jwt = require('jsonwebtoken');
const checkAuth = require("../middleware/checkAuth");

//names of all default tables, fill once I've added default tables to db


// get gameinfo given the table name and offset, might need to add some logic to cover the case of custom table
// if custom table, will check header for auth token 
router.get('/:tableName/:offset', async (req,res,next) => {

    if(!(req.params.tableName in queryHandler.defaultTables) ){
        try{
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_KEY);
        }
        catch(error){
            return res.status(401).json({
                message: "Auth failed"
            });
        }


    } 

    const output = await queryHandler.getGameInfo(req.params.tableName,req.params.offset);

    res.status(200).json(
        {
            message: "Handling GET Requests to /queries/tablename/offset",
            tableName: req.params.tableName,
            offset: req.params.offset,
            output: output

        });
});

//req body is json with fields baseName,query,filename
router.post('/', async(req,res,next) => {
    //Here write the logic to execute the query tcl, just call query function from queries_test.js
    const result = await queryHandler.query(req.body.baseName,req.body.query,req.body.filename);

    if(!result){
        return res.status(204).json();
    }
    console.log("result");
    console.log("QUERY FINISHED!!!");
    const token = jwt.sign(
        {
        query: req.body.query,
        filename: req.body.filename
        },
    process.env.JWT_KEY,
        {

        expiresIn: "3h"
        });

    res.status(201).json(
        {
            message: "table has been made",
            token: token
        });
});

//req body will be tableName and token, holding the jwt token given 
router.delete('/:tableName', checkAuth,async(req, res) => {
    // will need some JWT, also the base tables can never be deleted. Only the custom table to according user can be deleted
    if(req.params.tableName in queryHandler.defaultTables){
        return res.status(401).json(
            {
                message: `Auth failed`
            });

    }

    const result = await queryHandler.deleteTable(req.params.tableName);

    if(!result){
        return res.status(404).json(
            {
                message: `${req.params.tableName} doesnt exist`
            });

    }

    res.status(200).json(
        {
            message: `Deleted ${req.params.tableName} table`
        });
    }) 

module.exports = router;