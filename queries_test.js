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






// query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d ?@-pattern@0 wp c ?@-pattern@0 wp e ?','works.txt');

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



