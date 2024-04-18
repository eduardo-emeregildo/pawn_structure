-- script to make a table for the pawn_structure db(this script is meant to be used for custom pawn structures)
--uses command line arg

-- psql -U postgres -a -f \i -v v1="'whiteiqp'" create_table.sql

\c pawn_structure
SET CLIENT_ENCODING TO 'LATIN1';
DROP TABLE IF EXISTS :v1 ;

CREATE TABLE :v1(
    gamenumber INTEGER,
    whitename VARCHAR(15),
    blackname VARCHAR(15),
    whiteelo SMALLINT,
    blackelo SMALLINT,
    result CHAR(1)

);

\COPY whiteIQP FROM 'C:\Users\emere\Desktop\pawn_structure_project\pawn_structure\Scid vs PC-4.24\bin\' || :v1 || '.csv' DELIMITER '@' CSV QUOTE '$' ENCODING 'LATIN1';

SELECT pg_size_pretty( pg_total_relation_size(:v1) );