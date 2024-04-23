//this file contains all the functions that interact with the tcl script files


//FOR TOMORROW: figure out what to do with the deleteTables function. My idea was to track the current table with each user and
// delete that corresponding table once they exit. On the case where user creates multiple tables, only the current one is needed,
// so delete prior tables.


//To do: write all functions
//*******make a test file after I finish all functions before adding them to the routes********.
const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');
const {Client,Pool} = require('pg');

const options = { cwd: path.join(__dirname,'Scid vs PC-4.24','bin')};

function query(baseName,query,filename){
    console.log("Running child process..");
    let child = spawn('tcscid',[path.join(__dirname,'query.tcl'), baseName,query,filename],options);

    child.stdout.on('data', (data) => {
        console.log(`child stdout:\n${data}`);
        });

    child.on('close', function (code, signal) {
        console.log("Now making table on sql db..");
        fs.readFile('auth.json', 'utf8', async(err, data) => {
            if (!err) {
                //write code to create table here(withc client.query), uninstall dependencies that im not using, write code to delete csv after its been imported to sql table
                const client = new Client(JSON.parse(data));
                client.connect();
                await client.query(`CREATE TABLE ${filename.slice(0,-4)}(
                    gamenumber INTEGER,
                    whitename VARCHAR(15),
                    blackname VARCHAR(15),
                    whiteelo SMALLINT,
                    blackelo SMALLINT,
                    result CHAR(1)
                )`);
                await client.end();


                let sql = spawn('psql',['-U','postgres','-a','-w','-d','pawn_structure', '-c',
                `\\COPY ${filename.slice(0,-4)} FROM 'C:\\Users\\emere\\Desktop\\pawn_structure_project\\pawn_structure\\Scid vs PC-4.24\\bin\\${filename}' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';`]);

                sql.stdout.on('data', (data) => {
                    console.log(`child stdout:\n${data}`);
                    });

                sql.on('close', function (code, signal) {
                    console.log('child process exited with ' +
                                `code ${code} and signal ${signal}`,);

                    fs.unlink(path.join(__dirname,'Scid vs PC-4.24','bin',filename), (err) => {
                        if(!err){
                            console.log("Deleted csv");
                        }
                        else{
                            console.log("Error deleting csv ", err);
                        }
                    });
                    });

            }
            else{
                console.log("Error reading auth file: ",err);
            }
        });
      });
    
    child.on('error' , (error) => console.log(`error: ${error}`));
    
    child.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
    });
}

function getPgn(baseName,gameNumber){
    console.log("Running child process..");
    let child = spawn('tcscid',[path.join(__dirname,'getPgn.tcl'), baseName,gameNumber],options);

    child.stdout.on('data', (data) => {
        console.log(`child stdout:\n${data}`);
        });

    child.on('close', function (code, signal) {
        console.log('child process exited with ' +
                    `code ${code} and signal ${signal}`);
      });
    
    child.on('error' , (error) => console.log(`error: ${error}`));
    
    child.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
    });

}

function getGameInfo(tablename,offset){
// gets the game info of the tablename specified, gets 15 game info given the offset
// offset = 0 gets the first 15 games, offset 1, gets games 16-30 etc 
    fs.readFile('auth.json', 'utf8', (err, data) => {
        if (!err) {
            const client = new Client(JSON.parse(data));
            client.connect();
            client.query(`SELECT * FROM ${tablename} LIMIT 15 OFFSET ${offset*15}` , (err,res) =>{
                if(!err){
                    console.log(res.rows);
                }
                else{
                    console.log(err.message);
                }
                client.end();
            })
        }
        else{
            console.log(err);
        }
    });


}

function deleteTables(){
//this function deletes the tables which the current user has made,
//might need another script that periodically checks for duplicate files and removes them
//reason is if multiple users made the same query, no need for dups to exists

}


// query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d ?@-pattern@0 wp c ?@-pattern@0 wp e ?','whiteiqp.csv');

// getGameInfo("whiteiqp",0);
// getPgn("LumbrasGigaBase",3);