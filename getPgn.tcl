#script to get pgn given the database name and game number

#command to run is: ./tcscid path\to\getPgn.tcl baseName gameNumber
#might need to write to a file instead of printing the pgn and catching the output as a when this is called as child process in node

sc_base open [lindex $argv 0]
set pgn [sc_game pgn -gameNumber [lindex $argv 1]]
puts "$pgn"