#script to get pgn given the database name and game number

#command to run is: ./tcscid path\to\getPgn.tcl baseName gameNumber halfMoves

#halfMoves being the number of halfMoves to progress in the game before getting the fen. This is calculated from the movenumber field in the psql table in js.
#might need to write to a file instead of printing the pgn and catching the output as a when this is called as child process in node

sc_base open [lindex $argv 0]
set pgn [sc_game pgn -gameNumber [lindex $argv 1]]
sc_game load [lindex $argv 1]
sc_move forward [lindex $argv 2]
set fen [sc_pos fen]

puts "$pgn:FEN:$fen"