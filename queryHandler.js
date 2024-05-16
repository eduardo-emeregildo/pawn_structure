//this file contains all the functions that interact with the tcl script files

// for tomorrow, test jwt protection some more, add more error handling, add the default tables in db, start working on front end

//work on query.tcl to throw error if result of query is no games
const {spawnSync} = require('child_process');
const path = require('path');
const fs = require('fs');
const {Client} = require('pg');

const options = { cwd: path.join(__dirname,'Scid vs PC-4.24','bin')};

const defaultTables = {
    whiteiqp: true
}

async function query(baseName,query,filename){
    console.log("Running child process..");
    let child = spawnSync('tcscid',[path.join(__dirname,'query.tcl'), baseName,query,filename],options);


    if(child.stdout.toString() == "0"){
        return false;
    }

    console.log("Now making table on sql db..");
    const result = fs.readFileSync('auth.json', 'utf8');
    const client = new Client(JSON.parse(result));
    await client.connect(); 
    await client.query(`DROP TABLE IF EXISTS ${filename.slice(0,-4)}`);
    await client.query(`CREATE TABLE IF NOT EXISTS ${filename.slice(0,-4)}(
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
    return true;

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

// deletetable should be protected, also getPgn and getGameInfo should be protected if the table you are searching is a custom table


//********************* */
// To keep this api stateless, I cant do the approach of keeping track of which user created which table
// What I will do to delete a table is use JWT to authenticate who can delete tables.
// This api should only be accessed by the client url and not allow anyone else to access it. This is I can manage the tables that exist in db.(If anyone can access the api, they can just send query requests and never call delete table, which would bloat the db)
//This is something im going to have to change with CORS

//The duplicate table case is something I will have to address later as well. might just make it so everyone has their own unique table.

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
//     let res = await query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d 1','whiteiqp.csv');
//     console.log("DONE WITH QUERY FUNCTION", res);
// }
// test();



// let ok = getPgn("LumbrasGigaBase",3);
// console.log(ok);

// deleteTable("whiteiqp");
module.exports = {
    deleteTable,
    query,
    getGameInfo,
    getPgn,
    defaultTables
}