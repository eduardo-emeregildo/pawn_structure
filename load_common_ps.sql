-- psql -U postgres -d pawn_structure -a -f \i load_common_ps.sql 

--File used to create db and load game info of common ps from csv

DROP DATABASE IF Exists pawn_structure;
CREATE DATABASE pawn_structure;

\c pawn_structure

DROP TABLE IF EXISTS whiteIQP;

CREATE TABLE whiteIQP(
    gamenumber INTEGER,
    whitename TEXT,
    blackname TEXT,
    whiteelo INTEGER,
    blackelo INTEGER,
    result CHAR(1)

);

\COPY whiteIQP FROM 'C:\Users\emere\Desktop\pawn_structure_project\pawn_structure\Scid vs PC-4.24\bin\whiteIQP.csv' DELIMITER '@' CSV;