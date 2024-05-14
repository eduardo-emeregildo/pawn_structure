-- psql -U postgres -a -f create_db.sql 

--script used to set up the pawn structure database given the csv's of the default pawn structures(iqp,slav,etc)

-- psql -U postgres -a -w -d pawn_structure -c "\COPY whiteIQP FROM 'C:\Users\emere\Desktop\pawn_structure_project\pawn_structure\Scid vs PC-4.24\bin\whiteIQP.csv' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';"

DROP DATABASE IF Exists pawn_structure;
CREATE DATABASE pawn_structure;

\c pawn_structure

SET CLIENT_ENCODING TO 'LATIN1';
DROP TABLE IF EXISTS whiteIQP;

CREATE TABLE whiteIQP(
    gamenumber INTEGER,
    whitename VARCHAR(15),
    blackname VARCHAR(15),
    whiteelo SMALLINT,
    blackelo SMALLINT,
    result CHAR(1)

);


-- \COPY whiteIQP FROM 'C:\Users\emere\Desktop\pawn_structure_project\pawn_structure\Scid vs PC-4.24\bin\whiteIQP.csv' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';

-- SELECT pg_size_pretty( pg_total_relation_size('whiteiqp') );