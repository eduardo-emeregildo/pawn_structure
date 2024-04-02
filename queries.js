const {spawn,spawnSync,fork} = require('child_process');
const {execFile} = require('child_process');
const path = require('path');
const fs = require('fs');
// research execFile, callbacks,promises, async functions, arrow syntax

// input = fs.openSync('./input.txt','r');
// out = fs.openSync('./out.txt', 'a');
// err = fs.openSync('./err.txt', 'a');
const options = { cwd: path.join(__dirname,'Scid vs PC-4.24','bin'), shell: true};
// const stream = fs.createWriteStream('out.txt');

// todo: Use tcl to write the query script, its what the scid devs recommend
// https://www.npmjs.com/package/execa

// function query(baseName,query,filename){
//     console.log("Running child process..");
//     let child = spawn('tcscid',[],options);
//     child.stdin.setEncoding('utf-8');
//     // child.stdout.pipe(process.stdout);
//     child.stdin.write(`sc_base open ${baseName}\n`);
//     child.stdin.write(`${query}\n`);
//     //might need to add unique naming
//     child.stdin.write(`sc_base export filter PGN ${filename}.pgn -comments 0 -variations 0 -spaces 0\n`);
//     child.stdin.end();

//     child.stdout.on('data', (data) => {
//         console.log(`child stdout:\n${data}`);
//         });

//     child.on('close', function (code, signal) {
//         console.log('child process exited with ' +
//                     `code ${code} and signal ${signal}`);
//       });
    
//     child.on('error' , (error) => console.log(`error: ${error}`));
    
//     child.stderr.on('data', (data) => {
//     console.error(`child stderr:\n${data}`);
//     });
// }

function newQuery(baseName,query){
    let child = spawn('tcscid',[],options);
    console.log("Running child process, pid: ", child.pid);
    
    // child.stdout.on('pause', () => {
    //     console.log("Pause event");
    // });
    // child.stdout.pipe(process.stdout);

    // child.stdout.on('end', () => {
    //     console.log("end event");
    //     console.log(child.stdout.read());
    // });

    // child.stdout.on('readable', () => {
    //         console.log("Readable event");
    //         console.log(child.stdout.read());


    //     });

    // child.stdout.on('resume', () => {
    //     console.log("resume event");
    // });

    child.stdin.setEncoding('utf-8');
    child.stdin.write(`sc_base open ${baseName}\n`);  
    child.stdin.write(`${query}\n`);
   
    child.stdin.write('sc_filter count\n');

    child.stdin.end();

    child.stdout.on('data', (data) => {
        console.log(`stdout: "${data}"`);
    });
    // console.log(child.output);
   
    // child.stdout.pipe(process.stdout);

    child.on('close', function (code, signal) {
        console.log('child process exited with ' +
                    `code ${code} and signal ${signal}`);
 
      });
    
    child.on('error' , (error) => console.log(`error: ${error}`));
    
    // child.stderr.on('data', (data) => {
    // console.error(`child stderr:\n${data}`);
    // });
  


}


// query('LumbrasGigaBase','sc_search material -wq {0 2} -bq {0 2} -wr {0 2} -br {0 2} -wn {0 2} -bn {0 2} -wm {0 4} -bm {0 4} -wp {1 8} -bp {0 8} -wb {0 2} -bb {0 2} -range {1 20} -pattern {1 wp d ?} -pattern {0 wp c ?} -pattern {0 wp e ?}','whiteIQP');


newQuery('LumbrasGigaBase','sc_search material -wq {0 2} -bq {0 2} -wr {0 2} -br {0 2} -wn {0 2} -bn {0 2} -wm {0 4} -bm {0 4} -wp {1 8} -bp {0 8} -wb {0 2} -bb {0 2} -range {1 20} -pattern {1 wp d ?} -pattern {0 wp c ?} -pattern {0 wp e ?}');



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



