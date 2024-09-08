//this file contains all the functions that interact with the tcl script files

// for tomorrow, test jwt protection some more, add more error handling, add the default tables in db, figure out naming convention for custom tables, start working on front end
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const buffer = require("buffer");
const { Client } = require("pg");
require("dotenv").config();

const options = {
  // cwd: path.join(__dirname, "scid", "scid_vs_pc-4.19"),
  cwd: path.join(__dirname, "..", "bin"),
  encoding: "latin1",
};

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

function getPgn(baseName, gameNumber, moveNumber) {
  let side = moveNumber % 10;
  let move = ~~(moveNumber / 10);
  let halfMoves = move * 2;
  halfMoves = side == 1 ? halfMoves - 2 : halfMoves - 1;
  console.log("SIDE IS ", side, " AND MOVE IS: ", move);
  console.log("halfMoves is: ", halfMoves);
  console.log("Running child process..");
  let child = spawnSync(
    "tcscid",
    [path.join(__dirname, "getPgn.tcl"), baseName, gameNumber, halfMoves],
    options
  );
  return child.stdout.toString() + `:FEN:${halfMoves}`;
}

async function getGameInfo(tablename, offset) {
  // gets the game info of the tablename specified, gets 15 game info given the offset
  // offset = 0 gets the first 15 games, offset 1, gets games 16-30 etc
  // const result = fs.readFileSync("auth.json", "utf8");
  // const client = new Client(JSON.parse(result));
  const connectionString = process.env.CONNECTION_STRING;
  const client = new Client({
    connectionString,
  });
  await client.connect();
  await client.query("SET CLIENT_ENCODING=LATIN1");
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

module.exports = {
  getGameInfo,
  getPgn,
  defaultTables,
};
