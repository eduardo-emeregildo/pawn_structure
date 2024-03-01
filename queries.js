const {spawn} = require('child_process')
const {execFile} = require('child_process')
const path = require('path')
// research execFile, callbacks,promises, async functions, arrow syntax
const options = { cwd: path.join(__dirname,'Scid vs PC-4.24','bin')}
function query(baseName,query,filename){
    var child = spawn('tcscid',[],options);
    child.stdin.setEncoding('utf-8');
    child.stdout.pipe(process.stdout);
    child.stdin.write(`sc_base open ${baseName}\n`);
    child.stdin.write(`${query}\n`);
    //might need to add unique naming
    child.stdin.write(`sc_base export filter PGN ${filename}.pgn \n`);
    child.stdin.end();

    child.stdout.on('data', (data) => {
        console.log(`child stdout:\n${data}`);
        });

    child.on('exit', function (code, signal) {
        console.log('child process exited with ' +
                    `code ${code} and signal ${signal}`);
      });
    
    child.on('error' , (error) => console.log(`error: ${error}`));
    
    child.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
    });

}
query('LumbrasGigaBase','sc_search material -wq {2 2}','out')

