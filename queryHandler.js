//this file contains all the functions that interact with the tcl script files


//FOR TOMORROW: work on the query function. After creating the txt containing the gameinfo, on process close(or end) create the sql table,then delete txt file


//To do: write all functions
//*******make a test file after I finish all functions before adding them to the routes********.
const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');
const {Client,Pool} = require('pg');
const pgStream = require('pg-copy-streams');
const csvParser = require('csv-parser');

const options = { cwd: path.join(__dirname,'Scid vs PC-4.24','bin')};

function query(baseName,query,filename){
    console.log("Running child process..");
    let child = spawn('tcscid',[path.join(__dirname,'query.tcl'), baseName,query,filename],options);

    child.stdout.on('data', (data) => {
        console.log(`child stdout:\n${data}`);
        });

    child.on('close', function (code, signal) {
        // make a table on pawnstructure db
        console.log("Now making table on sql db..");
        fs.readFile('auth.json', 'utf8', (err, data) => {
            if (!err) {
                //write code to create table here


                let sql = spawn('psql',['-U','postgres','-a','-w','-d','pawn_structure', '-c',
                `\\COPY ${filename.slice(0,-4)} FROM 'C:\\Users\\emere\\Desktop\\pawn_structure_project\\pawn_structure\\Scid vs PC-4.24\\bin\\${filename}' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';`]);

                sql.stdout.on('data', (data) => {
                    console.log(`child stdout:\n${data}`);
                    });

                sql.on('close', function (code, signal) {
                    console.log('child process exited with ' +
                                `code ${code} and signal ${signal}`,'Delete csv file here!');
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

function deleteGames(){
//this function deletes the txt file containing the game info,
//might need another script that periodically checks for duplicate files and removes them
//reason is if multiple users made the same query, no need for dups to exists

}






// query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d ?@-pattern@0 wp c ?@-pattern@0 wp e ?','whiteiqp.csv');



// fs.readFile('auth.json', 'utf8',(err, data) => {
//     if (!err) {
//         let child = spawn('psql',['-U','postgres','-a','-w','-d','pawn_structure', '-c',`\\COPY whiteIQP FROM 'C:\\Users\\emere\\Desktop\\pawn_structure_project\\pawn_structure\\Scid vs PC-4.24\\bin\\whiteIQP.csv' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';`]);

//         child.stdout.on('data', (data) => {
//             console.log(`child stdout:\n${data}`);
//             });


//         // var client = new Client(JSON.parse(data));
//         // client.connect(function(err){
//         //     if (err) throw err;
//         //     // var stream = client.query(pgStream.from(`COPY whiteiqp FROM STDIN (DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1')`));
//         //     // var fileStream = fs.createReadStream(path.join(__dirname,'Scid vs PC-4.24','bin','whiteiqp.csv'));
//         //     // fileStream.pipe(stream);
//         //     // client.end();
//         //     let results = [];
//         //     let count =0;
//         //     const query = 'INSERT INTO "whiteiqp" (gamenumber,whitename,blackname,whiteelo,blackelo,result) VALUES ($1,$2,$3,$4,$5,$6)';
//         //     //for tomorrow, do the insert in the data event and clear the results array to deal with memory issues. The insert can happen after x amount of reads
//         //     fs.createReadStream(path.join(__dirname,'Scid vs PC-4.24','bin','whiteiqp.csv'))
//         //         .pipe(csvParser({separator: '@',quote: "$"}))
//         //         .on('data', async (row) => {
//         //             // write to table every 1000 rows read
//         //             results.push(row);
//         //             count++;
//         //             if(count == 1000){
//         //                 await Promise.all(
//         //                     results.map(async row => {
//         //                         const {gamenumber,whitename,blackname,whiteelo,blackelo,result} = row;
//         //                         const values = [gamenumber,whitename,blackname,whiteelo,blackelo,result];
//         //                         await client.query(query,values);
//         //                     })
    
//         //                 );
//         //                 count = 0;
//         //                 results = [];


//         //             }
//         //         })
//         //         .on('end', async () => {
//         //             // const query = 'INSERT INTO "whiteiqp" (gamenumber,whitename,blackname,whiteelo,blackelo,result) VALUES ($1,$2,$3,$4,$5,$6)';
//         //             if (count != 0)
//         //             {
//         //                 await Promise.all(
//         //                     results.map(async row => {
//         //                         const {gamenumber,whitename,blackname,whiteelo,blackelo,result} = row;
//         //                         const values = [gamenumber,whitename,blackname,whiteelo,blackelo,result];
//         //                         await client.query(query,values);
//         //                     })

//         //                 );
//         //             }
//         //             client.end();
//         //         });

//         // });
//         // var stream = client.query(pgStream.from(`COPY whiteiqp FROM STDIN (DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1')`));
//         // var fileStream = fs.createReadStream(path.join(__dirname,'Scid vs PC-4.24','bin','whiteiqp.csv'));
//         // fileStream.pipe(stream);
                
//     }
//     else{
//         console.log("error reading file: ",err);
//     }
// });




// getGameInfo("whiteiqp",0);
// getPgn("LumbrasGigaBase",3);



// const ok= spawn('node', ['--version']);
// ok.stdout.on('data', (data) => {
//   console.log(`child stdout:\n${data}`);
// });






