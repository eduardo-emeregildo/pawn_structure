# ./tcscid C:\Users\emere\Desktop\pawn_structure_project\pawn_structure\test.tcl 1
sc_base open IQP

set res [sc_game list [lindex $argv 0] 15 g@w15@b15@W@B@r]
puts "$res"