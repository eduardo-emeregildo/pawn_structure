//this file contains all the functions that interact with the tcl script files

// for tomorrow, test jwt protection some more, add more error handling, add the default tables in db, figure out naming convention for custom tables, start working on front end
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const buffer = require("buffer");
const { Client } = require("pg");

const options = { cwd: path.join(__dirname, "Scid vs PC-4.24", "bin") };

const defaultTables = {
  IQP: true,
  HP: true,
  Carlsbad: true,
  Slav: true,
  Stonewall: true,
  Sicilian: true,
  SicilianD5: true,
  Maroczy: true,
  Benoni: true,
  Kid: true,
  French: true,
  CRL: true,
};

async function query(baseName, query, filename) {
  console.log("Running child process..");
  let child = spawnSync(
    "tcscid",
    [path.join(__dirname, "query.tcl"), baseName, query, filename],
    options
  );

  if (child.stdout.toString() == "0") {
    return false;
  }

  console.log("Now making table on sql db..");
  const result = fs.readFileSync("auth.json", "utf8");
  const client = new Client(JSON.parse(result));
  await client.connect();
  await client.query(`DROP TABLE IF EXISTS ${filename.slice(0, -4)}`);
  await client.query(`CREATE TABLE IF NOT EXISTS ${filename.slice(0, -4)}(
        gamenumber INTEGER,
        whitename VARCHAR(15),
        blackname VARCHAR(15),
        whiteelo SMALLINT,
        blackelo SMALLINT,
        result CHAR(1)
    )`);
  await client.end();

  let sql = spawnSync("psql", [
    "-U",
    "postgres",
    "-a",
    "-w",
    "-d",
    "pawn_structure",
    "-c",
    `\\COPY ${filename.slice(
      0,
      -4
    )} FROM 'C:\\Users\\emere\\Desktop\\pawn_structure_project\\pawn_structure\\Scid vs PC-4.24\\bin\\${filename}' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';`,
  ]);

  fs.unlinkSync(path.join(__dirname, "Scid vs PC-4.24", "bin", filename));
  console.log("Deleted csv");
  return true;
}

async function newQuery(baseName, filename) {
  console.log("Running child process..");
  let child = spawnSync(
    "tcscid",
    [path.join(__dirname, "newQuery.tcl"), baseName, filename],
    options
  );

  if (child.stdout.toString() == "0") {
    return false;
  }

  console.log("Now making table on sql db..");
  const result = fs.readFileSync("auth.json", "utf8");
  const client = new Client(JSON.parse(result));
  await client.connect();
  await client.query(`DROP TABLE IF EXISTS ${filename.slice(0, -4)}`);
  await client.query(`CREATE TABLE IF NOT EXISTS ${filename.slice(0, -4)}(
        gamenumber INTEGER,
        whitename VARCHAR(15),
        blackname VARCHAR(15),
        whiteelo SMALLINT,
        blackelo SMALLINT,
        result CHAR(1)
    )`);
  await client.end();

  let sql = spawnSync("psql", [
    "-U",
    "postgres",
    "-a",
    "-w",
    "-d",
    "pawn_structure",
    "-c",
    `\\COPY ${filename.slice(
      0,
      -4
    )} FROM 'C:\\Users\\emere\\Desktop\\pawn_structure_project\\pawn_structure\\Scid vs PC-4.24\\bin\\${filename}' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';`,
  ]);

  fs.unlinkSync(path.join(__dirname, "Scid vs PC-4.24", "bin", filename));
  console.log("Deleted csv");
  return true;
}

function getPgn(baseName, gameNumber) {
  console.log("Running child process..");
  let child = spawnSync(
    "tcscid",
    [path.join(__dirname, "getPgn.tcl"), baseName, gameNumber],
    options
  );
  return child.stdout.toString();
}

async function getGameInfo(tablename, offset) {
  // gets the game info of the tablename specified, gets 15 game info given the offset
  // offset = 0 gets the first 15 games, offset 1, gets games 16-30 etc
  const result = fs.readFileSync("auth.json", "utf8");
  const client = new Client(JSON.parse(result));
  await client.connect();
  let output = await client.query(
    `SELECT * FROM ${tablename} ORDER BY gamenumber LIMIT 15 OFFSET ${
      offset * 15
    }`
  );
  // console.log("data is: ", output.rows);
  await client.end();
  return output.rows;
}

async function newGetGameInfo(baseName, startNum, endNum) {
  // getting game info using the small database I made for the common ps and tcl script. Gets game info from startNum to endNum(these are the game numbers in the small db)
  let child = spawnSync(
    "tcscid",
    [path.join(__dirname, "getGameInfo.tcl"), baseName, startNum, endNum],
    options
  );

  const latin1Buffer = buffer.transcode(
    Buffer.from(child.stdout.toString()),
    "utf8",
    "latin1"
  );
  let latin1String = latin1Buffer.toString("latin1");
  // console.log(latin1String);
  // let output = child.stdout.toString();
  latin1String = latin1String.split("\r");
  console.log("Output is: ", latin1String);
}

