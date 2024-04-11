//this file contains all the functions that interact with the tcl script files


//To do: write all functions
//*******make a test file after I finish all functions before adding them to the routes********.
const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');
const options = { cwd: path.join(__dirname,'Scid vs PC-4.24','bin')};

function query(baseName,query,filename){
    console.log("Running child process..");
    let child = spawn('tcscid',[path.join(__dirname,'query.tcl'), baseName,query,filename],options);

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

function getPgn(){

}

function getGameInfo(filename,startNum){
// gets the game info of the file specified, where start is which game to start. This function will return the game info of 15 games
//if start = 0, returns games 0-14, if start=15,return 15-29 
//filename has the file extension  
    const readStream = fs.createReadStream(path.join(__dirname,'Scid vs PC-4.24','bin',filename), {
        encoding: "utf-8",
    });

    readStream.on("data", (chunk) => {
        console.log(chunk);
    });

    //set up postgresql, and run sql query here

}

function deleteGames(){
//this function deletes the txt file containing the game info,
//might need another script that periodically checks for duplicate files and removes them
//reason is if multiple users made the same query, no need for dups to exists


}






// query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d ?@-pattern@0 wp c ?@-pattern@0 wp e ?','works.txt');

getGameInfo("whiteIQP.txt",0);

// const ok= spawn('node', ['--version']);
// ok.stdout.on('data', (data) => {
//   console.log(`child stdout:\n${data}`);
// });



//working example:

// const child = spawn('node',[],options);
// child.stdout.on('data', (data) => {
//     console.log(`stdout: "${data}"`);
// });

// child.stdin.write("for(let i = 0; i < 100;i++){console.log(i);}\n");
// child.stdin.write("console.log(`KAKA`);\n");
// child.stdin.end(); // EOF

// child.on('close', (code) => {
//     console.log(`Child process exited with code ${code}.`);
// });

// child.stdout.on('data', (data) => {
//     console.log(`child stdout:\n${data}`);
//     console.log("PLZ");
//     });



