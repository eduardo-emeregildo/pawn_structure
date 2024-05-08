//this file contains all the functions that interact with the tcl script files

//To do: incorporate these functions to the routes
//*******make a test file after I finish all functions before adding them to the routes********.

// for tomorrow, finish the other routes, add JWT signing, add error handling
const {spawn,spawnSync} = require('child_process');
const path = require('path');
const fs = require('fs');
const {Client} = require('pg');

const options = { cwd: path.join(__dirname,'Scid vs PC-4.24','bin')};

async function query(baseName,query,filename){
    console.log("Running child process..");
    let child = spawnSync('tcscid',[path.join(__dirname,'query.tcl'), baseName,query,filename],options);
    console.log("Now making table on sql db..");
    const result = fs.readFileSync('auth.json', 'utf8');
    const client = new Client(JSON.parse(result));
    await client.connect();
    await client.query(`CREATE TABLE ${filename.slice(0,-4)}(
        gamenumber INTEGER,
        whitename VARCHAR(15),
        blackname VARCHAR(15),
        whiteelo SMALLINT,
        blackelo SMALLINT,
        result CHAR(1)
    )`);
    await client.end();

    let sql = spawnSync('psql',['-U','postgres','-a','-w','-d','pawn_structure', '-c',
    `\\COPY ${filename.slice(0,-4)} FROM 'C:\\Users\\emere\\Desktop\\pawn_structure_project\\pawn_structure\\Scid vs PC-4.24\\bin\\${filename}' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';`]);

    fs.unlinkSync(path.join(__dirname,'Scid vs PC-4.24','bin',filename));
    console.log("Deleted csv");

}

function getPgn(baseName,gameNumber){
    console.log("Running child process..");
    let child = spawnSync('tcscid',[path.join(__dirname,'getPgn.tcl'), baseName,gameNumber],options);
    return child.stdout.toString();
}


async function getGameInfo(tablename,offset){
// gets the game info of the tablename specified, gets 15 game info given the offset
// offset = 0 gets the first 15 games, offset 1, gets games 16-30 etc
    const result = fs.readFileSync('auth.json','utf8');
    const client = new Client(JSON.parse(result));
    await client.connect();
    let output = await client.query(`SELECT * FROM ${tablename} LIMIT 15 OFFSET ${offset*15}`);
    // console.log("data is: ", output.rows);
    await client.end();
    return output.rows;
}

async function deleteTable(tablename){
// deletes custom table that the user has made once they exit or if they make another custom table.
// Only one custom table will be in the db per user. On the front end it will keep track of the current custom table
// so the tablename will be retrieved from there.
// the front end will receive the JWT from the query function

// All this JWT stuff will be handled on the route. If auth was successful, then call this function

// One thing im also seeing is if two users are using a custom table, and one leaves, in this case table shouldnt be deleted since
// there is a user using it

    const result = fs.readFileSync('auth.json','utf8');
    const client = new Client(JSON.parse(result));
    await client.connect();
    await client.query(`DROP TABLE ${tablename}`);
    await client.end();
    console.log(`TABLE ${tablename} deleted`);
}


// query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d ?@-pattern@0 wp c ?@-pattern@0 wp e ?','whiteiqp.csv');

// async function test(){
//     // let ass = await getGameInfo("whiteiqp",0);
//     // console.log("ass is: ",ass);
//     await query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d ?@-pattern@0 wp c ?@-pattern@0 wp e ?','whiteiqp.csv');
//     console.log("DONE WITH QUERY FUNCTION");
// }
// test();

// let ok = getPgn("LumbrasGigaBase",3);
// console.log(ok);

// deleteTable("whiteiqp");


module.exports = {
    deleteTable,
    query,
    getGameInfo,
    getPgn
}