async function deleteTable(tablename) {
  // deletes custom table that the user has made once they exit or if they make another custom table.
  // Only one custom table will be in the db per user. On the front end it will keep track of the current custom table
  // so the tablename will be retrieved from there.
  // the front end will receive the JWT from the query function

  // All this JWT stuff will be handled on the route. If auth was successful, then call this function

  // deletetable should be protected, also getPgn and getGameInfo should be protected if the table you are searching is a custom table

  // the custom table should have a unique name per client

  //********************* */
  // To keep this api stateless, I cant do the approach of keeping track of which user created which table
  // What I will do to delete a table is use JWT to authenticate who can delete tables.
  // This api should only be accessed by the client url and not allow anyone else to access it. This is I can manage the tables that exist in db.(If anyone can access the api, they can just send query requests and never call delete table, which would bloat the db)
  //This is something im going to have to change with CORS

  //The duplicate table case is something I will have to address later as well. might just make it so everyone has their own unique table.

  const result = fs.readFileSync("auth.json", "utf8");
  const client = new Client(JSON.parse(result));
  await client.connect();

  try {
    await client.query(`DROP TABLE ${tablename}`);
  } catch (error) {
    await client.end();
    return false;
  }

  await client.end();
  return true;
}

async function makeTables() {
  await newQuery("IQP", "IQP.csv");

  await newQuery("HP", "HP.csv");

  await newQuery("Carlsbad", "Carlsbad.csv");

  await newQuery("Slav", "Slav.csv");

  await newQuery("Stonewall", "Stonewall.csv");

  await newQuery("Sicilian", "Sicilian.csv");

  await newQuery("SicilianD5", "SicilianD5.csv");

  await newQuery("Maroczy", "Maroczy.csv");

  await newQuery("Benoni", "Benoni.csv");

  await newQuery("Kid", "Kid.csv");

  await newQuery("French", "French.csv");

  await newQuery("CRL", "CRL.csv");
}
// makeTables();

// query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d ?@-pattern@0 wp c ?@-pattern@0 wp e ?','whiteiqp.csv');

///////////////////////////////////////////final queries

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp d 4@-pattern@0 wp c ?@-pattern@0 wp e ?",
//   "IQP.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@2 8@-bp@0 8@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp d ?@-pattern@1 wp c ?@-pattern@0 wp b ?@-pattern@0 wp e ?",
//   "HP.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@7 7@-bp@7 7@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp f 2@-pattern@1 wp e 3@-pattern@1 wp d 4@-pattern@0 wp c ?@-pattern@1 bp d 5@-pattern@0 bp e ?",
//   "Carlsbad.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@7 7@-bp@7 7@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp d 4@-pattern@0 wp c ?@-pattern@0 bp d ?@-pattern@1 bp c 6@-pattern@1 bp e 6",
//   "Slav.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@3 8@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp d 4@-pattern@1 bp d 5@-pattern@1 bp e 6@-pattern@1 bp f 5",
//   "Stonewall.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@7 7@-bp@7 7@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp e 4@-pattern@0 wp d ?@-pattern@0 bp c ?@-pattern@1 bp d 6@-pattern@1 bp e 5",
//   "Sicilian.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@7 7@-bp@7 7@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp d 5@-pattern@0 wp e ?@-pattern@0 bp c ?@-pattern@1 bp d 6@-pattern@1 bp e 5",
//   "SicilianD5.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@7 7@-bp@7 7@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp e 4@-pattern@1 wp c 4@-pattern@0 wp d ?@-pattern@1 bp g 6@-pattern@0 bp c ?",
//   "Maroczy.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@7 7@-bp@7 7@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp e 4@-pattern@1 wp d 5@-pattern@0 wp c ?@-pattern@1 bp d 6@-pattern@1 bp c 5@-pattern@0 bp e ?",
//   "Benoni.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@8 8@-bp@8 8@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp e 4@-pattern@1 wp d 5@-pattern@1 wp c 4@-pattern@1 bp d 6@-pattern@1 bp e 5@-pattern@1 bp c 7",
//   "Kid.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@2 8@-bp@3 8@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp d 4@-pattern@1 wp e 5@-pattern@1 bp d 5@-pattern@1 bp e 6@-pattern@1 bp f 7",
//   "French.csv"
// );

// query(
//   "LumbrasGigaBase",
//   "-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@3 8@-bp@4 8@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp e 4@-pattern@1 wp d 5@-pattern@1 wp c 3@-pattern@1 bp c 4@-pattern@1 bp b 5@-pattern@1 bp e 5@-pattern@1 bp d 6",
//   "CRL.csv"
// );

////////////////////////////////////////////////////////////
// async function test() {
//   //let ass = await newGetGameInfo("LumbrasGigaBase", "90", "105");
//   // let res = await query('LumbrasGigaBase','-wq@0 2@-bq@0 2@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-pattern@1 wp d 1','whiteiqp.csv');
//   // console.log("DONE WITH QUERY FUNCTION", res);
// }
// test();

// let ok = getPgn("IQP", 41);
// console.log(ok);

// deleteTable("whiteiqp");
module.exports = {
  deleteTable,
  query,
  getGameInfo,
  getPgn,
  defaultTables,
};
